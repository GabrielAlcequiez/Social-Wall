import { Link } from "react-router-dom";

function Header() { 
    return (
        <header>
            <Link to="/"><h1>Social Wall</h1></Link>
            <nav>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrarse</Link>
            </nav>
        </header>
    )
}
export default Header;