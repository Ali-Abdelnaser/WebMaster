// src/components/joinCS/ReviewSubmitCS.jsx
import React from "react";
import { useFormContext } from "react-hook-form";

export default function ReviewSubmitCS({ onSubmit }) {
  const { getValues, register } = useFormContext();
  const values = getValues();

  return (
    <section className="step review-step">
      <h2>Submit</h2>

      <div style={{ marginTop: 20 }}>
        <label
          htmlFor="userComment"
          style={{ display: "block", marginBottom: 8 }}
          className="cs-label"
        >
          Leave a comment (optional):
        </label>
        <textarea
          className="cs-textarea"
          {...register("userComment")} // اسم الحقل داخل الفورم
          placeholder="Your comments..."
        />
      </div>
    </section>
  );
}
