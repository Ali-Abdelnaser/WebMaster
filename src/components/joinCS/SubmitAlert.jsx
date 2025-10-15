// src/components/join/SubmitAlert.jsx
import React from "react";

export default function SubmitAlert({ isOpen, type = "success", message = "", onClose }) {
  if (!isOpen) return null;

  return (
    <div className={`submit-alert ${type}`}>
      <div className="submit-alert-inner">
        <p>{message}</p>
        <button className="btn secondary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
