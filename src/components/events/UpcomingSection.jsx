// src/components/events/UpcomingSection.jsx
import { useEffect, useRef, useState } from "react";
import "./UpcomingSection.css";
import { Link } from "react-router-dom";
import data from "../../data/upcomingEvent.json";

export default function UpcomingSection() {
  const [status, setStatus] = useState("off");
  const [event, setEvent] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    setStatus(data.status);
    if (data.status === "on") {
      setEvent(data.event);
    }

    const card = cardRef.current;
    if (card) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.classList.add("show");
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(card);

      return () => observer.disconnect();
    }
  }, []);

  const isExternalLink = event?.link?.startsWith("http");

  return (
    <section className="upcoming-section">
      {status === "on" && event ? (
        <div className="upcoming-header">
          <span className="upcoming-kicker">Next Experience</span>
          <h2 className="upcoming-title">Upcoming Event</h2>
          <img src="img/hr.svg" alt="Divider" className="upcoming-section-divider" />
          <p className="upcoming-description">
            A new chapter is about to begin. Join us for a high-energy event
            crafted to inspire, connect, and level up your journey.
          </p>
        </div>
      ) : (
        <p className="upcoming-header-placeholder" />
      )}

      <div className="container">
        {status === "on" && event ? (
          <article className="event-card-large" ref={cardRef}>
            <div className="event-image-wrapper">
              <span className="event-status-pill">Live Soon</span>
              <img src={event.image} alt={event.title} className="event-img" />
            </div>

            <div className="event-info">
              <h2>{event.title}</h2>
              <p className="event-subtitle">Your next opportunity starts here.</p>

              <div className="event-meta">
                <p className="event-date event-meta-item">
                  <i className="far fa-calendar-alt"></i> {event.date}
                </p>
                <p className="event-location event-meta-item">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
              </div>

              <p className="event-desc">{event.description}</p>
              <p className="event-cta">Seats are limited - reserve your spot now.</p>

              <div className="event-actions">
                <div className="social-links">
                  {event.socials?.facebook && (
                    <a
                      href={event.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {event.socials?.instagram && (
                    <a
                      href={event.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {event.socials?.linkedin && (
                    <a
                      href={event.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                </div>

                {isExternalLink ? (
                  <a
                    href={event.link}
                    className="event-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Register Now
                  </a>
                ) : (
                  <Link to={event.link} className="event-btn">
                    Register Now
                  </Link>
                )}
              </div>
            </div>
          </article>
        ) : (
          <article className="no-event" ref={cardRef}>
            <img
              src="/img/no-event.svg"
              alt="No events"
              className="no-event-img"
            />
            <div className="no-event-info">
              <h2>No Upcoming Events!</h2>
              <p>
                Currently, there are no scheduled events. But don’t worry —
                we’re working on exciting workshops, talks, and competitions
                that will be announced soon.
              </p>
              <p>
                Stay connected with us through our social media platforms to be
                the first to know about upcoming opportunities and activities.
              </p>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/profile.php?id=61560937966305"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/ieeemetsb/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
