import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts, getCategories, getTags } from '../api';
import BlogCard from '../components/BlogCard';
import Loading from '../components/Loading';

export default function BlogList() {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);

  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';

  const fetch = useCallback(async (url) => {
    setLoading(true);
    const config = url
      ? (await (await fetch(url, { headers: { 'Authorization': localStorage.getItem('access') ? `Bearer ${localStorage.getItem('access')}` : '' } })).json())
      : await getPosts({
          search: search || undefined,
          category: category || undefined,
          tag: tag || undefined,
        });
    // Note: getPosts uses axios which returns data; for simplicity re-fetch via getPosts
    if (!url) {
      setPosts(config.results || []);
      setCount(config.count || 0);
      setNext(config.next);
    }
    setLoading(false);
  }, [search, category, tag]);

  useEffect(() => {
    getCategories().then(d => setCategories(d.results || [])).catch(() => {});
    getTags().then(d => setTags(d.results || [])).catch(() => {});
    fetch();
  }, [fetch]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p, { replace: true });
  };

  const clearFilters = () => setParams({}, { replace: true });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Thoughts on software engineering, design, and life as a developer.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          defaultValue={search}
          placeholder="Search posts..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilter('search', e.target.value);
          }}
          className="w-full px-4 py-3 rounded-xl glass bg-transparent text-white placeholder-gray-500 outline-none focus:border-brand-500/60 border border-white/10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={clearFilters}
          className={`text-sm px-3 py-1.5 rounded-full border transition ${
            !category && !tag
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'border-white/10 text-gray-300 hover:bg-white/5'
          }`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.slug}
            onClick={() => updateFilter('category', category === c.slug ? '' : c.slug)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              category === c.slug
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'border-white/10 text-gray-300 hover:bg-white/5'
            }`}
          >
            {c.name} ({c.post_count})
          </button>
        ))}
      </div>

      {tag && (
        <div className="flex items-center gap-2 justify-center mb-6 text-sm">
          <span className="text-gray-400">Filtered by tag:</span>
          <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">#{tag}</span>
          <button onClick={() => updateFilter('tag', '')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {loading ? <Loading /> : posts.length === 0 ? (
        <p className="text-center text-gray-400">No posts found.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => <BlogCard key={p.id} post={p} />)}
          </div>
          {next && (
            <div className="text-center mt-10">
              <button
                onClick={async () => {
                  const res = await getPosts({
                    search: search || undefined,
                    category: category || undefined,
                    tag: tag || undefined,
                    page: Math.ceil(posts.length / 9) + 1,
                  });
                  setPosts(prev => [...prev, ...(res.results || [])]);
                  setNext(res.next);
                }}
                className="px-6 py-2 rounded-xl glass text-white hover:bg-white/10 transition"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {/* Tag cloud */}
      {tags.length > 0 && (
        <div className="mt-16 text-center">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Tags</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map(t => (
              <button
                key={t.slug}
                onClick={() => updateFilter('tag', tag === t.slug ? '' : t.slug)}
                className={`text-sm px-3 py-1 rounded-full transition ${
                  tag === t.slug
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
