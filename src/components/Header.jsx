import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const initials = (() => {
    if (profile) {
      const first = (profile.name || "")[0] || "";
      const last = (profile.lastName || "")[0] || "";
      return `${first}${last}`.toUpperCase() || "?";
    }
    return "?";
  })();

  return (
    <header className="header">
      <Link to="/" className="header-brand">SocialWall</Link>
      <nav className="header-nav">
        {user ? (
          <>
            <Link to="/create-post" className="btn btn-primary">Crear Publicación</Link>
            <span className="header-divider" />
            <button className="header-link" onClick={handleLogout}>Cerrar sesión</button>
            <span className="avatar" aria-hidden="true">{initials}</span>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;