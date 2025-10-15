// src/components/joinCS/CommiteCS.jsx
import React from "react";
import { useFormContext } from "react-hook-form";

export default function CommiteCS() {
  const { register } = useFormContext();

  const csCycles = [
    "Frontend",
    "Backend Node.js",
    "Backend .Net",
    "Hardware",
    "AI",
    "UI/UX",
    "Flutter",
    "Cybersecurity",
  ];

  return (
    <section className="step technical-step cs-theme">
      <h2 className="cs-step-title">Choose Your CS Track</h2>

      <label className="cs-field">
        <span className="cs-label">Select the CS track you want to apply for:</span>
        <div className="cs-radios">
          {csCycles.map((cycle) => (
            <label className="cs-radio-label" key={cycle}>
              <input
                type="radio"
                value={cycle}
                className="cs-radio-input"
                {...register("cycle", { required: "Cycle is required" })}
              />
              <span className="cs-radio-text">{cycle}</span>
            </label>
          ))}
        </div>
      </label>
    </section>
  );
}
