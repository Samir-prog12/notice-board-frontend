import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/notices';

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/notices" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login({ username: form.username.trim(), password: form.password });
      login(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      // The backend answers bad credentials with 403 (sometimes 401).
      setError(
        status === 401 || status === 403
          ? 'Wrong username or password.'
          : getErrorMessage(err, 'Could not log in. Please try again.')
      );
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
    <section className="auth-card">
      <h1>Log in</h1>
      {location.state?.message && <p className="alert alert--ok">{location.state.message}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
            autoFocus
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="alert alert--error" role="alert">{error}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="auth-card__alt">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
    </AuthLayout>
  );
}
