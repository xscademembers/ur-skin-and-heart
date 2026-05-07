
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Phone, Mail, MessageSquare, Database, LogOut, FileText, Users, Plus, Trash2, X, Image as ImageIcon, Upload, Pencil } from 'lucide-react';

interface ContactSubmission {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    subject?: string;
    message?: string;
    preferredDate?: string;
    source: string;
    createdAt: string;
}

interface BlogPost {
    _id: string;
    postId?: string;
    title: string;
    excerpt: string;
    contentHtml?: string;
    content?: string;
    author: string;
    category: string;
    imageUrl?: string;
    createdAt: string;
}

interface GalleryItem {
    _id: string;
    title?: string;
    description?: string;
    imageUrl: string;
    createdAt: string;
}

type TabType = 'contacts' | 'blogs' | 'gallery';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('contacts');
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [blogForm, setBlogForm] = useState({
        postId: '',
        category: 'Skincare',
        title: '',
        excerpt: '',
        contentHtml: '',
        author: 'Dr. Ujwala',
        imageUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [galleryForm, setGalleryForm] = useState<{ title: string; description: string; file: File | null }>({
        title: '',
        description: '',
        file: null,
    });
    const [galleryUploading, setGalleryUploading] = useState(false);
    const [galleryError, setGalleryError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchContacts();
        fetchBlogs();
        fetchGallery();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            const data = await response.json();
            if (data.success) {
                setContacts(data.data);
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        try {
            const response = await fetch('/api/blogs');
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
        }
    };

    const fetchGallery = async () => {
        try {
            const response = await fetch('/api/gallery');
            const data = await response.json();
            if (data.success) {
                setGallery(data.data);
            }
        } catch (err) {
            console.error('Error fetching gallery:', err);
        }
    };

    const handleGallerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGalleryError('');
        if (!galleryForm.file) {
            setGalleryError('Please choose an image to upload.');
            return;
        }
        setGalleryUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', galleryForm.file);
            fd.append('title', galleryForm.title);
            fd.append('description', galleryForm.description);
            const response = await fetch('/api/gallery', {
                method: 'POST',
                body: fd,
            });
            const data = await response.json();
            if (data.success) {
                setGallery([data.data, ...gallery]);
                setGalleryForm({ title: '', description: '', file: null });
                setShowGalleryForm(false);
            } else {
                setGalleryError(data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Error uploading gallery image:', err);
            setGalleryError('Upload failed. Please try again.');
        } finally {
            setGalleryUploading(false);
        }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('Delete this gallery image?')) return;
        try {
            const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                setGallery(gallery.filter(g => g._id !== id));
            }
        } catch (err) {
            console.error('Error deleting gallery image:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                postId: blogForm.postId.trim() || undefined,
                category: blogForm.category.trim(),
                title: blogForm.title.trim(),
                excerpt: blogForm.excerpt.trim(),
                imageUrl: blogForm.imageUrl.trim() || undefined,
                contentHtml: blogForm.contentHtml.trim() || undefined,
                // Keep compatibility with existing renderer and older posts.
                content: blogForm.contentHtml.trim() || undefined,
                author: blogForm.author || 'Dr. Ujwala',
            };
            const isEdit = Boolean(editingBlogId);
            const response = await fetch(isEdit ? `/api/blogs/${editingBlogId}` : '/api/blogs', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                if (isEdit) {
                    setBlogs(blogs.map(b => (b._id === data.data._id ? data.data : b)));
                } else {
                    setBlogs([data.data, ...blogs]);
                }
                setBlogForm({ postId: '', category: 'Skincare', title: '', excerpt: '', contentHtml: '', author: 'Dr. Ujwala', imageUrl: '' });
                setShowBlogForm(false);
                setEditingBlogId(null);
            }
        } catch (err) {
            console.error('Error creating blog:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditBlog = (blog: BlogPost) => {
        setEditingBlogId(blog._id);
        setBlogForm({
            postId: blog.postId || '',
            category: blog.category || 'Skincare',
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            contentHtml: blog.contentHtml || blog.content || '',
            author: blog.author || 'Dr. Ujwala',
            imageUrl: blog.imageUrl || '',
        });
        setShowBlogForm(true);
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                setBlogs(blogs.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error('Error deleting blog:', err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-blue">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans relative isolate z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue flex items-center gap-3">
                            <ShieldCheck className="text-brand-blue" /> Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage contacts and blog posts.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('contacts')}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all flex-1 sm:flex-none ${activeTab === 'contacts' ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users size={18} /> Contacts ({contacts.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('blogs')}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all flex-1 sm:flex-none ${activeTab === 'blogs' ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FileText size={18} /> Blogs ({blogs.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all flex-1 sm:flex-none ${activeTab === 'gallery' ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ImageIcon size={18} /> Gallery ({gallery.length})
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Contacts Tab */}
                {activeTab === 'contacts' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4">Subject / Concern</th>
                                        <th className="px-6 py-4">Source</th>
                                        <th className="px-6 py-4">Date Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contacts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <Database className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                                No submissions found yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        contacts.map((contact) => (
                                            <tr
                                                key={contact._id}
                                                className="hover:bg-blue-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900">{contact.name}</div>
                                                    {contact.preferredDate && (
                                                        <div className="text-xs text-brand-blue mt-1 flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            Pref: {new Date(contact.preferredDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone size={14} className="text-gray-400" /> {contact.phone}
                                                        </div>
                                                        {contact.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail size={14} className="text-gray-400" /> {contact.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-800">{contact.subject || 'N/A'}</div>
                                                    {contact.message && (
                                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs" title={contact.message}>
                                                            <MessageSquare size={10} className="inline mr-1" />
                                                            {contact.message}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${contact.source === 'Cardiology' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                        contact.source === 'Dermatology' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                                            'bg-gray-100 text-gray-700 ring-gray-500/10'
                                                        }`}>
                                                        {contact.source}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(contact.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Blogs Tab */}
                {activeTab === 'blogs' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingBlogId(null);
                                    setBlogForm({ postId: '', category: 'Skincare', title: '', excerpt: '', contentHtml: '', author: 'Dr. Ujwala', imageUrl: '' });
                                    setShowBlogForm(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 font-bold text-sm shadow-lg"
                            >
                                <Plus size={18} /> Add New Blog
                            </button>
                        </div>

                        {/* Blog Form Modal */}
                        {showBlogForm && (
                            <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-6 md:pt-10 overflow-y-auto">
                                <div
                                    className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl my-4 max-h-[88vh] overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-4xl font-serif text-stone-800">{editingBlogId ? 'Edit Post' : 'New Post'}</h2>
                                        <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlogId(null); }} className="text-gray-400 hover:text-gray-600">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleBlogSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Post ID</label>
                                                <input
                                                    type="text"
                                                    value={blogForm.postId}
                                                    onChange={e => setBlogForm({ ...blogForm, postId: e.target.value })}
                                                    className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none"
                                                    placeholder="e.g. post-001 (optional)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={blogForm.category}
                                                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                                                    className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none"
                                                    placeholder="e.g. Skincare"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={blogForm.title}
                                                onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none"
                                                placeholder="Blog title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Excerpt</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={blogForm.excerpt}
                                                onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                                className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none resize-none"
                                                placeholder="Short description shown in cards..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                                            <input
                                                type="url"
                                                value={blogForm.imageUrl}
                                                onChange={e => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                                                className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Full Content (HTML)</label>
                                            <textarea
                                                rows={10}
                                                value={blogForm.contentHtml}
                                                onChange={e => setBlogForm({ ...blogForm, contentHtml: e.target.value })}
                                                className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none resize-y font-mono text-sm"
                                                placeholder="<h2>Enter HTML content here...</h2>"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Author</label>
                                            <select
                                                value={blogForm.author}
                                                onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                                                className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none"
                                            >
                                                <option>Dr. Ujwala</option>
                                                <option>Dr. Rakesh</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3 bg-[#a24b45] text-white font-bold rounded-xl hover:bg-[#943f3a] transition-colors disabled:opacity-50"
                                        >
                                            {submitting ? (editingBlogId ? 'Saving...' : 'Creating...') : (editingBlogId ? 'Save Changes' : 'Create Post')}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Blog List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                            <th className="px-6 py-4">Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Date Created</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {blogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                                    No blog posts yet. Click "Add New Blog" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            blogs.map((blog) => (
                                                <tr
                                                    key={blog._id}
                                                    className="hover:bg-blue-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{blog.title}</div>
                                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{blog.excerpt}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                            {blog.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditBlog(blog)}
                                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                            aria-label="Edit blog"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteBlog(blog._id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => setShowGalleryForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 font-bold text-sm shadow-lg"
                            >
                                <Upload size={18} /> Upload Image
                            </button>
                        </div>

                        {showGalleryForm && (
                            <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-6 md:pt-10 overflow-y-auto">
                                <div
                                    className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl my-4 max-h-[88vh] overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-brand-blue">Upload Gallery Image</h2>
                                        <button type="button" onClick={() => { setShowGalleryForm(false); setGalleryError(''); }} className="text-gray-400 hover:text-gray-600">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleGallerySubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Title (optional)</label>
                                            <input
                                                type="text"
                                                value={galleryForm.title}
                                                onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                                                placeholder="e.g. Laser Treatment Room"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Description (optional)</label>
                                            <textarea
                                                rows={2}
                                                value={galleryForm.description}
                                                onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none resize-none"
                                                placeholder="Short caption..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Image File</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                required
                                                onChange={e => setGalleryForm({ ...galleryForm, file: e.target.files?.[0] || null })}
                                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
                                            />
                                            <p className="text-xs text-gray-400 mt-2">Max 5MB. JPG, PNG, WEBP, GIF, AVIF.</p>
                                        </div>
                                        {galleryError && (
                                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{galleryError}</div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={galleryUploading}
                                            className="w-full py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
                                        >
                                            {galleryUploading ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {gallery.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                                <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                <p>No gallery images yet. Click "Upload Image" to add one.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gallery.map(item => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
                                    >
                                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title || 'Gallery'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-4 flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{item.title || 'Untitled'}</p>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGallery(item._id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                                                aria-label="Delete image"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
