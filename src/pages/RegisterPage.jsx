import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/;

function RegisterPage() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });
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

    const name = form.name.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const username = form.username.trim();
    const password = form.password;

    const nextErrors = {};
    if (!name) {
      nextErrors.name = "El nombre es obligatorio.";
    }
    if (!lastName) {
      nextErrors.lastName = "El apellido es obligatorio.";
    }
    if (!email) {
      nextErrors.email = "El email es obligatorio.";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "El email no es válido.";
    }
    if (!username) {
      nextErrors.username = "El nombre de usuario es obligatorio.";
    } else if (!USERNAME_REGEX.test(username)) {
      nextErrors.username = "Solo letras, números, punto, guion y guion bajo.";
    }
    if (!password) {
      nextErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name, lastName, email, username, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Ocurrió un error al registrarse.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Registro</h1>
        <p className="auth-subtitle">Crea tu cuenta en SocialWall</p>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={errors.name ? "field-invalid" : ""}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            className={errors.lastName ? "field-invalid" : ""}
          />
          {errors.lastName && <p className="field-error">{errors.lastName}</p>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={errors.email ? "field-invalid" : ""}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="username">Nombre de Usuario</label>
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
            {submitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;