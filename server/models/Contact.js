import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    preferredDate: {
        type: Date
    },
    source: {
        type: String,
        required: true,
        enum: ['Contact Page', 'Cardiology', 'Dermatology', 'General']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
