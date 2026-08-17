// src/components/genesis/GenesisMembersSection.jsx
// Step 2 of Genesis Registration: Collapsible Accordion Member Cards

import React, { useState, useEffect } from "react";
import GenesisMemberCard from "./GenesisMemberCard";

export default function GenesisMembersSection({
  members = [],
  teamSize = 1,
  memberErrors = [],
  onMemberChange,
  onBack,
  onContinue,
}) {
  // Store expanded state for each member card. Default member 0 (Leader) open.
  const [expandedIndices, setExpandedIndices] = useState(() => ({ 0: true }));

  // Auto-expand any member with validation errors
  useEffect(() => {
    if (memberErrors && memberErrors.length > 0) {
      const errorIndices = {};
      memberErrors.forEach((err, idx) => {
        if (err && Object.keys(err).length > 0) {
          errorIndices[idx] = true;
        }
      });
      if (Object.keys(errorIndices).length > 0) {
        setExpandedIndices((prev) => ({ ...prev, ...errorIndices }));
      }
    }
  }, [memberErrors]);

  const handleToggle = (index) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNextMember = (currentIndex) => {
    // Collapse current member and expand next member
    setExpandedIndices((prev) => ({
      ...prev,
      [currentIndex]: false,
      [currentIndex + 1]: true,
    }));
  };

  return (
    <div className="genesis-step-container">
      <div className="step-header">
        <div className="step-kicker">02 // STEP TWO</div>
        <h2 className="step-title">Team Members Details</h2>
        <p className="step-subtitle">
          Fill in details for all {teamSize} {teamSize === 1 ? "member (Leader)" : "members"}. You can collapse completed members to stay organized.
        </p>
      </div>

      <div className="members-cards-container">
        {Array.from({ length: teamSize }).map((_, index) => {
          const isExpanded = !!expandedIndices[index];
          return (
            <GenesisMemberCard
              key={index}
              index={index}
              teamSize={teamSize}
              member={members[index] || {}}
              errors={memberErrors[index] || {}}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(index)}
              onNext={() => handleNextMember(index)}
              onChange={onMemberChange}
            />
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="step-actions dual">
        <button type="button" className="genesis-action-btn secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Team Details</span>
        </button>

        <button type="button" className="genesis-action-btn primary" onClick={onContinue}>
          <span>Review & Submit</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
