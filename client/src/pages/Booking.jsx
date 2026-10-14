import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, Clock3, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import api from "../api";

export default function Booking({ auth }) {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ date: "", time: "", address: "", notes: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { api.get("/services").then(res => setServices(res.data)).catch(() => {}); }, []);
  const service = services.find(item => item.id === serviceId);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    if (!auth.user) { navigate("/login"); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/bookings", { ...form, serviceId });
      navigate("/bookings", { state: { message: "Your booking request has been received." } });
    } catch (err) { setError(err.response?.data?.message || "Unable to create booking. Please try again."); }
    finally { setLoading(false); }
  };
  if (!service) return <main className="container py-5"><p>Loading service...</p><Link to="/">Back to services</Link></main>;
  return <main className="booking-page container">
    <Link to="/" className="back-link"><ArrowLeft size={16} /> All services</Link>
    <div className="booking-heading"><div className="eyebrow"><span className="eyebrow-line" /> YOUR TIME, YOUR SPACE</div><h1>Make time for <em>yourself.</em></h1><p>A few details and your moment of calm is one step closer.</p></div>
    <div className="row g-4 align-items-start">
      <div className="col-lg-7"><form className="booking-form" onSubmit={submit}>
        <h2><span>01</span> When should we come?</h2>
        <div className="row g-3"><div className="col-sm-6"><label>Date<input type="date" name="date" min={minDate} value={form.date} onChange={update} required /></label></div><div className="col-sm-6"><label>Start time<select name="time" value={form.time} onChange={update} required><option value="">Choose a time</option>{["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(t => <option key={t} value={t}>{new Date(`2000-01-01T${t}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</option>)}</select></label></div></div>
        <h2 className="form-section-title"><span>02</span> Where should we meet you?</h2>
        <label>Full home address<textarea name="address" rows="3" value={form.address} onChange={update} placeholder="Flat/house, street, area, city, PIN code" required minLength="10" /></label>
        <label>Anything we should know? <small>(Optional)</small><textarea name="notes" rows="2" value={form.notes} onChange={update} placeholder="Gate instructions or preferences" /></label>
        {error && <div className="alert alert-danger">{error}</div>}
        {!auth.user && <div className="alert alert-info">You'll be asked to sign in before confirming your booking.</div>}
        <button className="btn btn-dark btn-lg rounded-pill w-100" disabled={loading}>{loading ? "Sending request..." : "Request my booking"} <Sparkles size={17} /></button>
        <p className="booking-disclaimer"><ShieldCheck size={15} /> Your address is only used to manage this appointment.</p>
      </form></div>
      <div className="col-lg-5"><aside className="booking-summary"><div className="summary-art"><Sparkles size={34} /><span>YOUR MOMENT<br />OF CALM</span></div><div className="summary-content"><span className="summary-label">YOUR SELECTED EXPERIENCE</span><h2>{service.name}</h2><p>{service.description}</p><div className="summary-detail"><Clock3 size={17} /><span>{service.duration} minutes</span></div><div className="summary-detail"><MapPin size={17} /><span>At your home</span></div><div className="summary-divider" /><div className="summary-price"><span>Session total</span><strong>₹{service.price.toLocaleString("en-IN")}</strong></div><small>Payment arrangements can be confirmed with your provider.</small></div></aside></div>
    </div>
  </main>;
}
