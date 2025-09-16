// components/join/SubmitAlert.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SubmitAlert.css";

export default function SubmitAlert({ isOpen, onClose, type, message }) {
  if (!isOpen) return null;

  const imgSrc =
    type === "success"
      ? "/img/success.svg" // صورة النجاح
      : "/img/error.svg"; // صورة الخطأ

  return (
    <AnimatePresence>
      <motion.div
        className="alert-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`alert-box ${type}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <img src={imgSrc} alt={type} className="alert-image" />
          <h2 className="alert-title">
            {type === "success" ? "Completed 🎉" : "Error ⚠️"}
          </h2>
          <p className="alert-message">{message}</p>
          <button onClick={onClose} className="btn primary">
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
