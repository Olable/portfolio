import { useEffect, useState } from 'react';
import { getProjects } from '../api';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data.results || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          A selection of things I've built. Each one taught me something new.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-400">No projects yet. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
