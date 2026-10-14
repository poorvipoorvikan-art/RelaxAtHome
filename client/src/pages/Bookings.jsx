import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import api from "../api";

export default function Bookings({ auth }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.user) { navigate("/login"); return; }
    api.get("/bookings").then(res => setBookings(res.data)).catch(err => setError(err.response?.data?.message || "Could not load bookings.")).finally(() => setLoading(false));
  }, [auth.user, navigate]);
  const cancel = async id => {
    setCancelId(id); setError("");
    try { const { data } = await api.patch(`/bookings/${id}/cancel`); setBookings(old => old.map(item => item.id === id ? data : item)); }
    catch (err) { setError(err.response?.data?.message || "Could not cancel booking."); }
    finally { setCancelId(""); }
  };
  return <main className="bookings-page container">
    <div className="bookings-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR WELLNESS, YOUR WAY</div><h1>My <em>bookings.</em></h1><p>All your moments of calm, in one place.</p></div><Link to="/#services" className="btn btn-dark rounded-pill px-4">Book a session <ArrowUpRight size={17} /></Link></div>
    {location.state?.message && <div className="alert alert-success">{location.state.message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <div className="empty-state">Loading your bookings...</div> : bookings.length === 0 ? <div className="empty-state"><span className="empty-icon"><Sparkles size={28} /></span><h2>Your next reset is waiting.</h2><p>You haven't booked a session yet. Choose an experience and make a little room for yourself.</p><Link to="/#services" className="btn btn-dark rounded-pill px-4">Explore massages <ArrowUpRight size={17} /></Link></div> :
      <div className="booking-list">{bookings.map(item => <article className="booking-item" key={item.id}><div className="booking-item-icon"><Sparkles size={22} /></div><div className="booking-item-main"><div className="booking-item-title"><h2>{item.serviceName}</h2><span className={`status status-${item.status}`}>{item.status.replace("-", " ")}</span></div><div className="booking-meta"><span><CalendarDays size={15} /> {item.date}</span><span><Clock3 size={15} /> {item.time}</span><span><MapPin size={15} /> {item.address}</span></div>{item.notes && <p className="booking-notes">Note: {item.notes}</p>}</div><div className="booking-item-side"><strong>₹{item.price.toLocaleString("en-IN")}</strong>{item.status === "pending" && <button className="btn btn-outline-secondary btn-sm rounded-pill" disabled={cancelId === item.id} onClick={() => cancel(item.id)}>{cancelId === item.id ? "Cancelling..." : "Cancel request"}</button>}</div></article>)}</div>}
  </main>;
}
