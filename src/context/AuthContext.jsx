import { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc
} from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

const AuthContext = createContext();

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Ese email ya está en uso.",
  "auth/invalid-email": "El email no es válido.",
  "auth/weak-password": "La clave debe tener al menos 6 caracteres.",
  "auth/invalid-credential": "Usuario o clave incorrectos.",
  "auth/user-not-found": "Usuario o clave incorrectos.",
  "auth/wrong-password": "Usuario o clave incorrectos.",
  "auth/too-many-requests": "Demasiados intentos. Probá de nuevo más tarde."
};

function toFriendlyError(error) {
  if (error && error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return new Error(AUTH_ERROR_MESSAGES[error.code]);
  }
  return error;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const normalizeUsername = (username) => username.trim().toLowerCase();

  async function register({ name, lastName, email, username, password }) {
    const normalized = normalizeUsername(username);

    const existing = await getDocs(
      query(collection(db, "users"), where("username", "==", normalized))
    );
    if (!existing.empty) {
      throw new Error("Ese nombre de usuario ya está en uso.");
    }

    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw toFriendlyError(error);
    }

    const profileData = {
      name: name.trim(),
      lastName: lastName.trim(),
      username: normalized,
      email
    };
    await setDoc(doc(db, "users", userCredential.user.uid), profileData);
    setProfile(profileData);
  }

  async function login({ username, password }) {
    const normalized = normalizeUsername(username);

    const snap = await getDocs(
      query(collection(db, "users"), where("username", "==", normalized))
    );
    if (snap.empty) {
      throw new Error("Usuario o clave incorrectos.");
    }

    const email = snap.docs[0].data().email;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw toFriendlyError(error);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}