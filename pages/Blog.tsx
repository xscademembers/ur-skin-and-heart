import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    content?: string;
    createdAt: string;
    author: string;
    category: string;
    imageUrl?: string;
}

const calcReadingTime = (text: string) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min read`;
};

export const BlogPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('/api/blogs');
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-brand-surface min-h-screen pt-24 pb-20">

            {/* Header Section */}
            <div className="bg-brand-blue py-16 mb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 font-sans"
                    >
                        Health & Wellness Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-100/90 text-lg max-w-2xl mx-auto"
                    >
                        Expert insights, tips, and news from our specialists to help you live a healthier life.
                    </motion.p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No blog posts yet.</p>
                        <p className="mt-2">Check back soon for health tips and insights from our specialists!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-stone-100 flex flex-col h-full"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden group">
                                    <img
                                        src={post.imageUrl || `https://picsum.photos/800/600?random=${post._id}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.createdAt)}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {calcReadingTime(`${post.excerpt} ${post.content || ''}`)}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-brand-blue mb-3 font-sans line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-stone-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between group border-stone-200 hover:border-brand-blue hover:bg-blue-50"
                                            onClick={() => navigate(`/blog/${post._id}`, { state: { blog: post } })}
                                        >
                                            Read Article <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
