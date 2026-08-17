// src/components/events/UpcomingSection.jsx
import { useEffect, useRef, useState } from "react";
import "./UpcomingSection.css";
import { Link } from "react-router-dom";
import data from "../../data/upcomingEvent.json";
import { GENESIS_CONFIG } from "../../config/genesisConfig";
import { useEventCountdown } from "../../hooks/useEventCountdown";

export default function UpcomingSection() {
  const [status, setStatus] = useState("off");
  const [event, setEvent] = useState(null);
  const cardRef = useRef(null);

  // Hook for live registration countdown driven by single source of truth
  const countdown = useEventCountdown(GENESIS_CONFIG.registrationDeadline);

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

  const isGenesis = event?.title?.toLowerCase().includes("genesis");
  const isExternalLink = event?.link?.startsWith("http");

  // Determine hero image with support for the Genesis asset
  const displayImage = isGenesis ? GENESIS_CONFIG.heroImage : event?.image;

  // Track icons map matching the design screenshot
  const trackIcons = {
    "AI": "fas fa-brain",
    "Cybersecurity": "fas fa-shield-halved",
    "Robotics": "fas fa-robot",
    "Mobile Application": "fas fa-mobile-screen-button",
    "IoT": "fas fa-wifi",
    "Graduation Projects": "fas fa-graduation-cap",
  };

  return (
    <section className="upcoming-section">
      {status === "on" && event ? (
        <div className="upcoming-header">
          <span className="upcoming-kicker">NEXT EXPERIENCE</span>
          <h2 className="upcoming-title">Upcoming Event</h2>
          
          {/* Cyber Geometric Diamond Divider */}
          <div className="upcoming-cyber-divider">
            <span className="divider-line left"></span>
            <span className="divider-diamond"></span>
            <span className="divider-line right"></span>
          </div>

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
          <article className="event-card-large genesis-upcoming-theme" ref={cardRef}>
            {/* Left Side: Content & Actions */}
            <div className="event-info">
              <div className="event-title-badge-group">
                <h2 className="event-main-title">{event.title}</h2>
                {event.version && <span className="event-version-pill">{event.version}</span>}
              </div>

              {event.tagline ? (
                <p className="event-subtitle event-tagline">{event.tagline}</p>
              ) : (
                <p className="event-subtitle">Your next opportunity starts here.</p>
              )}

              <div className="event-meta">
                <p className="event-meta-item">
                  <i className="far fa-calendar-alt meta-icon"></i>
                  <span className="meta-text">{event.date}</span>
                </p>
                <p className="event-meta-item">
                  <i className="fas fa-map-marker-alt meta-icon"></i>
                  <span className="meta-text">{event.location}</span>
                </p>
              </div>

              {/* 6 Technical Tracks Chips */}
              {isGenesis && GENESIS_CONFIG.tracks && (
                <div className="event-tracks-preview">
                  <span className="tracks-label">6 TECHNICAL TRACKS:</span>
                  <div className="tracks-chips">
                    {GENESIS_CONFIG.tracks.map((track) => (
                      <span key={track.id} className="track-chip">
                        <i className={trackIcons[track.name] || `fas ${track.icon}`}></i>
                        <span>{track.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Registration Countdown & Deadline box */}
              <div className="event-countdown-container">
                <div className="countdown-header-row">
                  <span className="countdown-title">
                    <i className="fas fa-hourglass-half"></i> REGISTRATION DEADLINE
                  </span>
                  <span className="countdown-deadline-date">
                    26 Aug 2026 (23:59 Egypt Time)
                  </span>
                </div>

                {countdown.isOpen ? (
                  <div className="countdown-timer-grid">
                    <div className="time-block">
                      <span className="time-val">{String(countdown.days).padStart(2, "0")}</span>
                      <span className="time-lbl">DAYS</span>
                    </div>
                    <div className="time-colon">:</div>
                    <div className="time-block">
                      <span className="time-val">{String(countdown.hours).padStart(2, "0")}</span>
                      <span className="time-lbl">HOURS</span>
                    </div>
                    <div className="time-colon">:</div>
                    <div className="time-block">
                      <span className="time-val">{String(countdown.minutes).padStart(2, "0")}</span>
                      <span className="time-lbl">MINS</span>
                    </div>
                    <div className="time-colon">:</div>
                    <div className="time-block">
                      <span className="time-val">{String(countdown.seconds).padStart(2, "0")}</span>
                      <span className="time-lbl">SECS</span>
                    </div>
                  </div>
                ) : (
                  <div className="countdown-closed-notice">
                    <i className="fas fa-lock"></i> Registration period has ended.
                  </div>
                )}
              </div>

              <div className="event-desc-wrapper">
                <p className="event-desc">{event.description}</p>
                <Link to={GENESIS_CONFIG.routes.intro} className="event-cta-link">
                  <i className="fas fa-arrow-up-right-from-square"></i>
                  <span>Explore the competition tracks & review rules before registering.</span>
                </Link>
              </div>

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

                <div className="event-btn-group">
                  {isGenesis && (
                    <a
                      href={GENESIS_CONFIG.ruleBookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="event-rulebook-btn"
                    >
                      <i className="fas fa-book-open"></i>
                      <span>Rule Book</span>
                    </a>
                  )}

                  {countdown.isClosed ? (
                    <button className="event-btn disabled" disabled aria-disabled="true">
                      <span>Registration Closed</span>
                      <i className="fas fa-lock"></i>
                    </button>
                  ) : isExternalLink ? (
                    <a
                      href={event.link}
                      className="event-btn primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Register Now</span>
                      <span className="btn-icon-circle">
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </a>
                  ) : (
                    <Link to={event.link || "/genesis"} className="event-btn primary">
                      <span>Register Now</span>
                      <span className="btn-icon-circle">
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Artwork with Registration Status Badge */}
            <div className="event-image-wrapper">
              <span className={`event-status-pill ${countdown.isClosed ? "closed" : ""}`}>
                <span>{countdown.isClosed ? "REGISTRATION CLOSED" : "REGISTRATION OPEN"}</span>
                <span className="pulse-dot"></span>
              </span>
              <img src={displayImage} alt={event.title} className="event-img" />
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
