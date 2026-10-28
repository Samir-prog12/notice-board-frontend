import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/notices" replace />;

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters.');
    if (!EMAIL_RE.test(form.email.trim())) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await authApi.registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/login', { replace: true, state: { message: 'Account created. You can log in now.' } });
    } catch (err) {
      // Backend throws a RuntimeException (HTTP 500) when the username is already taken.
      setError(
        err.response?.status === 500
          ? 'Could not create the account. That username may already be taken.'
          : getErrorMessage(err, 'Could not create the account.')
      );
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
    <section className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => setField('username', e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            autoComplete="email"
          />
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
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setField('confirm', e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="alert alert--error" role="alert">{error}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-card__alt">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
    </AuthLayout>
  );
}
