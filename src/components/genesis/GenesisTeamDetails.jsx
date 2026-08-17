// src/components/genesis/GenesisTeamDetails.jsx
// Step 1 of Genesis Registration: Streamlined, minimal & modern

import React from "react";
import { GENESIS_CONFIG } from "../../config/genesisConfig";

export default function GenesisTeamDetails({
  team = {},
  errors = {},
  onChange,
  onTrackSelect,
  onSizeChange,
  onContinue,
}) {
  const teamSizeOptions = [1, 2, 3, 4, 5];

  const trackIcons = {
    "AI": "fas fa-brain",
    "Cybersecurity": "fas fa-shield-halved",
    "Robotics": "fas fa-robot",
    "Mobile Application": "fas fa-mobile-screen-button",
    "IoT": "fas fa-wifi",
    "Graduation Projects": "fas fa-graduation-cap",
  };

  return (
    <div className="genesis-step-container">
      <div className="step-header">
        <div className="step-kicker">01 // STEP ONE</div>
        <h2 className="step-title">Team Information</h2>
        <p className="step-subtitle">
          Define your team identity, competition track, and team size.
        </p>
      </div>

      <div className="genesis-form-section">
        {/* Row 1: Team Name & Size */}
        <div className="form-two-col">
          <div className="genesis-form-field">
            <label htmlFor="team_name" className="genesis-label">
              Team Name <span className="req">*</span>
            </label>
            <input
              id="team_name"
              type="text"
              className={`genesis-input ${errors.team_name ? "has-error" : ""}`}
              placeholder="e.g. CyberVortex"
              value={team.team_name || ""}
              onChange={(e) => onChange("team_name", e.target.value)}
            />
            {errors.team_name && <span className="genesis-error">{errors.team_name}</span>}
          </div>

          <div className="genesis-form-field">
            <label className="genesis-label">
              Team Size <span className="req">*</span>
              <span className="field-inline-hint">(1 to 5 members)</span>
            </label>
            <div className="team-size-selector">
              {teamSizeOptions.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`size-btn ${team.team_size === size ? "active" : ""}`}
                  onClick={() => onSizeChange(size)}
                >
                  <span className="size-num">{size}</span>
                  <span className="size-lbl">{size === 1 ? "Solo" : "Mems"}</span>
                </button>
              ))}
            </div>
            {errors.team_size && <span className="genesis-error">{errors.team_size}</span>}
          </div>
        </div>

        {/* Technical Track Selection */}
        <div className="genesis-form-field">
          <label className="genesis-label">
            Competition Track <span className="req">*</span>
          </label>

          <div className="genesis-tracks-select-grid">
            {GENESIS_CONFIG.tracks.map((track) => {
              const isSelected = team.track === track.name;
              return (
                <button
                  type="button"
                  key={track.id}
                  className={`track-select-card ${isSelected ? "selected" : ""}`}
                  onClick={() => onTrackSelect(track.name)}
                >
                  <div className="track-select-icon">
                    <i className={trackIcons[track.name] || `fas ${track.icon}`}></i>
                  </div>
                  <div className="track-select-info">
                    <span className="track-select-name">{track.name}</span>
                  </div>
                  {isSelected && <i className="fas fa-check-circle selected-check"></i>}
                </button>
              );
            })}
          </div>
          {errors.track && <span className="genesis-error">{errors.track}</span>}
        </div>

        {/* Project Idea / Description */}
        <div className="genesis-form-field">
          <label htmlFor="project_idea" className="genesis-label">
            Project Description <span className="req">*</span>
          </label>
          <textarea
            id="project_idea"
            rows="3"
            className={`genesis-textarea ${errors.project_idea ? "has-error" : ""}`}
            placeholder="Briefly describe what your team plans to build and the problem solved..."
            value={team.project_idea || ""}
            onChange={(e) => onChange("project_idea", e.target.value)}
          />
          {errors.project_idea && (
            <span className="genesis-error">{errors.project_idea}</span>
          )}
        </div>

        {/* Demo Video URL (Optional) */}
        <div className="genesis-form-field">
          <label htmlFor="demo_video_url" className="genesis-label">
            Demo Video Link <span className="opt">(Optional)</span>
          </label>
          <input
            id="demo_video_url"
            type="url"
            className={`genesis-input ${errors.demo_video_url ? "has-error" : ""}`}
            placeholder="https://youtube.com/watch?v=... or Google Drive link"
            value={team.demo_video_url || ""}
            onChange={(e) => onChange("demo_video_url", e.target.value)}
          />
          {errors.demo_video_url && (
            <span className="genesis-error">{errors.demo_video_url}</span>
          )}
        </div>

        {/* Navigation Button */}
        <div className="step-actions">
          <button type="button" className="genesis-action-btn primary" onClick={onContinue}>
            <span>Continue to Team Members</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
