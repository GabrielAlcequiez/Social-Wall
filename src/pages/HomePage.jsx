import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getPosts,
  getUsers,
  deletePost,
  extractYouTubeId,
  timeAgo
} from "../services/postService";

function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postList, userMap] = await Promise.all([getPosts(), getUsers()]);
      setPosts(postList);
      setUsersMap(userMap);
    } catch {
      setError("No se pudieron cargar las publicaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function handleDelete(postId) {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;
    setDeletingId(postId);
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setError("");
    } catch {
      setError("No se pudo eliminar la publicación.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="feed">
        <p className="muted">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="feed">
      {error && <p className="error-message">{error}</p>}

      {posts.length === 0 ? (
        <p className="muted">Todavía no hay publicaciones. ¡Creá la primera!</p>
      ) : (
        posts.map((post) => {
          const author = usersMap[post.authorId];
          const authorName = author
            ? `${author.name} ${author.lastName}`
            : "Usuario";
          const initials = author
            ? `${(author.name || "")[0] || ""}${(author.lastName || "")[0] || ""}`.toUpperCase()
            : "?";
          const videoId = extractYouTubeId(post.youtubeUrl);
          const isAuthor = user && user.uid === post.authorId;

          return (
            <article className="post-card" key={post.id}>
              <header className="post-header">
                <span className="avatar" aria-hidden="true">{initials}</span>
                <div className="post-meta">
                  <span className="post-author">{authorName}</span>
                  <span className="post-time">{timeAgo(post.createdAt)}</span>
                </div>
                {isAuthor && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? "Eliminando..." : "Eliminar"}
                  </button>
                )}
              </header>

              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>

              {videoId && (
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="YouTube video"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </article>
          );
        })
      )}
    </main>
  );
}

export default HomePage;