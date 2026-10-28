import { useState } from 'react';

// Shows the college logo from public/logo.png.
// If the file is missing, it falls back to a simple atom mark.
export default function Crest({ className = 'crest' }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <span className={`${className} crest--logo`}>
        <img src="/logo.png" alt="" onError={() => setFailed(true)} />
      </span>
    );
  }

  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <ellipse cx="24" cy="24" rx="19" ry="7.5" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)" />
        <circle cx="24" cy="24" r="3.4" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
