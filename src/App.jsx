/* eslint-disable no-unused-vars */
import { useState } from "react";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, ProtectedRoute } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Importaciones de modulos de Firebase 
import appFirebase from "./services/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(appFirebase);

function App() {


  return (
    <div>
      <Header />
      
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App;