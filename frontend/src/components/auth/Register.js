import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({ username, email, password: formData.password });
      if (!result.success) {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_55%,_#fdf2f8_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-2xl shadow-indigo-200/50 backdrop-blur xl:grid-cols-[1fr_0.9fr]">
          <div className="hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 p-10 text-white xl:block">
            <Link to="/" className="text-2xl font-black tracking-tight">
              CareCycle
            </Link>
            <div className="mt-24 max-w-md">
              <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                Community-first medicine recovery
              </p>
              <h1 className="text-5xl font-black leading-tight tracking-tight">
                Create an account and start tracking impact.
              </h1>
              <p className="mt-6 text-lg leading-8 text-indigo-100">
                Register once, donate unused tablet strips, and help coordinators verify every contribution with confidence.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-md">
              <Link to="/" className="text-2xl font-black tracking-tight text-indigo-700 xl:hidden">
                CareCycle
              </Link>
              <div className="mt-8 xl:mt-0">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Get started</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Create your account</h2>
                <p className="mt-3 text-slate-600">
                  Already helping with CareCycle?{' '}
                  <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-900">
                    Sign in instead
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                  {error}
                </div>
              )}

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-slate-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength="3"
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="sughosha"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email-address" className="block text-sm font-bold text-slate-700">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength="6"
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700">
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength="6"
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-bold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
