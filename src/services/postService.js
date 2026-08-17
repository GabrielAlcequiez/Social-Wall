import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const POSTS = "posts";
const USERS = "users";

export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function timeAgo(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return date.toLocaleDateString();
}

export async function getPosts() {
  const snap = await getDocs(
    query(collection(db, POSTS), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUsers() {
  const snap = await getDocs(collection(db, USERS));
  const map = {};
  snap.forEach((d) => {
    map[d.id] = d.data();
  });
  return map;
}

export async function createPost({ authorId, title, content, youtubeUrl }) {
  const data = {
    authorId,
    title: title.trim(),
    content: content.trim(),
    createdAt: serverTimestamp()
  };
  if (youtubeUrl && youtubeUrl.trim()) {
    data.youtubeUrl = youtubeUrl.trim();
  }
  await addDoc(collection(db, POSTS), data);
}

export async function deletePost(postId) {
  await deleteDoc(doc(db, POSTS, postId));
}