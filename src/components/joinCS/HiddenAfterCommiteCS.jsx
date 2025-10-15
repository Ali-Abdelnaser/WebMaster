// src/components/joinCS/HiddenAfterCommiteCS.jsx
import React from "react";
import { useFormContext } from "react-hook-form";
import committeeQuestions from "../../data/committeeQuestions_CS.json";

export default function HiddenAfterCommiteCS() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const selectedCycle = watch("cycle");
  if (!selectedCycle) {
    return (
      <section className="step">
        <h2>Cycle Questions</h2>
        <p>Please go back and choose a cycle first.</p>
      </section>
    );
  }

  const questions = committeeQuestions[selectedCycle] || [];

  const renderField = (q) => {
    switch (q.type) {
      case "text":
        return (
          <input
            type="text"
          className="cs-input"
            placeholder={q.placeholder || ""}
            {...register(q.name)}
          />
        );
      case "textarea":
        return (
          <textarea
          className="cs-textarea"
            placeholder={q.placeholder || ""}
            {...register(q.name)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        );
      case "radio":
        return (
          <div className="cs-radios">
            {q.options.map((opt, idx) => (
              <label key={idx} >
                <input
                  type="radio"
                  value={opt}
                  className="cs-radio-input"
                  {...register(q.name)}
                />
                <span className="cs-radio-text"> {opt}</span>
              </label>
            ))}
          </div>
        );
      case "mcq":
        // mcq options are objects { value, label }
        return (
          <div className="cs-radios">
            {q.options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  value={opt.value}
                  className="cs-radio-input"
                  {...register(q.name)}
                />
                <span className="cs-radio-text"> {opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="step">
      <h2>{selectedCycle} Questions</h2>
      {questions.map((q) => (
        <label className="cs-field" key={q.name}>
          <span className="cs-label">{q.label}</span>
          {renderField(q)}
          {errors[q.name] && (
            <small className="error">{errors[q.name].message}</small>
          )}
        </label>
      ))}
    </section>
  );
}
