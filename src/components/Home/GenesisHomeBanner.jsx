// src/components/Home/GenesisHomeBanner.jsx
// Lightweight, high-impact Genesis campaign announcement banner for the Home page

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GENESIS_CONFIG } from "../../config/genesisConfig";
import { useEventCountdown } from "../../hooks/useEventCountdown";
import "./GenesisHomeBanner.css";

export default function GenesisHomeBanner() {
  const countdown = useEventCountdown(GENESIS_CONFIG.registrationDeadline);

  return (
    <section className="genesis-home-section">
      <div className="genesis-home-container">
        <motion.div
          className="genesis-home-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Ambient Glow */}
          <div className="genesis-home-glow" />

          {/* Left Column: Visual Artwork */}
          <div className="genesis-home-visual">
            <div className="genesis-home-image-frame">
              <img
                src={GENESIS_CONFIG.heroImage}
                alt="Genesis Competition Artwork"
                className="genesis-home-img"
                loading="eager"
              />
              <span className={`genesis-home-status-chip ${countdown.isClosed ? "closed" : ""}`}>
                <span className="pulse-dot" />
                {countdown.isOpen ? "Registration Open" : "Registration Closed"}
              </span>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="genesis-home-content">
            <div className="genesis-home-header-row">
              <span className="genesis-home-badge">{GENESIS_CONFIG.edition}</span>
              <span className="genesis-home-type">Technology Competition</span>
            </div>

            <h2 className="genesis-home-title">
              {GENESIS_CONFIG.name} <span className="genesis-version">{GENESIS_CONFIG.version}</span>
            </h2>

            <p className="genesis-home-tagline">{GENESIS_CONFIG.tagline}</p>

            <div className="genesis-home-meta">
              <div className="home-meta-item">
                <i className="far fa-calendar-alt"></i>
                <span>{GENESIS_CONFIG.date}</span>
              </div>
              <div className="home-meta-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{GENESIS_CONFIG.location}</span>
              </div>
            </div>

            {/* 5 Technical Track Pills */}
            <div className="genesis-home-tracks">
              {GENESIS_CONFIG.tracks.map((track) => (
                <span key={track.id} className="home-track-pill">
                  {track.name}
                </span>
              ))}
            </div>

            {/* Compact Countdown / Deadline Status */}
            <div className="genesis-home-timing">
              {countdown.isOpen ? (
                <div className="home-deadline-open">
                  <i className="fas fa-clock"></i>
                  <span>
                    Registration closes in{" "}
                    <strong>
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="home-deadline-closed">
                  <i className="fas fa-lock"></i>
                  <span>Registration closed on 26 August 2026</span>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div className="genesis-home-actions">
              <Link to={GENESIS_CONFIG.routes.intro} className="genesis-home-cta-btn">
                {countdown.isOpen ? (
                  <>
                    <span>Register for Genesis</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                ) : (
                  <>
                    <span>Genesis Overview</span>
                    <i className="fas fa-info-circle"></i>
                  </>
                )}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
