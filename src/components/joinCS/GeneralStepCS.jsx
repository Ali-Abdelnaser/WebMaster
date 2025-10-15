// src/components/joinCS/GeneralStepCS.jsx
import React from "react";
import { useFormContext } from "react-hook-form";

export default function GeneralStepCS() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const generalQuestions = [
    {
      name: "csJourney",
      label: "How did your journey with programming or CS start?",
      type: "textarea",
      placeholder:
        "Tell us how you got into tech — a story, a course, or just curiosity?",
      required: true,
    },
    {
      name: "learningStyle",
      label:
        "When you face a new topic or problem, how do you usually learn or solve it?",
      type: "textarea",
      placeholder:
        "Do you watch tutorials, read docs, experiment, or ask others?",
      required: true,
    },
    {
      name: "techStack",
      label:
        "What programming languages or technologies are you most comfortable with?",
      type: "textarea",
      placeholder:
        "E.g., JavaScript, Python, React, Node, or anything else you like working with...",
      required: true,
    },
    {
      name: "projectIdea",
      label: "If you could build any project right now, what would it be — and why?",
      type: "textarea",
      placeholder:
        "Describe an idea that excites you or something you wish existed!",
      required: true,
    },
    {
      name: "teamExperience",
      label: "Have you ever worked on a team project before? What did you learn from it?",
      type: "textarea",
      placeholder: "It could be a hackathon, a uni project, or something personal...",
      required: true,
    },
    {
      name: "challengeApproach",
      label: "When your code doesn’t work, what’s the first thing you do?",
      type: "textarea",
      placeholder: "Walk us through your debugging mindset.",
      required: true,
    },
  ];

  const renderField = (q) => {
    const validation = q.required
      ? { required: `${q.label} is required.` }
      : {};

    if (q.type === "text") {
      return (
        <input
          type="text"
          placeholder={q.placeholder}
          {...register(q.name)}
          className="cs-input"
        />
      );
    }

    if (q.type === "textarea") {
      return (
        <textarea
          placeholder={q.placeholder || ""}
          {...register(q.name)}
          className="cs-textarea"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      );
    }

    return null;
  };

  return (
    <section className="step general-step cs-theme">
      <h2 className="cs-step-title">General Questions</h2>

      {generalQuestions.map((q) => (
        <label className="cs-field" key={q.name}>
          <span className="cs-label">{q.label}</span>
          {renderField(q)}
          {errors[q.name] && (
            <small className="cs-error">{errors[q.name].message}</small>
          )}
        </label>
      ))}
    </section>
  );
}
