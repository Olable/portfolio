import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-brand-500/40 transition-all duration-300 block"
    >
      <div className="aspect-video bg-gradient-to-br from-brand-900/40 via-purple-900/40 to-pink-900/30 relative overflow-hidden">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center px-6 text-center">
            <span className="text-2xl font-bold text-white/80 leading-tight">
              {post.title}
            </span>
          </div>
        )}
        {post.category_name && (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/60 text-white backdrop-blur border border-white/10">
            {post.category_name}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <span>{post.author_name || post.author_username}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.reading_time} min read</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(t => (
              <span key={t.slug} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300">
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
