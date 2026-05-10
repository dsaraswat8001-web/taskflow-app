import TaskCard from './TaskCard';
import './TaskList.css';

export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange, onCreateFirst }) {
  if (loading) {
    return (
      <div className="task-list-loading">
        {[1, 2, 3].map(i => <div key={i} className="task-skeleton" />)}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="task-empty fade-in">
        <div className="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started</p>
        <button className="btn btn-primary" onClick={onCreateFirst}>+ New Task</button>
      </div>
    );
  }

  const grouped = {
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'todo': tasks.filter(t => t.status === 'todo'),
    'done': tasks.filter(t => t.status === 'done')
  };

  const groupLabels = { 'in-progress': '🔵 In Progress', 'todo': '⚪ To Do', 'done': '✅ Done' };

  return (
    <div className="task-list fade-in">
      {Object.entries(grouped).map(([status, items]) => {
        if (!items.length) return null;
        return (
          <div key={status} className="task-group">
            <div className="task-group-header">
              <span>{groupLabels[status]}</span>
              <span className="group-count">{items.length}</span>
            </div>
            <div className="task-cards">
              {items.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
