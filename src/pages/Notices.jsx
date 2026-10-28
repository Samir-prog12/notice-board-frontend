import { useCallback, useEffect, useMemo, useState } from 'react';
import { noticeApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoticeCard from '../components/NoticeCard.jsx';
import NoticeFormModal from '../components/NoticeFormModal.jsx';
import { isExpired, isRecent } from '../utils/date.js';

export default function Notices() {
  const { user, isAdmin } = useAuth();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [importantOnly, setImportantOnly] = useState(false);
  const [hideExpired, setHideExpired] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await noticeApi.getAll();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load notices.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set(notices.map((n) => n.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [notices]
  );

  const stats = useMemo(
    () => ({
      active: notices.filter((n) => !isExpired(n.expiryDate)).length,
      important: notices.filter((n) => n.isImportant && !isExpired(n.expiryDate)).length,
      fresh: notices.filter((n) => isRecent(n.createdAt)).length,
    }),
    [notices]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    return notices
      .filter((n) => category === 'all' || n.category === category)
      .filter((n) => !importantOnly || n.isImportant)
      .filter((n) => !hideExpired || !n.expiryDate || new Date(n.expiryDate).getTime() >= now)
      .filter(
        (n) =>
          !q ||
          (n.title || '').toLowerCase().includes(q) ||
          (n.description || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (Boolean(b.isImportant) !== Boolean(a.isImportant)) return b.isImportant ? 1 : -1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [notices, query, category, importantOnly, hideExpired]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (notice) => {
    setEditing(notice);
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleDelete = async (notice) => {
    if (notice.id == null) {
      setError('This notice has no id. Add the id field to NoticeDto in the backend (see setup notes).');
      return;
    }
    if (!window.confirm(`Delete "${notice.title}"? This cannot be undone.`)) return;
    try {
      await noticeApi.remove(notice.id);
      setNotices((list) => list.filter((n) => n.id !== notice.id));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the notice.'));
    }
  };

  return (
    <>
      <section className="hero">
        <div className="orbits" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="hero__kicker">Welcome back, {user.username}</p>
        <h1 className="hero__title">RD National &amp; SWA Science College</h1>
        <p className="hero__sub">Digital Notice Board. Everything the college wants you to know, in one place.</p>
        {!loading && !error && (
          <ul className="hero__stats">
            <li>
              <strong>{stats.active}</strong>
              <span>Active notices</span>
            </li>
            <li>
              <strong>{stats.important}</strong>
              <span>Important</span>
            </li>
            <li>
              <strong>{stats.fresh}</strong>
              <span>Posted in last 24h</span>
            </li>
          </ul>
        )}
      </section>

      <div className="section-head">
        <h2>Latest notices</h2>
        {isAdmin && (
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            Post a notice
          </button>
        )}
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search notices"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notices"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="check">
          <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} />
          <span>Important only</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={hideExpired} onChange={(e) => setHideExpired(e.target.checked)} />
          <span>Hide expired</span>
        </label>
      </div>

      {error && <p className="alert alert--error" role="alert">{error}</p>}

      {loading ? (
        <p className="empty">Loading notices…</p>
      ) : visible.length === 0 ? (
        <p className="empty">
          {notices.length === 0
            ? isAdmin
              ? 'The board is empty. Post the first notice.'
              : 'No notices have been posted yet.'
            : 'No notices match your filters.'}
        </p>
      ) : (
        <div className="board">
          {visible.map((n, i) => (
            <NoticeCard
              key={n.id ?? `${n.title}-${i}`}
              notice={n}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {formOpen && <NoticeFormModal notice={editing} onClose={closeForm} onSaved={handleSaved} />}
    </>
  );
}
