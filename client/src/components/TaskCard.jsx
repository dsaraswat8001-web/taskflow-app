import { format, isPast, isToday } from 'date-fns';
import './TaskCard.css';

const STATUS_NEXT = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
const STATUS_LABELS = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <div className={`task-card fade-in ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-left">
        <button
          className={`status-btn status-${task.status}`}
          onClick={() => onStatusChange(task._id, STATUS_NEXT[task.status])}
          title={`Mark as ${STATUS_LABELS[STATUS_NEXT[task.status]]}`}
        />
        <div className="task-info">
          <span className={`task-title ${task.status === 'done' ? 'done-text' : ''}`}>{task.title}</span>
          {task.description && (
            <span className="task-desc">{task.description}</span>
          )}
          <div className="task-meta">
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
            {task.dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue' : isDueToday ? 'due-today' : ''}`}>
                {isOverdue ? '⚠ ' : ''}
                {isDueToday ? 'Today' : format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
            {task.tags?.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button className="action-btn" onClick={() => onEdit(task)} title="Edit">✎</button>
        <button className="action-btn action-delete" onClick={() => onDelete(task._id)} title="Delete">✕</button>
      </div>
    </div>
  );
}
