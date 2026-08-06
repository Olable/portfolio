import { useEffect, useState } from 'react';
import { getProfile, getExperiences, getEducation } from '../api';
import Loading from '../components/Loading';
import { formatDateRange } from '../utils/helpers';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getExperiences(), getEducation()])
      .then(([p, ex, ed]) => {
        setProfile(p);
        setExperiences(ex.results || ex);
        setEducation(ed.results || ed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
        About <span className="gradient-text">me</span>
      </h1>

      <div className="glass rounded-2xl p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {profile?.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.full_name}
              className="w-40 h-40 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-6xl font-bold text-white flex-shrink-0">
              {(profile?.full_name || 'O')[0]}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {profile?.full_name || 'Olble'}
            </h2>
            <p className="text-brand-400 font-medium mb-4">
              {profile?.title || 'Full-Stack Developer'}
            </p>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {profile?.about ||
                'I am a passionate developer building modern web applications.'}
            </p>
            {profile?.location && (
              <p className="text-gray-400 mt-4">📍 {profile.location}</p>
            )}
          </div>
        </div>
      </div>

      {experiences.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
          <div className="space-y-4">
            {experiences.map(e => (
              <div key={e.id} className="glass rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {e.role} · <span className="text-brand-400">{e.company}</span>
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDateRange(e.start_date, e.end_date, e.current)}
                  </span>
                </div>
                {e.location && <p className="text-sm text-gray-400 mb-2">{e.location}</p>}
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Education</h2>
          <div className="space-y-4">
            {education.map(e => (
              <div key={e.id} className="glass rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{e.degree}</h3>
                  <span className="text-sm text-gray-400">
                    {formatDateRange(e.start_date, e.end_date)}
                  </span>
                </div>
                <p className="text-brand-400 mb-2">{e.school}{e.field ? ` · ${e.field}` : ''}</p>
                {e.description && (
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
