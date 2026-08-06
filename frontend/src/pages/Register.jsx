import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.response?.data;
      const firstErr = msg && typeof msg === 'object' ? Object.values(msg)[0] : 'Registration failed.';
      setError(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
        <p className="text-gray-400 mb-6">Join and start publishing.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">First name</label>
              <input value={form.first_name}
                     onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Last name</label>
              <input value={form.last_name}
                     onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                     className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Username *</label>
            <input required
                   value={form.username}
                   onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                   className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Email *</label>
            <input required type="email"
                   value={form.email}
                   onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                   className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Password *</label>
            <input required type="password" minLength={6}
                   value={form.password}
                   onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                   className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-xs text-gray-500 text-center">
          Already have an account? <Link to="/login" className="text-brand-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
