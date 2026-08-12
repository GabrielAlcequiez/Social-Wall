import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>

  )

}

export default App;