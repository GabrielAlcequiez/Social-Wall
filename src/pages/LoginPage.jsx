function LoginPage() {
    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form>
                <label htmlFor="username">Usuario:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" required />
            </form>
        </div>
        
    )
}
export default LoginPage;