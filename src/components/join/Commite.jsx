// src/components/join/Commite.jsx
import React from "react";
import { useFormContext } from "react-hook-form";

export default function Commite() {
  const { register } = useFormContext();

  return (
    <section className="step technical-step">
      <h2>Choose Your Cycle</h2>

      <label className="field">
        <span>Select the cycle you want to apply for:</span>
        <div className="radios">
          <label>
            <input
              type="radio"
              value="HR"
              {...register("cycle", { required: "Cycle is required" })}
            />
            HR
          </label>
          <label>
            <input
              type="radio"
              value="Logistics"
              {...register("cycle", { required: "Cycle is required" })}
            />
            Logistics
          </label>
          <label>
            <input
              type="radio"
              value="Media"
              {...register("cycle", { required: "Cycle is required" })}
            />
            Media
          </label>
          <label>
            <input
              type="radio"
              value="VideoEditing"
              {...register("cycle", { required: "Cycle is required" })}
            />
            Video Editing
          </label>
          <label>
            <input
              type="radio"
              value="Marketing"
              {...register("cycle", { required: "Cycle is required" })}
            />
            Marketing
          </label>
          <label>
            <input
              type="radio"
              value="EventManagement"
              {...register("cycle", { required: "Cycle is required" })}
            />
            Event Management
          </label>
          <label>
            <input
              type="radio"
              value="FR"
              {...register("cycle", { required: "Cycle is required" })}
            />
            FR
          </label>
          <label>
            <input
              type="radio"
              value="PR"
              {...register("cycle", { required: "Cycle is required" })}
            />
            PR
          </label>
        </div>
      </label>
    </section>
  );
}
