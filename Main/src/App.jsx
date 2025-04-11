import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import ProtectedPage from "./components/ProtectedPage.jsx";
import RegisterForm from "./components/RegisterForm.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<ProtectedPage />} />
    </Routes>
  );
}
