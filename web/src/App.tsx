import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./errors/NotFound";
import Landing from "./pages/Landing";
import "./App.css";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Auth - No Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* With AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Not Found - No Layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
