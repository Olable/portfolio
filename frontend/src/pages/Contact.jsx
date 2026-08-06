import { useState } from 'react';
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { sendContact } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get in <span className="gradient-text">touch</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Have a question, a project idea, or just want to say hi? My inbox is always open.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                <FiMail size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <p className="text-gray-400 text-sm">olble@example.com</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <FiMapPin size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Location</h3>
                <p className="text-gray-400 text-sm">Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Follow me</h3>
            <div className="flex items-center gap-3">
              <a href="https://github.com/olble" target="_blank" rel="noreferrer"
                 className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition">
                <FiGithub size={20} />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 glass rounded-2xl p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                required type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Subject</label>
            <input
              required
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Message</label>
            <textarea
              required rows={6}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-500/60 resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            <FiSend />
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
          {status === 'success' && (
            <p className="text-green-400 text-sm">✓ Message sent! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm">Failed to send. Please try again later.</p>
          )}
        </form>
      </div>
    </div>
  );
}
