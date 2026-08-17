// src/components/genesis/GenesisRegistrationSuccess.jsx
// Futuristic 3D Cyber Hologram Success Pass for Genesis Registration

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GENESIS_CONFIG } from "../../config/genesisConfig";
import "./GenesisRegistrationSuccess.css";

export default function GenesisRegistrationSuccess({ result = {}, onReset }) {
  const [copied, setCopied] = useState(false);

  const referenceCode =
    result.reference_number ||
    (result.registration_id ? `GEN-${result.registration_id.slice(0, 8).toUpperCase()}` : "GEN-CONFIRMED");

  const handleCopyReference = () => {
    if (referenceCode) {
      navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="genesis-success-wrapper">
      {/* Ambient Radial Cyber Glow */}
      <div className="success-ambient-glow" />

      <motion.div
        className="genesis-success-card-elite"
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated 3D Success Hologram Seal */}
        <div className="success-hologram-seal">
          <div className="hologram-ring-outer" />
          <div className="hologram-ring-inner" />
          <div className="hologram-core-icon">
            <svg
              className="success-svg-animated"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle cx="26" cy="26" r="25" fill="none" />
              <path
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                strokeWidth="3.5"
                stroke="#10b981"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Status Pill & Header */}
        <div className="success-verified-tag">
          <span className="pulse-dot" />
          <span>OFFICIALLY REGISTERED & SECURED</span>
        </div>

        <h1 className="success-headline">Registration Complete</h1>
        <p className="success-lead-text">
          Congratulations! Your Genesis team <strong>{result.team_name || "Squad"}</strong> has been confirmed. Welcome to Genesis V1.0.
        </p>

       
       

        {/* ─── Next Steps Roadmap ────────────────────────────────── */}
        <div className="success-roadmap-panel">
          <div className="roadmap-header">
            <i className="fas fa-route"></i>
            <span>Next Milestones For Your Team</span>
          </div>

          <div className="roadmap-steps-list">
            <div className="roadmap-step-item">
              <div className="step-num-bubble">01</div>
              <div className="step-content-box">
                <h5>Download & Study the Rule Book</h5>
                <p>Understand the judging rubric, project deliverables, and technical criteria for your track.</p>
              </div>
            </div>

            <div className="roadmap-step-item">
              <div className="step-num-bubble">02</div>
              <div className="step-content-box">
                <h5>Check Registered Email & Discord</h5>
                <p>Official announcements, briefing schedules, and mentor channel links will be broadcast shortly.</p>
              </div>
            </div>

            <div className="roadmap-step-item">
              <div className="step-num-bubble">03</div>
              <div className="step-content-box">
                <h5>Build Phase & Mentorship</h5>
                <p>Start engineering your solution and connect with IEEE mentors during the hackathon lifecycle.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Action Cluster ────────────────────────────────────── */}
        <div className="success-action-cluster"> 
          <Link to="/events" className="success-btn secondary">
            <i className="fas fa-calendar-days"></i>
            <span>All Events</span>
          </Link>
          <a
            href={GENESIS_CONFIG.ruleBookUrl}
            target="_blank"
            rel="noreferrer"
            className="success-btn primary"
          >
            <i className="fas fa-book-open"></i>
            <span>View Rule Book</span>
          </a>

         

          
        </div>
      </motion.div>
    </div>
  );
}
