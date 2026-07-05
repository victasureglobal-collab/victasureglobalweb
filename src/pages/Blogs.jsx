import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Blogs() {
  const { slug } = useParams();
  const { blogs, loading } = useApp();
  const navigate = useNavigate();

  // Handle SEO Meta tags on active blog
  useEffect(() => {
    if (slug && blogs.length > 0) {
      const activeBlog = blogs.find(b => b.slug === slug);
      if (activeBlog) {
        // 1. Page Title
        document.title = `${activeBlog.seo_title || activeBlog.title} | VictaSure Global`;

        // 2. Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', activeBlog.seo_description || activeBlog.title);
        }

        // 3. Meta Keywords
        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (metaKeys) {
          metaKeys.setAttribute('content', `${activeBlog.title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').split(' ').join(', ')}, VictaSure Global, B2B export`);
        }

        // 4. Open Graph Tags (Facebook/LinkedIn/WhatsApp)
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', activeBlog.title);
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', activeBlog.seo_description || activeBlog.title);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && activeBlog.featured_image) ogImage.setAttribute('content', activeBlog.featured_image);

        // 5. Twitter Card Tags
        const twTitle = document.querySelector('meta[property="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', activeBlog.title);

        const twDesc = document.querySelector('meta[property="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', activeBlog.seo_description || activeBlog.title);

        const twImage = document.querySelector('meta[property="twitter:image"]');
        if (twImage && activeBlog.featured_image) twImage.setAttribute('content', activeBlog.featured_image);

        // 6. Canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', `https://www.victasure.com/blogs/${activeBlog.slug}`);
        }
      }
    } else {
      document.title = "VictaSure Global | Trade Blogs & Market Insights";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "VictaSure Global is a premier export company specializing in high-quality, eco-friendly, and sustainable products including Areca Leaf plates, bowls, trays, and organic items.");
      }
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', "https://www.victasure.com/blogs");
      }
    }
  }, [slug, blogs]);

  // Render a custom skeleton layout if loading from Supabase is in progress (placed after Hooks)
  if (loading) {
    return (
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-8">
            <div className="h-6 bg-gray-200 rounded-full w-32 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-gray-200 rounded-xlarge aspect-video border border-neutral-border"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const publishedBlogs = blogs.filter(b => b.status === 'published');

  // --- BLOG DETAIL VIEW ---
  if (slug) {
    const blog = blogs.find(b => b.slug === slug);
    if (!blog) {
      return (
        <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
          <h2 className="text-xl font-bold text-primary">Article not found</h2>
          <p className="text-xs text-gray-500">The requested article could not be located in the archive.</p>
          <Link to="/blogs" className="inline-flex items-center space-x-2 text-accent font-semibold text-xs hover:underline">
            <ArrowLeft size={14} />
            <span>Back to Trade Blogs</span>
          </Link>
        </div>
      );
    }

    return (
      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-8">
        
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center space-x-2 text-accent hover:text-accent-dark font-bold text-xs transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Trade Blogs</span>
        </Link>

        {/* Header Metadata */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary leading-tight font-sans">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(blog.created_at)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <User size={14} />
              <span>{blog.author || "VictaSure Trade Analyst"}</span>
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video w-full rounded-xlarge overflow-hidden bg-gray-100 border">
          <img
            src={blog.featured_image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article content */}
        <div
          className="prose prose-sm prose-primary max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer share */}
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Share this trade report with distributors:</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Article link copied!");
            }}
            className="flex items-center space-x-1.5 text-xs text-accent font-bold hover:underline"
          >
            <Share2 size={14} />
            <span>Copy Link</span>
          </button>
        </div>

      </article>
    );
  }

  // --- BLOGS LIST VIEW ---
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Insights & Trends
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Trade & Sustainability Blogs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            Stay updated with global green policies, organic quality audits, and import-export checklists.
          </p>
        </div>

        {/* Blogs List */}
        {publishedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xlarge overflow-hidden border border-neutral-border shadow-premium hover:shadow-premium-hover hover-lift flex flex-col justify-between group">
                
                {/* Featured Image */}
                <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                  <img
                    src={blog.featured_image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-semibold">{formatDate(blog.created_at)}</span>
                    <h3 className="font-sans font-bold text-primary text-base sm:text-lg leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {blog.seo_description || "Read our trade briefing for product compliance specs, logistics insights and shipping news."}
                    </p>
                  </div>

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs text-accent font-bold hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-neutral-border rounded-xlarge py-16 px-4 space-y-2">
            <BookOpen size={36} className="mx-auto text-gray-300 mb-2 stroke-[1.5]" />
            <h3 className="font-bold text-lg text-primary">No Articles Available</h3>
            <p className="text-xs text-gray-400">Articles are currently being drafted by the editorial desk.</p>
          </div>
        )}

      </div>
    </div>
  );
}
