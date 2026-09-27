import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createDonation } from '../services/api';

const initialFormData = {
  donorName: '',
  email: '',
  tabletName: '',
  expiryDate: '',
  unopened: false
};

const Donate = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const payload = {
      donorName: formData.donorName.trim(),
      email: formData.email.trim().toLowerCase(),
      tabletName: formData.tabletName.trim(),
      expiryDate: formData.expiryDate,
      unopened: formData.unopened
    };

    if (!payload.donorName || !payload.email || !payload.tabletName || !payload.expiryDate) {
      setStatus({ type: 'error', text: 'Please fill in every required field.' });
      return;
    }

    if (payload.expiryDate < today) {
      setStatus({ type: 'error', text: 'Please enter a tablet expiry date that has not already passed.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await createDonation(payload);
      setStatus({ type: 'success', text: 'Thank you. Your tablet donation was submitted successfully.' });
      setFormData(initialFormData);
    } catch (error) {
      const apiError = error.response?.data?.error || error.response?.data?.message || error.message;
      setStatus({
        type: 'error',
        text: Array.isArray(apiError) ? apiError.join(', ') : apiError || 'Error submitting donation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#c7d2fe,_transparent_28%),radial-gradient(circle_at_bottom_left,_#bbf7d0,_transparent_30%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 sm:p-10">
          <p className="inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-200 ring-1 ring-emerald-300/20">
            Safe donation checklist
          </p>
          <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
            Donate tablets with confidence.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Submit basic tablet details so volunteers can verify quality, track the donation, and route it responsibly.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              ['1', 'Enter donor and tablet details'],
              ['2', 'Confirm the package is unopened if applicable'],
              ['3', 'Submit for volunteer verification']
            ].map(([number, text]) => (
              <div key={number} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                  {number}
                </span>
                <span className="font-semibold text-slate-100">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-indigo-200/40 backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600">Donation form</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Tablet information</h2>
            <p className="mt-3 text-slate-600">
              Fields marked by the form are required. You can submit a donation even before creating an account.
            </p>
          </div>

          {status && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="alert"
            >
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="donorName" className="block text-sm font-bold text-slate-700">
                  Donor name
                </label>
                <input
                  type="text"
                  id="donorName"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tabletName" className="block text-sm font-bold text-slate-700">
                Tablet name
              </label>
              <input
                type="text"
                id="tabletName"
                name="tabletName"
                value={formData.tabletName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="Medicine or tablet strip name"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-bold text-slate-700">
                Expiry date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                min={today}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <label htmlFor="unopened" className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/70">
              <input
                type="checkbox"
                id="unopened"
                name="unopened"
                checked={formData.unopened}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="block font-bold text-slate-800">The package is unopened</span>
                <span className="mt-1 block text-sm text-slate-600">This helps volunteers prioritize items that can be verified faster.</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting donation...' : 'Submit donation'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Want to manage submitted items?{' '}
            <Link to="/register" className="font-bold text-indigo-700 hover:text-indigo-900">
              Create an account
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Donate;
