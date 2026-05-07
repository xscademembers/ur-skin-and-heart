import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { Contact } from '../server/models/Contact.js';
import { Blog } from '../server/models/Blog.js';
import { Gallery } from '../server/models/Gallery.js';

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

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('Missing MONGODB_URI in environment');
    }
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 12000,
    });
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

app.post('/api/contacts', async (req, res) => {
    try {
        await connectToDatabase();
        const { name, phone } = req.body || {};
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        res.status(201).json({ success: true, message: 'Contact saved successfully', data: savedContact });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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
