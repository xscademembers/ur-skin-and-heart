import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import { list, getById, create, remove, update } from './store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const uploadsDir = path.join(projectRoot, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
        cb(null, safe);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif|avif)$/i.test(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    },
});

app.post('/api/login', (req, res) => {
    const { password } = req.body || {};
    if (password && password === process.env.ADMIN_PASSWORD) {
        return res.json({ success: true, message: 'Login successful' });
    }
    res.status(401).json({ success: false, message: 'Invalid password' });
});

app.post('/api/contacts', (req, res) => {
    try {
        const { name, phone } = req.body || {};
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }
        const saved = create('contacts', req.body);
        console.log('New Contact Saved:', saved.name);
        res.status(201).json({ success: true, message: 'Contact saved successfully', data: saved });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.get('/api/contacts', (_req, res) => {
    try {
        res.json({ success: true, data: list('contacts') });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.get('/api/blogs', (_req, res) => {
    try {
        res.json({ success: true, data: list('blogs') });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.get('/api/blogs/:id', (req, res) => {
    try {
        const blog = getById('blogs', req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.post('/api/blogs', (req, res) => {
    try {
        const { title, excerpt, author, category } = req.body || {};
        if (!title || !excerpt || !author || !category) {
            return res.status(400).json({ success: false, message: 'title, excerpt, author and category are required' });
        }
        const saved = create('blogs', req.body);
        console.log('New Blog Created:', saved.title);
        res.status(201).json({ success: true, message: 'Blog created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.put('/api/blogs/:id', (req, res) => {
    try {
        const { title, excerpt, author, category } = req.body || {};
        if (!title || !excerpt || !author || !category) {
            return res.status(400).json({ success: false, message: 'title, excerpt, author and category are required' });
        }
        const updated = update('blogs', req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, message: 'Blog updated successfully', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.delete('/api/blogs/:id', (req, res) => {
    try {
        const removed = remove('blogs', req.params.id);
        if (!removed) return res.status(404).json({ success: false, message: 'Blog not found' });
        console.log('Blog Deleted:', removed.title);
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.get('/api/gallery', (_req, res) => {
    try {
        res.json({ success: true, data: list('gallery') });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.post('/api/gallery', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }
        const { title = '', description = '' } = req.body || {};
        const saved = create('gallery', {
            title: title.trim(),
            description: description.trim(),
            imageUrl: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
        });
        console.log('New Gallery Item:', saved.title || saved.filename);
        res.status(201).json({ success: true, message: 'Image uploaded', data: saved });
    } catch (error) {
        console.error('Gallery Save Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.delete('/api/gallery/:id', (req, res) => {
    try {
        const removed = remove('gallery', req.params.id);
        if (!removed) return res.status(404).json({ success: false, message: 'Gallery item not found' });
        if (removed.filename) {
            const fp = path.join(uploadsDir, removed.filename);
            if (fs.existsSync(fp)) {
                try { fs.unlinkSync(fp); } catch (err) { console.warn('Could not remove file:', err.message); }
            }
        }
        res.json({ success: true, message: 'Gallery item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        res.sendFile(path.join(distDir, 'index.html'));
    });
} else {
    console.warn(`Frontend build not found at ${distDir}. Run "npm run build" before starting in single-server mode.`);
}

app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
