import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="auth-card">
      <h1>Page not found</h1>
      <p className="muted">The page you opened does not exist.</p>
      <Link to="/notices">Go to notices</Link>
    </section>
  );
}
