import './StatsBar.css';

export default function StatsBar({ stats }) {
  const completion = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="stats-bar fade-in">
      <StatCard label="Total" value={stats.total} color="var(--accent)" />
      <StatCard label="To Do" value={stats.todo} color="var(--text-muted)" />
      <StatCard label="In Progress" value={stats.inProgress} color="var(--info)" />
      <StatCard label="Done" value={stats.done} color="var(--success)" />
      <div className="stats-progress">
        <div className="progress-label">
          <span>Overall completion</span>
          <span className="progress-pct">{completion}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
