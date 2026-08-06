import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <div className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-brand-500/40 transition-all duration-300">
      <div className="aspect-video bg-gradient-to-br from-brand-900/40 to-purple-900/40 relative overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10">
            {project.title[0]}
          </div>
        )}
        {project.is_featured && (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-brand-500/90 text-white font-medium">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_list.slice(0, 4).map(tech => (
            <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/5">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white transition">
              <FiGithub /> Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition">
              <FiExternalLink /> Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
