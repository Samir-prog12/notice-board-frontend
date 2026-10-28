import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Crest from './Crest.jsx';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <Crest className="crest" />
          <span className="navbar__titles">
            <span className="navbar__college">RD National &amp; SWA Science College</span>
            <span className="navbar__product">Digital Notice Board</span>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Main">
          {isAuthenticated ? (
            <>
              <NavLink to="/notices">Notices</NavLink>
              {isAdmin && <NavLink to="/manage/admins">Add admin</NavLink>}
              <span className="navbar__user">
                <span className="avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="navbar__name">{user.username}</span>
                {isAdmin && <span className="badge badge--admin">Admin</span>}
              </span>
              <button type="button" className="btn btn--small" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Create account</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
