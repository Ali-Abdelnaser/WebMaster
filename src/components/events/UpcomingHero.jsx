// src/components/events/UpcomingHero.jsx
import "./UpcomingHero.css";

export default function UpcomingHero() {
  return (
    <section className="upcoming-hero">
      <div className="container">
        <h1 className="Home-title">OUR Events</h1>
        <img src="img/hr.svg" alt="Divider" className="upcoming-divider" />
        <p className="hero-description">
          Stay tuned for our latest workshops, sessions, and exciting activities.
        </p>
      </div>
    </section>
  );
}
