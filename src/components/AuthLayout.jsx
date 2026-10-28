import Crest from './Crest.jsx';

// Split layout for the login and register pages: college panel + form.
export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="orbits" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Crest className="crest crest--lg" />
        <h2 className="auth-brand__name">RD National &amp; SWA Science College</h2>
        <p className="auth-brand__tag">Digital Notice Board</p>
        <p className="auth-brand__text">
          Exam schedules, events and announcements from the college, all in one place.
        </p>
      </aside>
      <div className="auth-shell__form">{children}</div>
    </div>
  );
}
