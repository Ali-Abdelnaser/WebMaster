// src/components/join/ReviewSubmit.jsx
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ReviewSubmit({ onSubmit }) {
  const { getValues, register } = useFormContext();
  const data = getValues();
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <section className="step review-step">
      <h2>  </h2>
      {/* Comment textarea */}
      <label className="field">
        <span>Leave a comment (optional):</span>
        <textarea
          placeholder="Your comments..."
          {...register("comments")}
          value={comment}
          onChange={handleCommentChange}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      </label>

    </section>
  );
}
