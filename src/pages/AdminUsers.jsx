import { useState } from 'react';
import { authApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { username: '', email: '', password: '' };

export default function AdminUsers() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters.');
    if (!EMAIL_RE.test(form.email.trim())) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await authApi.registerAdmin({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(`Admin "${form.username.trim()}" was created.`);
      setForm(EMPTY);
    } catch (err) {
      setError(
        err.response?.status === 500
          ? 'Could not create the admin. That username may already be taken.'
          : getErrorMessage(err, 'Could not create the admin.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Add an admin</h1>
      <p className="muted">Admins can post, edit and delete notices and create other admins.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Username</span>
          <input value={form.username} onChange={(e) => setField('username', e.target.value)} autoComplete="off" />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} autoComplete="off" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {success && <p className="alert alert--ok" role="status">{success}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Creating admin…' : 'Create admin'}
        </button>
      </form>
    </section>
  );
}
