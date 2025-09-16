import React from "react";
import { useFormContext } from "react-hook-form";
import hrQuestions from "../../data/hrQuestions.json";

export default function HRStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const renderField = (q) => {
    switch (q.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <input
            type={q.type}
            placeholder={q.placeholder}
            {...register(q.name, {
              required: q.required && `${q.label} is required`,
            })}
          />
        );

      case "textarea":
        return (
          <textarea
            rows={4}
            placeholder={q.placeholder}
            {...register(q.name, {
              required: q.required && `${q.label} is required`,
            })}
          />
        );

      case "radio":
        return (
          <div className="radios">
            {q.options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  value={opt}
                  {...register(q.name, {
                    required: q.required && `${q.label} is required`,
                  })}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="step hr-step">
      <h2>General Questions</h2>
      {hrQuestions.map((q) => (
        <label className="field" key={q.name}>
          <span>{q.label}</span>
          {renderField(q)}
          {errors[q.name] && (
            <small className="error">{errors[q.name].message}</small>
          )}
        </label>
      ))}
    </section>
  );
}
