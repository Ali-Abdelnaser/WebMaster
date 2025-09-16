// src/components/join/ProgressBar.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ steps, currentIndex, totalSteps }) {
  const percent = Math.round(((currentIndex + 1) / totalSteps) * 100);

  return (
    <div className="progress-wrap">
      <div className="step-names">
        {steps.map((s, i) => (
          <div key={s} className={`step-name ${i <= currentIndex ? "active" : ""}`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bar">
        <motion.div
          className="bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="percent">{percent}%</div>
    </div>
  );
}

