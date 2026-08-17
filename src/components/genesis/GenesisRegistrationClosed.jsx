// src/components/genesis/GenesisRegistrationClosed.jsx
// Closed state screen when registration deadline has elapsed

import React from "react";
import { Link } from "react-router-dom";
import { GENESIS_CONFIG } from "../../config/genesisConfig";

export default function GenesisRegistrationClosed() {
  return (
    <div className="genesis-closed-container">
      <div className="genesis-closed-card">
        <div className="closed-icon-badge">
          <i className="fas fa-lock"></i>
        </div>

        <span className="closed-kicker">Genesis Version 1</span>
        <h1 className="closed-title">Registration Closed</h1>
        <p className="closed-subtitle">
          Genesis registration closed on <strong>26 August 2026</strong>.
        </p>

        <div className="closed-notice-box">
          <p>
            The competition takes place on <strong>16 September 2026</strong> at <strong>MET</strong>.
          </p>
          <p>
            Thank you to all participating teams who registered! If your team is registered,
            please make sure to consult the Rule Book for submission details.
          </p>
        </div>

        <div className="closed-actions">
          <Link to="/events" className="genesis-action-btn primary">
            <i className="fas fa-calendar-alt"></i> Back to Events
          </Link>

          <Link to="/genesis" className="genesis-action-btn secondary">
            <i className="fas fa-info-circle"></i> Genesis Overview
          </Link>

          <a
            href={GENESIS_CONFIG.ruleBookUrl}
            target="_blank"
            rel="noreferrer"
            className="genesis-action-btn secondary"
          >
            <i className="fas fa-book-open"></i> View Rule Book
          </a>
        </div>
      </div>
    </div>
  );
}
