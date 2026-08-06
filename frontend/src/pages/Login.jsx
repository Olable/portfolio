import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Try the demo account: olble / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-6">Sign in to manage your blog & portfolio.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Username</label>
            <input
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Password</label>
            <input
              required type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Demo admin: <span className="text-gray-300">olble / admin123</span></p>
          <p className="mt-2">
            Don't have an account? <Link to="/register" className="text-brand-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
