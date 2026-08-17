// src/pages/GenesisIntro.jsx
// Redesigned Genesis (Version 1) Gateway & Intro Page
// Minimal, 3D Cube-Driven, Fast-Reading, Immersive Flow

import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import GenesisCubeBackground from "../components/genesis/GenesisCubeBackground";
import { GENESIS_CONFIG } from "../config/genesisConfig";
import { useEventCountdown } from "../hooks/useEventCountdown";

import "../styles/GenesisIntro.css";

export default function GenesisIntro() {
  const countdown = useEventCountdown(GENESIS_CONFIG.registrationDeadline);

  // Track icons mapping
  const trackIcons = {
    "AI": "fas fa-brain",
    "Cybersecurity": "fas fa-shield-halved",
    "Robotics": "fas fa-robot",
    "Mobile Application": "fas fa-mobile-screen-button",
    "IoT": "fas fa-wifi",
    "Graduation Projects": "fas fa-graduation-cap",
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <div className="genesis-redesign-page">
      <Helmet>
        <title>Genesis | IEEE MET SB — Version 1: Build. Solve. Create.</title>
        <meta
          name="description"
          content="Genesis is our Version 1 technology competition across 6 Technical Tracks: AI, Cybersecurity, Robotics, Mobile Application, IoT, and Graduation Projects. Register your team now."
        />
        <meta
          name="keywords"
          content="Genesis, IEEE MET SB, Hackathon, Competition, AI, Cybersecurity, Robotics, Mobile Application, IoT, Graduation Projects, Mansoura"
        />
      </Helmet>

      <Header />
      <GenesisCubeBackground />

      <main className="genesis-intro-main">
        <div className="genesis-intro-wrapper">
          {/* ─── SECTION 1: IMMERSIVE HERO VIEWPORT ──────────────── */}
          <motion.section
            className="genesis-hero-split"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Left: Headline, Info, Integrated Countdown, CTAs */}
            <motion.div className="genesis-hero-primary" variants={fadeInUp}>
              <div className="genesis-badge-row">
                <span className="genesis-version-chip">{GENESIS_CONFIG.version}</span>
                <span className={`genesis-status-chip ${countdown.isClosed ? "closed" : ""}`}>
                  <span className="status-dot" />
                  {countdown.isOpen ? "Registration Open" : "Registration Closed"}
                </span>
              </div>

              <h1 className="genesis-brand-title">{GENESIS_CONFIG.name}</h1>
              <p className="genesis-brand-tagline">{GENESIS_CONFIG.tagline}</p>

              {/* Event Date & Location */}
              <div className="genesis-quick-meta">
                <div className="quick-meta-pill">
                  <i className="far fa-calendar-alt"></i>
                  <span>{GENESIS_CONFIG.date}</span>
                </div>
                <div className="quick-meta-pill">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{GENESIS_CONFIG.location}</span>
                </div>
              </div>

              {/* Integrated Sleek Countdown */}
              <div className="genesis-hero-timer-strip">
                <div className="timer-strip-header">
                  <i className="fas fa-clock"></i>
                  <span>
                    {countdown.isOpen ? "Registration Closes In:" : "Registration Status:"}
                  </span>
                  {countdown.isOpen && (
                    <span className="timer-deadline-note">26 Aug (23:59 Egypt)</span>
                  )}
                </div>

                {countdown.isOpen ? (
                  <div className="hero-countdown-digits">
                    <div className="timer-unit">
                      <span className="digit">{String(countdown.days).padStart(2, "0")}</span>
                      <span className="label">DAYS</span>
                    </div>
                    <span className="unit-sep">:</span>
                    <div className="timer-unit">
                      <span className="digit">{String(countdown.hours).padStart(2, "0")}</span>
                      <span className="label">HOURS</span>
                    </div>
                    <span className="unit-sep">:</span>
                    <div className="timer-unit">
                      <span className="digit">{String(countdown.minutes).padStart(2, "0")}</span>
                      <span className="label">MINS</span>
                    </div>
                    <span className="unit-sep">:</span>
                    <div className="timer-unit">
                      <span className="digit">{String(countdown.seconds).padStart(2, "0")}</span>
                      <span className="label">SECS</span>
                    </div>
                  </div>
                ) : (
                  <div className="hero-timer-closed">
                    <i className="fas fa-lock"></i> Registration Period Ended
                  </div>
                )}
              </div>

              {/* Hero Action Buttons */}
              <div className="genesis-hero-actions">
                {countdown.isOpen ? (
                  <Link to={GENESIS_CONFIG.routes.register} className="genesis-glow-btn primary">
                    <span>Start Registration</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                ) : (
                  <button className="genesis-glow-btn primary disabled" disabled aria-disabled="true">
                    <span>Registration Closed</span>
                    <i className="fas fa-lock"></i>
                  </button>
                )}

                <a
                  href={GENESIS_CONFIG.ruleBookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="genesis-glow-btn secondary"
                >
                  <i className="fas fa-book-open"></i>
                  <span>View Rule Book</span>
                </a>
              </div>
            </motion.div>

            {/* Right: Seamless Integrated Artwork */}
            <motion.div className="genesis-hero-visual" variants={fadeInUp}>
              <div className="artwork-ambient-frame">
                <div className="artwork-glow-radial" />
                <img
                  src={GENESIS_CONFIG.heroImage}
                  alt="Genesis 3D Cube Artwork"
                  className="genesis-artwork-img"
                  loading="eager"
                />
                {/* Futuristic Cube Corner Accents */}
                <div className="corner-accent top-left" />
                <div className="corner-accent top-right" />
                <div className="corner-accent bottom-left" />
                <div className="corner-accent bottom-right" />
              </div>
            </motion.div>
          </motion.section>

          {/* ─── SECTION 2: SHORT ABOUT GENESIS ──────────────────── */}
          <motion.section
            className="genesis-fluid-section about-fluid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <div className="section-cyber-kicker">
              <span className="kicker-num">01 //</span>
              <span className="kicker-title">THE CONCEPT</span>
            </div>

            <div className="about-flowing-body">
              <h2 className="about-lead-headline">
                Where ideas turn into <span className="highlight-text">real, working projects.</span>
              </h2>
              <p className="about-paragraph">
                Genesis is our Version 1 technology competition where teams compete across six
                technical tracks, build with mentorship and technical support, and present their final
                solutions before technical judges.
              </p>
              <p className="about-slogan">
                Build. Learn. Compete. Create something real.
              </p>
            </div>
          </motion.section>

          {/* ─── SECTION 3: 6 TECHNICAL TRACKS CHIPS ─────────────── */}
          <motion.section
            className="genesis-fluid-section tracks-fluid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <div className="section-cyber-kicker">
              <span className="kicker-num">02 //</span>
              <span className="kicker-title">INNOVATION DOMAINS</span>
            </div>

            <h3 className="tracks-section-headline">Six Technical Tracks</h3>

            <div className="genesis-tracks-stream">
              {GENESIS_CONFIG.tracks.map((track) => (
                <div
                  key={track.id}
                  className="track-stream-pill"
                  style={{ "--pill-accent": track.color || "#00d4ff" }}
                >
                  <div className="pill-icon-box">
                    <i className={trackIcons[track.name] || `fas ${track.icon}`}></i>
                  </div>
                  <span className="pill-title">{track.name}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ─── SECTION 4: FINAL ACTION AREA ────────────────────── */}
          <motion.section
            className="genesis-fluid-section cta-fluid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
          >
            <div className="cta-inner-panel">
              <div className="section-cyber-kicker center">
                <span className="kicker-num">03 //</span>
                <span className="kicker-title">ENTRY</span>
              </div>

              <h2 className="cta-headline">Ready to Compete?</h2>

              <p className="cta-guideline-note">
                Please review the official Rule Book before registering your team (supports 1–5 members).
              </p>

              <div className="cta-action-row">
                {countdown.isOpen ? (
                  <Link to={GENESIS_CONFIG.routes.register} className="genesis-glow-btn primary large">
                    <span>Start Registration</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                ) : (
                  <button className="genesis-glow-btn primary large disabled" disabled aria-disabled="true">
                    <span>Registration Closed</span>
                    <i className="fas fa-lock"></i>
                  </button>
                )}

                <a
                  href={GENESIS_CONFIG.ruleBookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="genesis-glow-btn secondary large"
                >
                  <i className="fas fa-book-open"></i>
                  <span>View Rule Book</span>
                </a>
              </div>

              {countdown.isClosed && (
                <p className="cta-closed-notice">
                  <i className="fas fa-lock"></i> The registration deadline for Genesis has passed. Submissions are closed.
                </p>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
