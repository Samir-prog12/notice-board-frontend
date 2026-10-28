import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { noticeApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoticeFormModal from '../components/NoticeFormModal.jsx';
import { formatDateTime, isExpired } from '../utils/date.js';
import { hueFor } from '../utils/color.js';

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setNotice(await noticeApi.getById(id));
    } catch (err) {
      // Backend throws a RuntimeException (HTTP 500) when the id does not exist.
      setError(
        err.response?.status === 500
          ? 'This notice could not be found. It may have been deleted.'
          : getErrorMessage(err, 'Could not load this notice.')
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this notice? This cannot be undone.')) return;
    try {
      await noticeApi.remove(id);
      navigate('/notices', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the notice.'));
    }
  };

  if (loading) return <p className="empty">Loading notice…</p>;

  if (error || !notice) {
    return (
      <section className="detail">
        <p className="alert alert--error">{error || 'Notice not found.'}</p>
        <Link to="/notices">Back to notices</Link>
      </section>
    );
  }

  const expired = isExpired(notice.expiryDate);
  // Edit needs the id; the URL already has it, so merge it in.
  const editable = { ...notice, id };

  return (
    <section
      className={`detail ${notice.isImportant ? 'detail--important' : ''}`}
      style={{ '--hue': hueFor(notice.category) }}
    >
      <Link to="/notices" className="detail__back">
        Back to notices
      </Link>

      <div className="notice__tags">
        {notice.category && <span className="badge badge--cat">{notice.category}</span>}
        {notice.isImportant && <span className="badge badge--important">Important</span>}
        {expired && <span className="badge badge--muted">Expired</span>}
      </div>

      <h1 className="detail__title">{notice.title}</h1>
      <p className="detail__body">{notice.description}</p>

      <dl className="notice__dates">
        <div>
          <dt>Posted</dt>
          <dd>{formatDateTime(notice.createdAt)}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{formatDateTime(notice.expiryDate)}</dd>
        </div>
      </dl>

      {isAdmin && (
        <div className="notice__actions">
          <button type="button" className="btn" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button type="button" className="btn btn--danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {editing && (
        <NoticeFormModal
          notice={editable}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            load();
          }}
        />
      )}
    </section>
  );
}
