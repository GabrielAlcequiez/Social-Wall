function RegisterPage() {
    return (
        <>
            <h2>Registrate</h2>

            <form>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="lastName">Apellido:</label>
                <input type="text" id="lastName" name="lastName" required />

                <label htmlFor="username"> Nombre de Usuario:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" required />
            </form>

        </>

    )
}
export default RegisterPage