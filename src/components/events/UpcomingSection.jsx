// src/components/events/UpcomingSection.jsx
import { useEffect, useState } from "react";
import "./UpcomingSection.css";
import data from "../../data/upcomingEvent.json";

export default function UpcomingSection() {
  const [status, setStatus] = useState("off");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    setStatus(data.status);
    if (data.status === "on") {
      setEvent(data.event);
    }

    // ✅ Animation observer
    const card = document.querySelector(".event-card-large, .no-event");
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
    }
  }, []);

  return (
    <section className="upcoming-section">
      {status === "on" && event ? (
        <div className="upcoming-header">
          <h2 className="upcoming-title">Upcoming Events</h2>
          <p className="upcoming-description">
            A new chapter of events is about to begin. Don’t miss this chance to
            engage, explore, and be part of something amazing.
          </p>
        </div>
      ) : (
        <p></p>
      )}
      <div className="container">
        {status === "on" && event ? (
          <div className="event-card-large">
            <div className="event-image-wrapper">
              <img src={event.image} alt={event.title} className="event-img" />
            </div>

            <div className="event-info">
              <h2>{event.title}</h2>
              <hr className="event-divider" />

              <div className="event-meta">
                <p className="event-date">
                  <i className="far fa-calendar-alt"></i> {event.date}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
              </div>

              <p className="event-desc">{event.description}</p>
              <p className="event-cta">Don’t wait — register today!</p>

              <div className="social-links">
                {event.socials?.facebook && (
                  <a
                    href={event.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {event.socials?.instagram && (
                  <a
                    href={event.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {event.socials?.linkedin && (
                  <a
                    href={event.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
              </div>

              <a href={event.link} className="event-btn">
                Register
              </a>
            </div>
          </div>
        ) : (
          <div className="no-event">
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
                <a href="https://www.facebook.com/profile.php?id=61560937966305" target="_blank" rel="noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/ieeemetsb/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
