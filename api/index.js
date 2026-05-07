import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Contact } from '../server/models/Contact.js';
import { Blog } from '../server/models/Blog.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (with caching for serverless)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    const connection = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });

    cachedDb = connection;
    return connection;
}

// Contact Routes
app.post('/api/contacts', async (req, res) => {
    try {
        await connectToDatabase();
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        console.log('📝 New Contact Saved:', savedContact.name);
        res.status(201).json({ success: true, message: 'Contact saved successfully', data: savedContact });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
        await connectToDatabase();
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// Blog Routes
app.get('/api/blogs', async (req, res) => {
    try {
        await connectToDatabase();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// GET: Retrieve a single blog by ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid blog ID format' });
        }
        
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, data: blog });
    } catch (error) {
        console.error('Blog Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        await connectToDatabase();
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        console.log('📝 New Blog Created:', savedBlog.title);
        res.status(201).json({ success: true, message: 'Blog created successfully', data: savedBlog });
    } catch (error) {
        console.error('Blog Save Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        console.log('🗑️ Blog Deleted:', deletedBlog.title);
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Blog Delete Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

export default app;
