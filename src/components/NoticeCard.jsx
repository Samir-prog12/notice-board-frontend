import { Link } from 'react-router-dom';
import { formatDateTime, isExpired, isRecent } from '../utils/date.js';
import { hueFor } from '../utils/color.js';

export default function NoticeCard({ notice, isAdmin, onEdit, onDelete }) {
  const expired = isExpired(notice.expiryDate);
  const important = Boolean(notice.isImportant);
  const fresh = isRecent(notice.createdAt);

  return (
    <article
      className={`notice ${important ? 'notice--important' : ''} ${expired ? 'notice--expired' : ''}`}
      style={{ '--hue': hueFor(notice.category) }}
    >
      <div className="notice__tags">
        {notice.category && <span className="badge badge--cat">{notice.category}</span>}
        {important && <span className="badge badge--important">Important</span>}
        {fresh && !expired && <span className="badge badge--new">New</span>}
        {expired && <span className="badge badge--muted">Expired</span>}
      </div>

      <h3 className="notice__title">
        {notice.id != null ? <Link to={`/notices/${notice.id}`}>{notice.title}</Link> : notice.title}
      </h3>

      <p className="notice__body">{notice.description}</p>

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
          <button type="button" className="btn btn--small" onClick={() => onEdit(notice)}>
            Edit
          </button>
          <button type="button" className="btn btn--small btn--danger" onClick={() => onDelete(notice)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
