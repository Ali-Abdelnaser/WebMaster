// src/components/joinCS/ProgressBarCS.jsx
import React from "react";

export default function ProgressBarCS({ steps = [], currentIndex = 0, totalSteps = 5 }) {
  // `steps` are the visible steps; currentIndex is index within visible steps
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="progressbar">
      <div className="progressbar-steps">
        {steps.map((s, i) => (
          <div key={s} className={`step-item ${i <= currentIndex ? "active" : ""}`}>
            <div className="step-number">{i + 1}</div>
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>
      <div className="progressbar-track">
        <div className="progressbar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
