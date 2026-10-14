import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Heart, ShieldCheck, Sparkles, Star } from "lucide-react";
import api from "../api";

const fallback = [
  { id: "classic", name: "Classic Relaxation", duration: 60, price: 1499, description: "A calming full-body massage designed to ease everyday tension.", tag: "Most popular" },
  { id: "deep-tissue", name: "Deep Tissue", duration: 60, price: 1799, description: "Focused pressure for common areas of muscle tightness.", tag: "Targeted relief" },
  { id: "aroma", name: "Aromatherapy", duration: 75, price: 1999, description: "A relaxing session paired with aromatic massage oils.", tag: "Slow down" },
  { id: "head-shoulder", name: "Head & Shoulder", duration: 30, price: 899, description: "A shorter session focused on the head, neck, and shoulders.", tag: "Quick reset" }
];
const symbols = ["✳", "◌", "❋", "☼"];

export default function Home() {
  const [services, setServices] = useState(fallback);
  useEffect(() => { api.get("/services").then(res => setServices(res.data)).catch(() => {}); }, []);
  return (
    <main>
      <section className="hero container-fluid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> WELLNESS, ON YOUR TERMS</div>
          <h1>Come home.<br />Let go of <em>everything.</em></h1>
          <p className="hero-desc">Your personal reset, without stepping outside. Thoughtful massage experiences, delivered to the place you feel best.</p>
          <div className="hero-actions"><a href="#services" className="btn btn-dark btn-lg rounded-pill px-4">Find your massage <ArrowUpRight size={18} /></a><div className="rating"><span className="rating-stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></span><span>Care that feels personal</span></div></div>
          <div className="hero-trust"><span><Check size={15} /> At-home convenience</span><span><Check size={15} /> Your comfort comes first</span></div>
        </div>
        <div className="hero-art">
          <div className="art-sun" />
          <div className="art-label"><Sparkles size={16} /><span>YOUR SPACE.<br />YOUR PACE.</span></div>
          <div className="art-plant plant-one"><i /><i /><i /><i /><b /></div>
          <div className="art-plant plant-two"><i /><i /><i /><b /></div>
          <div className="art-couch"><div className="couch-back" /><div className="couch-seat" /><div className="couch-pillow" /><div className="couch-leg leg-left" /><div className="couch-leg leg-right" /></div>
          <div className="art-person"><div className="person-hair" /><div className="person-head" /><div className="person-body" /><div className="person-arm" /></div>
          <div className="art-table"><div className="table-top" /><div className="table-leg" /><div className="oil-bottle" /><div className="candle" /></div>
          <div className="art-caption"><span>01 / 04</span><span>Slow down. Breathe in.</span><ArrowDown size={16} /></div>
        </div>
        <div className="hero-bottom"><span>GOOD CARE SHOULD FEEL THIS EASY</span><div className="scroll-line" /><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <section className="benefit-strip container">
        <div><span className="benefit-icon"><ShieldCheck /></span><span><strong>Professionals first</strong><small>Care you can feel confident about</small></span></div>
        <div><span className="benefit-icon"><CalendarDays /></span><span><strong>Your schedule</strong><small>Book a time that works for you</small></span></div>
        <div><span className="benefit-icon"><Heart /></span><span><strong>Made for you</strong><small>A little more you-time</small></span></div>
      </section>
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FEEL-GOOD</div><h2>A little care goes<br /><em>a long way.</em></h2></div><p>Choose the experience your body is asking for. We'll bring the calm to your door.</p></div>
          <div className="row g-4">
            {services.map((service, i) => <div className="col-12 col-sm-6 col-lg-3" key={service.id}><article className={`service-card service-card-${i}`}>
              <div className="service-visual"><span className="service-symbol">{symbols[i % symbols.length]}</span><span className="service-tag">{service.tag}</span><div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" /><span className="visual-number">0{i + 1}</span></div>
              <div className="service-content"><div className="service-time"><Clock3 size={14} /> {service.duration} min</div><h3>{service.name}</h3><p>{service.description}</p><div className="service-bottom"><strong>₹{service.price.toLocaleString("en-IN")}</strong><Link to={`/book/${service.id}`} className="round-arrow" aria-label={`Book ${service.name}`}><ArrowRight size={18} /></Link></div></div>
            </article></div>)}
          </div>
          <div className="service-note"><Sparkles size={17} /><span>Every session is designed around your comfort, your space, and your time.</span></div>
        </div>
      </section>
      <section className="how-section container">
        <div className="how-intro"><div className="eyebrow"><span className="eyebrow-line" /> THREE SIMPLE STEPS</div><h2>Your calm is<br /><em>closer than ever.</em></h2><p>No commute. No waiting room. Just a little space to feel like yourself again.</p><Link to="/register" className="text-link">Start your reset <ArrowRight size={17} /></Link></div>
        <div className="steps"><div className="step"><span className="step-num">01</span><div><h3>Pick your experience</h3><p>Find a massage that fits your mood, needs, and schedule.</p></div><span className="step-icon"><Sparkles /></span></div><div className="step"><span className="step-num">02</span><div><h3>Choose your time</h3><p>Share your address and pick a slot that works for you.</p></div><span className="step-icon"><CalendarDays /></span></div><div className="step"><span className="step-num">03</span><div><h3>Settle in</h3><p>Your booking details are ready. All you need to do is relax.</p></div><span className="step-icon"><Heart /></span></div></div>
      </section>
      <section className="closing-cta"><div className="cta-spark">✳</div><div className="eyebrow"><span className="eyebrow-line" /> YOU DESERVE THIS</div><h2>Take a breath.<br /><em>We'll take it from here.</em></h2><Link to="/register" className="btn btn-light rounded-pill px-4">Book your first session <ArrowUpRight size={17} /></Link></section>
    </main>
  );
}
