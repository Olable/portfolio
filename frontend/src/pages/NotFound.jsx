import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-28 text-center">
      <h1 className="text-7xl font-extrabold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition">
        Go home
      </Link>
    </div>
  );
}
