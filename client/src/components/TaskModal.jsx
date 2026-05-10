import { useState, useEffect } from 'react';
import api from '../hooks/useApi';
import './TaskModal.css';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: ''
};

export default function TaskModal({ task, onClose, onSaved }) {
  const isEdit = !!task;
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        tags: (task.tags || []).join(', ')
      });
    } else {
      setForm(defaultForm);
    }
  }, [task]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Task title is required.');
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dueDate: form.dueDate || null
    };

    try {
      if (isEdit) {
        await api.put(`/api/tasks/${task._id}`, payload);
      } else {
        await api.post('/api/tasks', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card fade-in">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error" style={{ margin: '0 0 16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              name="title"
              className="input-field"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="input-field"
              placeholder="Add details (optional)..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="input-field" value={form.priority} onChange={handleChange}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                name="dueDate"
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              name="tags"
              className="input-field"
              placeholder="design, frontend, urgent"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />{isEdit ? 'Saving...' : 'Creating...'}</> : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
