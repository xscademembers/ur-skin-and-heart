import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Facebook, Twitter, Link2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BlogContent } from '../components/BlogContent';

interface BlogPost {
  _id: string;
  postId?: string;
  title: string;
  excerpt: string;
  contentHtml?: string;
  content?: string;
  createdAt: string;
  author: string;
  category: string;
  imageUrl?: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const calcReadingTime = (text: string) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
};

export const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const stateBlog = (location.state as { blog?: BlogPost } | null)?.blog || null;
  const [blog, setBlog] = useState<BlogPost | null>(stateBlog);
  const [loading, setLoading] = useState(!stateBlog);
  const [error, setError] = useState('');

  useEffect(() => {
    if (stateBlog || !id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.success) setBlog(data.data);
          else setError(data.message || 'Blog not found');
        }
      } catch {
        if (!cancelled) setError('Failed to load article');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, stateBlog]);

  const fullText = useMemo(() => `${blog?.excerpt || ''}\n\n${blog?.content || ''}`, [blog]);
  const readingTime = useMemo(() => calcReadingTime(fullText), [fullText]);

  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-brand-surface min-h-screen pt-24 pb-20 flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-brand-surface min-h-screen pt-24 pb-20 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600 mb-4 text-center">{error || 'Article not found.'}</p>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] min-h-screen pt-20 pb-20">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-sm font-semibold text-brand-blue mb-5 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to all articles
          </button>
        </div>

        <div className="relative w-full overflow-hidden shadow-xl">
          <img
            src={blog.imageUrl || `https://picsum.photos/1600/780?random=${blog._id}`}
            alt={blog.title}
            className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />

          <div className="absolute left-6 right-6 bottom-6 sm:left-12 sm:right-12 sm:bottom-12 lg:left-[9%] lg:right-[9%] text-white">
            <span className="inline-flex uppercase text-[10px] tracking-widest font-bold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] mb-4 max-w-5xl">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
              <span className="flex items-center gap-1.5"><User size={14} /> {blog.author}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {readingTime}</span>
              <span className="uppercase tracking-wider">{blog.category}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl border border-stone-100 px-6 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-10">
          {blog.excerpt && (
            <p className="text-[21px] leading-relaxed text-stone-700 mb-10 font-light">
              {blog.excerpt}
            </p>
          )}

          {blog.contentHtml ? (
            <div
              className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-stone-800 prose-p:text-[20px] prose-p:leading-[1.85] prose-p:text-stone-700 prose-li:text-stone-700 prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
            />
          ) : blog.content ? (
            <BlogContent content={blog.content} className="blog-article-content" />
          ) : (
            <div className="bg-stone-50 border border-stone-200 text-stone-600 rounded-xl p-6 flex items-start gap-3">
              <BookOpen className="text-stone-500 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-stone-800 mb-1">Full article coming soon</p>
                <p className="text-sm">The full content for this post has not been published yet.</p>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-serif text-3xl text-stone-800">Share this Article</p>
              <p className="text-sm text-stone-500">Help others discover this valuable information.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600 flex items-center justify-center"
                aria-label="Share on Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600 flex items-center justify-center"
                aria-label="Share on Twitter"
              >
                <Twitter size={14} />
              </a>
              <button
                onClick={copyLink}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600 flex items-center justify-center"
                aria-label="Copy link"
                title={copied ? 'Copied!' : 'Copy link'}
              >
                <Link2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
