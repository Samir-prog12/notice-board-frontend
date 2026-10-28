import { useEffect, useState } from 'react';
import { noticeApi } from '../api/services.js';
import { getErrorMessage } from '../api/client.js';
import { toApiValue, toInputValue } from '../utils/date.js';

// notice = null  -> create a new notice
// notice = {...} -> edit that notice (needs notice.id)
export default function NoticeFormModal({ notice, onClose, onSaved }) {
  const isEdit = Boolean(notice);

  const [form, setForm] = useState({
    title: notice?.title ?? '',
    description: notice?.description ?? '',
    category: notice?.category ?? '',
    expiryDate: toInputValue(notice?.expiryDate),
    isImportant: Boolean(notice?.isImportant),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setError('Title, category and description are required.');
      return;
    }
    if (isEdit && notice.id == null) {
      setError('This notice has no id. Add the id field to NoticeDto in the backend (see setup notes).');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      expiryDate: toApiValue(form.expiryDate),
      isImportant: form.isImportant,
    };

    setSaving(true);
    try {
      if (isEdit) await noticeApi.update(notice.id, payload);
      else await noticeApi.create(payload);
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the notice.'));
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="notice-form-title">
        <h2 id="notice-form-title">{isEdit ? 'Edit notice' : 'Post a notice'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              maxLength={255}
              autoFocus
            />
          </label>

          <label className="field">
            <span>Category</span>
            <input
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              maxLength={255}
              placeholder="e.g. Exams, Events, Holiday"
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </label>

          <label className="field">
            <span>Expires on (optional)</span>
            <input
              type="datetime-local"
              value={form.expiryDate}
              onChange={(e) => setField('expiryDate', e.target.value)}
            />
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => setField('isImportant', e.target.checked)}
            />
            <span>Mark as important</span>
          </label>

          {error && <p className="alert alert--error" role="alert">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Post notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
