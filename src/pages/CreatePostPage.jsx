import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPost, extractYouTubeId } from "../services/postService";

function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", youtubeUrl: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const content = form.content.trim();
    const youtubeUrl = form.youtubeUrl.trim();

    const nextErrors = {};
    if (!title) nextErrors.title = "El título es obligatorio.";
    if (!content) nextErrors.content = "El contenido es obligatorio.";
    if (youtubeUrl && !extractYouTubeId(youtubeUrl)) {
      nextErrors.youtubeUrl = "La URL de YouTube no es válida.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createPost({ authorId: user.uid, title, content, youtubeUrl });
      navigate("/");
    } catch {
      setError("No se pudo publicar. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="auth-title">Crear Publicación</h1>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={errors.title ? "field-invalid" : ""}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}

          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            value={form.content}
            onChange={handleChange}
            required
            className={errors.content ? "field-invalid" : ""}
          />
          {errors.content && <p className="field-error">{errors.content}</p>}

          <label htmlFor="youtubeUrl">URL de YouTube (opcional)</label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.youtubeUrl}
            onChange={handleChange}
            className={errors.youtubeUrl ? "field-invalid" : ""}
          />
          {errors.youtubeUrl && <p className="field-error">{errors.youtubeUrl}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;