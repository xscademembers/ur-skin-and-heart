import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { Contact } from '../server/models/Contact.js';
import { Blog } from '../server/models/Blog.js';
import { Gallery } from '../server/models/Gallery.js';

// Prefer IPv4 for DNS (helps some serverless / dual-stack environments)
try {
    dns.setDefaultResultOrder?.('ipv4first');
} catch {
    /* ignore */
}

const app = express();

app.use(cors());

// Vercel rewrites send requests to this function; `req.url` is often the path *after*
// `/api` (e.g. `/contacts`) while routes are registered as `/api/contacts`. Normalize
// so production matches the same paths as local full-URL Express.
app.use((req, _res, next) => {
    const raw = req.originalUrl || req.url || '/';
    const pathOnly = raw.split(/[?#]/)[0] || '';
    if (pathOnly && !pathOnly.startsWith('/api')) {
        const rest = raw.slice(pathOnly.length);
        req.url = `/api${pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`}${rest}`;
    } else {
        req.url = raw;
    }
    next();
});

app.use(express.json({ limit: '12mb' }));

const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif|avif)$/i.test(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
});

function normalizeMongoUri(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let u = raw.trim();
    if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
        u = u.slice(1, -1).trim();
    }
    return u;
}

function mongoConnectUserMessage(err) {
    const msg = err?.message || String(err);
    if (/querySrv|ENOTFOUND|getaddrinfo/i.test(msg)) {
        return (
            `${msg} ` +
            'Atlas host not found (DNS). In Vercel → Settings → Environment Variables, set MONGODB_URI to the exact connection string from MongoDB Atlas (Database → Connect → Drivers). ' +
            'Check every character in the *.mongodb.net hostname—a typo in the random id (e.g. …06dy… vs …06dyi…) causes this. ' +
            'If SRV keeps failing, use the "Standard connection string" (mongodb://…) from the same Connect screen.'
        );
    }
    if (/bad auth|authentication failed|SCRAM/i.test(msg)) {
        return `${msg} Check the database username and password in MONGODB_URI (Atlas → Database Access).`;
    }
    return msg;
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return;
    const uri = normalizeMongoUri(process.env.MONGODB_URI);
    if (!uri) {
        throw new Error('Missing MONGODB_URI in environment');
    }
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            family: 4,
        });
    } catch (e) {
        throw new Error(mongoConnectUserMessage(e));
    }
}

app.get('/api/health', async (_req, res) => {
    try {
        await connectToDatabase();
        const [contactsCount, blogsCount, galleryCount] = await Promise.all([
            Contact.countDocuments(),
            Blog.countDocuments(),
            Gallery.countDocuments(),
        ]);
        return res.json({
            success: true,
            mongoConnected: mongoose.connection.readyState === 1,
            counts: { contacts: contactsCount, blogs: blogsCount, gallery: galleryCount },
        });
    } catch (e) {
        return res.status(503).json({ success: false, message: e.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { password } = req.body || {};
        if (!process.env.ADMIN_PASSWORD) {
            return res.status(500).json({ success: false, message: 'Server missing ADMIN_PASSWORD' });
        }
        if (password === process.env.ADMIN_PASSWORD) {
            return res.json({ success: true, message: 'Login successful' });
        }
        res.status(401).json({ success: false, message: 'Invalid password' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const ALLOWED_CONTACT_SOURCES = new Set(['Contact Page', 'Cardiology', 'Dermatology', 'General']);

function coerceContactPayload(body) {
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const rawEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const email = rawEmail || undefined;
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : undefined;
    const message = typeof body?.message === 'string' ? body.message.trim() : undefined;
    let source = typeof body?.source === 'string' ? body.source.trim() : 'General';
    if (!ALLOWED_CONTACT_SOURCES.has(source)) source = 'General';

    let preferredDate;
    const pd = body?.preferredDate;
    if (pd != null && pd !== '') {
        const d = pd instanceof Date ? pd : new Date(pd);
        if (!Number.isNaN(d.getTime())) preferredDate = d;
    }

    return { name, phone, email, subject, message, preferredDate, source };
}

function isMongoUnavailableError(msg) {
    return /Missing MONGODB_URI|ENOTFOUND|querySrv|Server selection timed out|MongooseServerSelectionError|Atlas host not found/i.test(
        String(msg || '')
    );
}

app.post('/api/contacts', async (req, res) => {
    try {
        await connectToDatabase();
        const payload = coerceContactPayload(req.body);
        if (!payload.name || !payload.phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }
        const newContact = new Contact(payload);
        const savedContact = await newContact.save();
        res.status(201).json({ success: true, message: 'Contact saved successfully', data: savedContact });
    } catch (error) {
        console.error('Save Error:', error);
        if (error.name === 'ValidationError') {
            const msg = Object.values(error.errors || {})
                .map((e) => e.message)
                .join('; ');
            return res.status(400).json({ success: false, message: msg || 'Validation failed' });
        }
        const rawMsg = error.message || 'Server Error';
        const status = isMongoUnavailableError(rawMsg) ? 503 : 500;
        res.status(status).json({ success: false, message: rawMsg });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
        await connectToDatabase();
        const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/blogs', async (req, res) => {
    try {
        await connectToDatabase();
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: blogs.map((doc) => ({ ...doc, _id: String(doc._id) })) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid blog ID format' });
        }
        const blog = await Blog.findById(id).lean();
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, data: { ...blog, _id: String(blog._id) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        await connectToDatabase();
        const { title, excerpt, author, category } = req.body || {};
        if (!title || !excerpt || !author || !category) {
            return res.status(400).json({ success: false, message: 'title, excerpt, author and category are required' });
        }
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json({ success: true, message: 'Blog created successfully', data: { ...savedBlog.toObject(), _id: String(savedBlog._id) } });
    } catch (error) {
        console.error('Blog Save Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/blogs/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const { title, excerpt, author, category } = req.body || {};
        if (!title || !excerpt || !author || !category) {
            return res.status(400).json({ success: false, message: 'title, excerpt, author and category are required' });
        }
        const updated = await Blog.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, message: 'Blog updated successfully', data: { ...updated, _id: String(updated._id) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/gallery', async (_req, res) => {
    try {
        await connectToDatabase();
        const items = await Gallery.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: items.map((d) => ({ ...d, _id: String(d._id) })) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/gallery', uploadMemory.single('image'), async (req, res) => {
    try {
        await connectToDatabase();
        let imageUrl = (req.body && req.body.imageUrl) ? String(req.body.imageUrl).trim() : '';
        let filename;

        if (req.file && req.file.buffer) {
            imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            filename = req.file.originalname || 'upload';
        }

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image file or imageUrl is required' });
        }

        const title = (req.body.title || '').trim();
        const description = (req.body.description || '').trim();

        const doc = await Gallery.create({ title, description, imageUrl, filename });
        res.status(201).json({
            success: true,
            message: 'Image uploaded',
            data: { ...doc.toObject(), _id: String(doc._id) },
        });
    } catch (error) {
        console.error('Gallery Save Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const removed = await Gallery.findByIdAndDelete(req.params.id);
        if (!removed) {
            return res.status(404).json({ success: false, message: 'Gallery item not found' });
        }
        res.json({ success: true, message: 'Gallery item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
});

export default app;
