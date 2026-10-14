import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Check, Clock3, Heart, Menu, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import api from "./api";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";

export function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rah_user") || "null"); } catch { return null; }
  });
  const signIn = (data) => {
    localStorage.setItem("rah_token", data.token);
    localStorage.setItem("rah_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const signOut = () => {
    localStorage.removeItem("rah_token");
    localStorage.removeItem("rah_user");
    setUser(null);
  };
  return { user, signIn, signOut };
}

export default function App() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => { auth.signOut(); navigate("/"); };
  return (
    <>
      <div className="topline"><span>YOUR MOMENT OF CALM, RIGHT AT HOME</span><span><ShieldCheck size={14} /> Vetted wellness professionals</span></div>
      <header className="site-header">
        <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={20} /></span><span>relax<span className="brand-light">at</span>home</span></Link>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Explore</NavLink>
          {auth.user && <NavLink to="/bookings" onClick={() => setMenuOpen(false)}>My bookings</NavLink>}
          <a href="/#services" onClick={() => setMenuOpen(false)}>Our services</a>
          {auth.user ? <><span className="nav-greeting">Hi, {auth.user.name.split(" ")[0]}</span><button className="btn btn-dark rounded-pill px-4" onClick={logout}>Sign out</button></> : <Link className="btn btn-dark rounded-pill px-4" to="/login" onClick={() => setMenuOpen(false)}>Sign in <ArrowUpRight size={16} /></Link>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" auth={auth} />} />
        <Route path="/register" element={<Auth mode="register" auth={auth} />} />
        <Route path="/book/:serviceId" element={<Booking auth={auth} />} />
        <Route path="/bookings" element={<Bookings auth={auth} />} />
        <Route path="*" element={<main className="container py-5"><h2>Page not found</h2><Link to="/">Back home</Link></main>} />
      </Routes>
      <footer className="footer"><div className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>relax<span className="brand-light">at</span>home</span></div><p>Make room for feeling good.</p><span>© 2026 RelaxAtHome · Wellness that comes to you</span></footer>
    </>
  );
}
