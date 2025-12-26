import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./errors/NotFound";
import Landing from "./pages/Landing";
import "./App.css";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={
          <Landing />
        } />
        <Route path="/home" element={
          <Home />
        } />
        <Route path="/about" element={
          <About />
        } />
        <Route path="*" element={
          <NotFound />
        } />
      </Routes>
    </AppLayout>
  );
}
