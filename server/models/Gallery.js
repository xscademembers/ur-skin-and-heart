import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
    },
    filename: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
