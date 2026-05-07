import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';

interface GalleryItem {
    _id: string;
    title?: string;
    description?: string;
    imageUrl: string;
    createdAt: string;
}

export const GalleryPage: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (!cancelled && data.success) setItems(data.data);
                else if (!cancelled) setError('Failed to load gallery');
            } catch (err) {
                if (!cancelled) setError('Failed to load gallery');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCF8] pt-24 pb-20 font-sans text-brand-blue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Our Gallery
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Explore our state-of-the-art facilities and success stories.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-20">Loading gallery...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-20">{error}</div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <ImageOff size={48} className="mb-4" />
                        <p className="text-lg">No gallery images yet.</p>
                        <p className="text-sm">Check back soon for updates.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[4/3] rounded-3xl mb-4 overflow-hidden relative shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-100">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title || 'Gallery image'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                {(item.title || item.description) && (
                                    <div className="px-2">
                                        {item.title && (
                                            <h3 className="text-xl font-bold mb-1 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                        )}
                                        {item.description && (
                                            <p className="text-gray-400 text-sm">{item.description}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
