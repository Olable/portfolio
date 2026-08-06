import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { adminGetPosts, adminCreatePost, adminDeletePost } from '../api';
import Loading from '../components/Loading';
import { FiTrash2, FiPlus, FiEdit3, FiExternalLink } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    status: 'draft', is_featured: false, tags: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminGetPosts()
      .then(data => setPosts(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (!user) return <Navigate to="/login" state={{ from: '/admin/dashboard' }} replace />;
  if (!user.is_staff) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-3">Restricted</h1>
        <p className="text-gray-400">You need staff privileges to access this page.</p>
        <p className="text-gray-500 text-sm mt-4">
          Use the Django admin at <a href="/admin" className="text-brand-400 hover:underline" target="_blank">/admin</a>{' '}
          to grant staff status to your account.
        </p>
      </div>
    );
  }

  const slugify = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreatePost({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setForm({ title: '', slug: '', excerpt: '', content: '', status: 'draft', is_featured: false, tags: '' });
      setShowForm(false);
      load();
    } catch (err) {
      alert('Failed to create post: ' + JSON.stringify(err?.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Delete this post?')) return;
    await adminDeletePost(slug);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your blog posts. Signed in as <span className="text-white">{user.username}</span>.</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-1 px-4 py-2 rounded-lg glass text-white hover:bg-white/10 transition">
            <FiExternalLink /> Django Admin
          </a>
          <button
            onClick={() => setShowForm(s => !s)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-medium hover:opacity-90 transition">
            <FiPlus /> {showForm ? 'Close' : 'New post'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">New post</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Title</label>
              <input required value={form.title}
                     onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Slug</label>
              <input required value={form.slug}
                     onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Excerpt</label>
            <input value={form.excerpt}
                   onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                   className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Content (Markdown)</label>
            <textarea required rows={10} value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm outline-none focus:border-brand-500/60 resize-y" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Status</label>
              <select value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags}
                     onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                     placeholder="django, react, tips"
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.is_featured}
                       onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                Featured post
              </label>
            </div>
          </div>
          <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      )}

      {loading ? <Loading /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Views</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No posts yet.</td></tr>
              )}
              {posts.map(p => (
                <tr key={p.slug} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link to={`/blog/${p.slug}`} className="text-white font-medium hover:text-brand-400">{p.title}</Link>
                    <p className="text-xs text-gray-500">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/blog/${p.slug}`} className="p-2 text-gray-400 hover:text-white transition">
                        <FiExternalLink />
                      </Link>
                      <button onClick={() => handleDelete(p.slug)} className="p-2 text-gray-400 hover:text-red-400 transition">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        Tip: for richer editing (categories, cover images, skill/project/experience management), use the{' '}
        <a href="/admin" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">Django admin panel</a>.
      </p>
    </div>
  );
}
