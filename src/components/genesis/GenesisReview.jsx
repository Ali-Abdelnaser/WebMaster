// src/components/genesis/GenesisReview.jsx
// Step 3 of Genesis Registration: Clean, streamlined review & submission

import React from "react";
import { maskNationalId } from "../../utils/genesisValidation";

export default function GenesisReview({
  team = {},
  members = [],
  teamSize = 1,
  onBack,
  onSubmit,
  submitting = false,
  uploadProgressText = "",
  submitError = "",
}) {
  const activeMembers = members.slice(0, teamSize);

  return (
    <div className="genesis-step-container">
      <div className="step-header">
        <div className="step-kicker">03 // FINAL STEP</div>
        <h2 className="step-title">Review & Submit</h2>
        <p className="step-subtitle">
          Please confirm your team registration details before submitting.
        </p>
      </div>

      <div className="review-container">
        {/* Error Alert if any */}
        {submitError && (
          <div className="review-error-banner">
            <i className="fas fa-triangle-exclamation"></i>
            <div>
              <strong>Submission Error</strong>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* Team Summary Panel */}
        <div className="review-panel">
          <div className="review-panel-header">
            <div className="panel-title-group">
              <i className="fas fa-users-gear"></i>
              <span>Team Overview</span>
            </div>
            <span className="review-track-pill">{team.track}</span>
          </div>

          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Team Name</span>
              <span className="review-value highlight">{team.team_name}</span>
            </div>

            <div className="review-item">
              <span className="review-label">Team Size</span>
              <span className="review-value">
                {teamSize} {teamSize === 1 ? "Member (Solo)" : "Members"}
              </span>
            </div>

            {team.demo_video_url && (
              <div className="review-item full-width">
                <span className="review-label">Project Explanation Video</span>
                <span className="review-value link-value">
                  <a href={team.demo_video_url} target="_blank" rel="noreferrer">
                    <span>View Video</span> <i className="fas fa-arrow-up-right-from-square"></i>
                  </a>
                </span>
              </div>
            )}

            <div className="review-item full-width">
              <span className="review-label">Project Description</span>
              <p className="review-desc-text">{team.project_idea}</p>
            </div>
          </div>
        </div>

        {/* Team Members Summary */}
        <div className="review-panel">
          <div className="review-panel-header">
            <div className="panel-title-group">
              <i className="fas fa-users"></i>
              <span>Team Members ({teamSize})</span>
            </div>
          </div>

          <div className="review-members-list">
            {activeMembers.map((member, index) => {
              const isLeader = index === 0;
              return (
                <div
                  key={index}
                  className={`review-member-item ${isLeader ? "is-leader" : ""}`}
                >
                  <div className="member-item-top">
                    <div className="member-item-identity">
                      <span className="member-order-chip">#{index + 1}</span>
                      <h4 className="member-name">{member.full_name || "N/A"}</h4>
                      {isLeader && <span className="leader-pill">Leader</span>}
                    </div>

                    <span className="masked-id" title="National ID (Masked for privacy)">
                      <i className="fas fa-shield-halved"></i> {maskNationalId(member.national_id)}
                    </span>
                  </div>

                  <div className="member-item-details-grid">
                    <div>
                      <span className="detail-lbl">Email:</span>
                      <span className="detail-val">{member.email || "N/A"}</span>
                    </div>

                    <div>
                      <span className="detail-lbl">Phone:</span>
                      <span className="detail-val">{member.phone || "N/A"}</span>
                    </div>

                    <div>
                      <span className="detail-lbl">University:</span>
                      <span className="detail-val">{member.university || "N/A"}</span>
                    </div>

                    <div>
                      <span className="detail-lbl">Faculty & Year:</span>
                      <span className="detail-val">
                        {member.faculty || "N/A"} ({member.academic_year || "N/A"})
                      </span>
                    </div>

                    <div className="full-col">
                      <span className="detail-lbl">Discord:</span>
                      <span className="detail-val">{member.discord_link || "N/A"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation / Submit Action Bar */}
        <div className="step-actions dual">
          <button
            type="button"
            className="genesis-action-btn secondary"
            onClick={onBack}
            disabled={submitting}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Members</span>
          </button>

          <button
            type="button"
            className="genesis-action-btn primary submit-btn"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <span className="submit-spinner-wrapper">
                <span className="submit-spinner"></span>
                <span>{uploadProgressText || "Processing Registration..."}</span>
              </span>
            ) : (
              <>
                <span>Submit Genesis Registration</span>
                <i className="fas fa-paper-plane"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
