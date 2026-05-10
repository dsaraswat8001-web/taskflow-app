import { useState, useCallback } from 'react';
import './TaskFilters.css';

export default function TaskFilters({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      onChange(f => ({ ...f, search: val }));
    }, 350);
  }, [onChange]);

  const handleFilter = (key, val) => {
    onChange(f => ({ ...f, [key]: f[key] === val ? '' : val }));
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;
  const clearAll = () => { setSearch(''); onChange({ status: '', priority: '', search: '' }); };

  return (
    <div className="task-filters">
      <div className="filters-top">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        {hasActiveFilters && (
          <button className="btn btn-ghost clear-btn" onClick={clearAll}>
            Clear filters
          </button>
        )}
      </div>

      <div className="filter-chips">
        <span className="filter-label">Status:</span>
        {['todo', 'in-progress', 'done'].map(s => (
          <button
            key={s}
            className={`chip ${filters.status === s ? 'chip-active' : ''}`}
            onClick={() => handleFilter('status', s)}
          >
            {statusLabel(s)}
          </button>
        ))}
        <span className="filter-divider" />
        <span className="filter-label">Priority:</span>
        {['high', 'medium', 'low'].map(p => (
          <button
            key={p}
            className={`chip chip-priority-${p} ${filters.priority === p ? 'chip-active' : ''}`}
            onClick={() => handleFilter('priority', p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function statusLabel(s) {
  return s === 'in-progress' ? 'In Progress' : s === 'todo' ? 'To Do' : 'Done';
}
