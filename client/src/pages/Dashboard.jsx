import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../hooks/useApi';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get('/api/tasks', { params });
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const openCreate = () => { setEditTask(null); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTask(null); };

  const handleSaved = () => { closeModal(); fetchTasks(); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/api/tasks/${id}/status`, { status });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      setStats(prev => {
        const oldTask = tasks.find(t => t._id === id);
        if (!oldTask) return prev;
        const oldKey = oldTask.status === 'in-progress' ? 'inProgress' : oldTask.status;
        const newKey = status === 'in-progress' ? 'inProgress' : status;
        return { ...prev, [oldKey]: prev[oldKey] - 1, [newKey]: prev[newKey] + 1 };
      });
    } catch (err) {
      console.error('Status update failed');
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Good {getTimeGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="dashboard-subtitle">Here's what's on your plate today</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <span>+</span> New Task
          </button>
        </div>

        <StatsBar stats={stats} />

        <TaskFilters filters={filters} onChange={setFilters} />

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onCreateFirst={openCreate}
        />
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
