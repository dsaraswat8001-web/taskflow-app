import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">TaskFlow</span>
        </div>
        <div className="navbar-right">
          <div className="user-badge">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="btn btn-ghost navbar-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
