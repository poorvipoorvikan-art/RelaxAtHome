import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import api from "../api";

export default function Auth({ mode, auth }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/${isRegister ? "register" : "login"}`, form);
      auth.signIn(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Please try again.");
    } finally { setLoading(false); }
  };
  return <main className="auth-page container">
    <div className="auth-art"><div className="auth-art-circle"><Sparkles size={38} /></div><div className="auth-art-copy"><span>MAKE SPACE FOR YOU</span><h2>Rest is not<br />a reward.<br /><em>It's essential.</em></h2><p>A calmer day starts with a small moment for yourself.</p></div></div>
    <div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back home</Link><div className="eyebrow"><span className="eyebrow-line" /> YOUR WELLNESS JOURNEY</div><h1>{isRegister ? "Let's make room for you." : "Welcome back."}</h1><p className="auth-subtitle">{isRegister ? "Create your account and find your moment of calm." : "Sign in to manage your bookings and make time for yourself."}</p>
      <form onSubmit={submit} className="auth-form">
        {isRegister && <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" minLength="2" required /></label>}
        <label>Email address<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={update} placeholder={isRegister ? "At least 8 characters" : "Your password"} minLength={isRegister ? 8 : undefined} required /></label>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-dark btn-lg rounded-pill w-100" disabled={loading}>{loading ? "Please wait..." : isRegister ? "Create my account" : "Sign in"} <ArrowUpRight size={17} /></button>
      </form>
      <p className="auth-switch">{isRegister ? "Already have an account?" : "New to RelaxAtHome?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
      <div className="auth-safe">Your details are used to manage your bookings only.</div>
    </div>
  </main>;
}
