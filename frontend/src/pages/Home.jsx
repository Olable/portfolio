import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getProfile, getProjects, getSkills, getPosts } from '../api';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import Loading from '../components/Loading';

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], skills: [], posts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => ({})),
      getProjects().catch(() => ({ results: [] })),
      getSkills().catch(() => ({ results: [] })),
      getPosts({ featured: 'true' }).catch(() => ({ results: [] })),
    ]).then(([profile, projects, skills, posts]) => {
      setData({
        profile,
        projects: projects.results || [],
        skills: skills.results || [],
        posts: posts.results || [],
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading text="Loading..." />;

  const featuredProjects = data.projects.filter(p => p.is_featured).slice(0, 3);
  const featuredPosts = data.posts.slice(0, 3);

  return (
    <div>
      <Hero profile={data.profile} />

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Skills &amp; <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A toolkit I've honed through years of building real products.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.skills.map(cat => (
              <div key={cat.id} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{cat.name}</h3>
                <div className="space-y-4">
                  {cat.skills?.map(s => (
                    <div key={s.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-200 flex items-center gap-2">
                          <span>{s.icon}</span> {s.name}
                        </span>
                        <span className="text-gray-400">{s.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-gray-400">Some things I've built recently.</p>
          </div>
          <Link to="/projects" className="hidden sm:inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition">
            All projects <FiArrowRight />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Latest posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Latest <span className="gradient-text">Writing</span>
              </h2>
              <p className="text-gray-400">Thoughts on code, design, and everything in between.</p>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition">
              All posts <FiArrowRight />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-600/10"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's build something <span className="gradient-text">great</span> together
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Have an idea, project, or just want to say hi? I'd love to hear from you.
            </p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-brand-500/25">
              Start a conversation <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
