import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "El usuario es obligatorio.";
    if (!form.password) nextErrors.password = "La contraseña es obligatoria.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({ username: form.username, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Ocurrió un error al iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar Sesión</h1>
        <p className="auth-subtitle">Ingresá con tu usuario para publicar</p>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className={errors.username ? "field-invalid" : ""}
          />
          {errors.username && <p className="field-error">{errors.username}</p>}

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className={errors.password ? "field-invalid" : ""}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;