import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    contentHtml: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    postId: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true,
        default: 'https://picsum.photos/800/600?random=1'
    },
    updatedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
