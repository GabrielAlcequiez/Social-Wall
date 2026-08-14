import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Header() { 
    const { user } = useAuth();

    return (
        <header>
            <Link to="/"><h1>Social Wall</h1></Link>
            <nav>
                {user ? (
                    <div>
                        <Link to="/create-post">Crear Publicación</Link>
                        <a>Cerrar Sesión</a>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Iniciar Sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </div>
                )}
            </nav>
        </header>
    )
}
export default Header;