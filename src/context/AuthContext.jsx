import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import {auth} from "../services/firebaseConfig";

// Permite compartir info entre componentes sin necesidad de pasar props manualmente a cada nivel del árbol de componentes.
const AuthContext = createContext(); 

// Es el que provee el contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Los componentes dentro de este proveedor pueden acceder a user y loading a través del contexto.
    return (
        <AuthContext.Provider value={{ user, loading /* Dato que comparto*/ }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
