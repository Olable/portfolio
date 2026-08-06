import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Olble. Built with{' '}
          <span className="text-brand-400">Django</span> &amp;{' '}
          <span className="text-brand-400">React</span>.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/olble" target="_blank" rel="noreferrer"
             className="text-gray-400 hover:text-white transition">
            <FiGithub size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FiLinkedin size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FiTwitter size={20} />
          </a>
          <a href="mailto:olble@example.com" className="text-gray-400 hover:text-white transition">
            <FiMail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
