import { Link } from 'react-router-dom';
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function Hero({ profile }) {
  const fullName = profile?.full_name || 'Olble';
  const title = profile?.title || 'Full-Stack Developer & Designer';
  const tagline = profile?.tagline || 'I build clean, fast, and delightful web experiences.';

  return (
    <section className="relative overflow-hidden pt-20 pb-24">
      {/* Animated blobs */}
      <div className="absolute -top-32 -left-16 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Available for new projects
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Hi, I'm <span className="gradient-text">{fullName}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-4 max-w-3xl">
            {title}
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10">
            {tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Link to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 shadow-lg shadow-brand-500/25 transition">
              View my work <FiArrowRight />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition">
              Get in touch
            </Link>
            {profile?.resume_url && (
              <a href={profile.resume_url}
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-gray-300 hover:text-white transition">
                <FiDownload /> Resume
              </a>
            )}
          </div>

          <div className="flex items-center gap-5 text-gray-400">
            <a href="https://github.com/olble" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <FiGithub size={22} />
            </a>
            <a href="#" className="hover:text-white transition"><FiLinkedin size={22} /></a>
            <a href="#" className="hover:text-white transition"><FiTwitter size={22} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
