import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPost, postComment } from '../api';
import Loading from '../components/Loading';
import { formatDate } from '../utils/helpers';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', body: '' });
  const [commentStatus, setCommentStatus] = useState(null);

  useEffect(() => {
    getPost(slug).then(setPost).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!post) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-gray-400 mb-6">Post not found.</p>
      <Link to="/blog" className="text-brand-400 hover:underline">← Back to blog</Link>
    </div>
  );

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentStatus('submitting');
    try {
      await postComment(slug, commentForm);
      setCommentStatus('success');
      setCommentForm({ name: '', email: '', body: '' });
    } catch {
      setCommentStatus('error');
    }
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/blog" className="inline-flex items-center gap-1 text-gray-400 hover:text-white mb-8 text-sm">
        <FiArrowLeft /> Back to blog
      </Link>

      <div className="mb-8">
        {post.category_name && (
          <Link
            to={`/blog?category=${post.category_slug}`}
            className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 mb-4 hover:bg-brand-500/30"
          >
            {post.category_name}
          </Link>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><FiUser /> {post.author_name || post.author_username}</span>
          <span className="flex items-center gap-1"><FiCalendar /> {formatDate(post.published_at)}</span>
          <span className="flex items-center gap-1"><FiClock /> {post.reading_time} min read</span>
          <span>{post.views} views</span>
        </div>
      </div>

      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="rounded-2xl w-full mb-10" />
      )}

      <div className="prose-custom">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/5">
          {post.tags.map(t => (
            <Link key={t.slug} to={`/blog?tag=${t.slug}`}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition">
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      {/* Comments */}
      <section className="mt-16 pt-10 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6">
          Comments ({post.comments?.length || 0})
        </h2>

        <div className="space-y-4 mb-10">
          {post.comments?.length === 0 && (
            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          )}
          {post.comments?.map(c => (
            <div key={c.id} className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{c.name}</span>
                <span className="text-xs text-gray-500">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-gray-300 text-sm">{c.body}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">Leave a comment</h3>
        <form onSubmit={handleComment} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              value={commentForm.name}
              onChange={e => setCommentForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-brand-500/60"
            />
            <input
              required
              type="email"
              value={commentForm.email}
              onChange={e => setCommentForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Your email (not published)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-brand-500/60"
            />
          </div>
          <textarea
            required
            rows={4}
            value={commentForm.body}
            onChange={e => setCommentForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-brand-500/60 resize-y"
          />
          <button
            type="submit"
            disabled={commentStatus === 'submitting'}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {commentStatus === 'submitting' ? 'Submitting...' : 'Post comment'}
          </button>
          {commentStatus === 'success' && (
            <p className="text-green-400 text-sm">✓ Comment submitted. It will appear after approval.</p>
          )}
          {commentStatus === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
          )}
        </form>
      </section>
    </article>
  );
}
