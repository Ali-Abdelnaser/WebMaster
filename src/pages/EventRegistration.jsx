// src/pages/EventRegistration.jsx
// IEEE Quest Career 1.0 — Registration Form Page
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
import { supabase } from "../config/supabase";

import "../styles/EventRegistration.css";

// ─── Validation helpers ─────────────────────────────────────────
const validators = {
  name_en: (v) => (!v?.trim() ? "English name is required" : ""),
  name_ar: (v) => (!v?.trim() ? "Arabic name is required" : ""),
  national_id: (v) => {
    if (!v?.trim()) return "National ID is required";
    if (!/^\d{14}$/.test(v.trim())) return "National ID must be exactly 14 digits";
    return "";
  },
  email: (v) => {
    if (!v?.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Invalid email format";
    return "";
  },
  phone: (v) => {
    if (!v?.trim()) return "Phone is required";
    if (!/^\d{11}$/.test(v.trim())) return "Phone must be exactly 11 digits";
    return "";
  },
  gender: (v) => (!v ? "Gender is required" : ""),
  college: (v) => (!v ? "College is required" : ""),
  college_other: (v, form) =>
    form.college === "Other" && !v?.trim() ? "Please specify your college" : "",
  university: (v) => (!v ? "University is required" : ""),
  university_other: (v, form) =>
    form.university === "Other" && !v?.trim() ? "Please specify your university" : "",
  academic_year: (v) => (!v ? "Academic year is required" : ""),
};

// Initial form state
const initialForm = {
  name_en: "",
  name_ar: "",
  national_id: "",
  email: "",
  phone: "",
  gender: "",
  college: "",
  college_other: "",
  university: "",
  university_other: "",
  academic_year: "",
};

// ─── Main Component ─────────────────────────────────────────────
export default function EventRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  // Handle field change
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate entire form
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const msg = validators[field](form[field], form);
      if (msg) newErrors[field] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);

    try {
      // Prepare final college & university values
      const finalCollege = form.college === "Other" ? form.college_other.trim() : form.college;
      const finalUniversity = form.university === "Other" ? form.university_other.trim() : form.university;

      // 1) Check for duplicates
      const { data: existing, error: checkError } = await supabase
        .from("event_registrations")
        .select("id")
        .or(`email.eq.${form.email.trim()},phone.eq.${form.phone.trim()},national_id.eq.${form.national_id.trim()}`)
        .limit(1);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        // Duplicate found
        setPopup({
          show: true,
          type: "duplicate",
          message: "You have already registered before ❌",
        });
        setSubmitting(false);
        return;
      }

      // 2) Insert new registration
      const { error: insertError } = await supabase
        .from("event_registrations")
        .insert([
          {
            name_en: form.name_en.trim(),
            name_ar: form.name_ar.trim(),
            national_id: form.national_id.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            gender: form.gender,
            college: finalCollege,
            university: finalUniversity,
            academic_year: form.academic_year,
          },
        ]);

      if (insertError) {
        // Handle unique constraint violations
        if (insertError.code === "23505") {
          setPopup({
            show: true,
            type: "duplicate",
            message: "You have already registered before ❌",
          });
        } else {
          throw insertError;
        }
        setSubmitting(false);
        return;
      }

      // 3) Success!
      setPopup({
        show: true,
        type: "success",
        message: "Registration successful ✅",
      });

      // Redirect to home after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setPopup({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Close popup
  const closePopup = () => {
    setPopup({ show: false, type: "", message: "" });
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="event-reg-page">
      <Helmet>
        <title>Register | IEEE Quest Career 1.0</title>
        <meta
          name="description"
          content="Register for IEEE Quest Career 1.0 — your journey to becoming a prepared, confident professional."
        />
      </Helmet>

      <Header />
      <AnimatedBackground />

      <main className="event-reg-main">
        <motion.div
          className="event-reg-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header Section */}
          <div className="event-reg-header">
            <div className="event-reg-badge">Registration</div>
            <h1 className="event-reg-title">IEEE Quest Career 1.0</h1>
            <p className="event-reg-subtitle">
              The Gates Are Open, Your Quest Begins Here 🏰✨
            </p>
          </div>

          {/* Form */}
          <form className="event-reg-form" onSubmit={handleSubmit} noValidate>
            {/* Name (English) */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="name_en">
                Name (English) <span className="req">*</span>
              </label>
              <input
                id="name_en"
                type="text"
                className={`reg-input ${errors.name_en ? "has-error" : ""}`}
                placeholder="Enter your full name in English"
                value={form.name_en}
                onChange={(e) => handleChange("name_en", e.target.value)}
              />
              {errors.name_en && <span className="reg-error">{errors.name_en}</span>}
            </div>

            {/* Name (Arabic) */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="name_ar">
                Name (Arabic) <span className="req">*</span>
              </label>
              <input
                id="name_ar"
                type="text"
                className={`reg-input ${errors.name_ar ? "has-error" : ""}`}
                placeholder="أدخل اسمك بالكامل بالعربية"
                dir="rtl"
                value={form.name_ar}
                onChange={(e) => handleChange("name_ar", e.target.value)}
              />
              {errors.name_ar && <span className="reg-error">{errors.name_ar}</span>}
            </div>

            {/* National ID */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="national_id">
                National ID <span className="req">*</span>
              </label>
              <input
                id="national_id"
                type="text"
                inputMode="numeric"
                className={`reg-input ${errors.national_id ? "has-error" : ""}`}
                placeholder="14-digit National ID"
                maxLength={14}
                value={form.national_id}
                onChange={(e) =>
                  handleChange("national_id", e.target.value.replace(/\D/g, ""))
                }
              />
              {errors.national_id && <span className="reg-error">{errors.national_id}</span>}
            </div>

            {/* Email */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="email">
                Email <span className="req">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`reg-input ${errors.email ? "has-error" : ""}`}
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <span className="reg-error">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="phone">
                Phone <span className="req">*</span>
              </label>
              <input
                id="phone"
                type="text"
                inputMode="numeric"
                className={`reg-input ${errors.phone ? "has-error" : ""}`}
                placeholder="11-digit phone number"
                maxLength={11}
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/\D/g, ""))
                }
              />
              {errors.phone && <span className="reg-error">{errors.phone}</span>}
            </div>

            {/* Gender */}
            <div className="reg-field">
              <label className="reg-label">
                Gender <span className="req">*</span>
              </label>
              <div className="reg-radio-group">
                <label className={`reg-radio-option ${form.gender === "Male" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                  <span className="radio-checkmark"></span>
                  Male
                </label>
                <label className={`reg-radio-option ${form.gender === "Female" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                  <span className="radio-checkmark"></span>
                  Female
                </label>
              </div>
              {errors.gender && <span className="reg-error">{errors.gender}</span>}
            </div>

            {/* College */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="college">
                College <span className="req">*</span>
              </label>
              <select
                id="college"
                className={`reg-select ${errors.college ? "has-error" : ""}`}
                value={form.college}
                onChange={(e) => handleChange("college", e.target.value)}
              >
                <option value="">Select your college</option>
                <option value="CS">CS</option>
                <option value="Engineering">Engineering</option>
                <option value="BIS">BIS</option>
                <option value="Other">Other</option>
              </select>
              {form.college === "Other" && (
                <input
                  type="text"
                  className={`reg-input reg-other-input ${errors.college_other ? "has-error" : ""}`}
                  placeholder="Specify your college"
                  value={form.college_other}
                  onChange={(e) => handleChange("college_other", e.target.value)}
                />
              )}
              {errors.college && <span className="reg-error">{errors.college}</span>}
              {errors.college_other && <span className="reg-error">{errors.college_other}</span>}
            </div>

            {/* University */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="university">
                University <span className="req">*</span>
              </label>
              <select
                id="university"
                className={`reg-select ${errors.university ? "has-error" : ""}`}
                value={form.university}
                onChange={(e) => handleChange("university", e.target.value)}
              >
                <option value="">Select your university</option>
                <option value="MET">MET</option>
                <option value="Mansoura">Mansoura</option>
                <option value="Delta">Delta</option>
                <option value="Other">Other</option>
              </select>
              {form.university === "Other" && (
                <input
                  type="text"
                  className={`reg-input reg-other-input ${errors.university_other ? "has-error" : ""}`}
                  placeholder="Specify your university"
                  value={form.university_other}
                  onChange={(e) => handleChange("university_other", e.target.value)}
                />
              )}
              {errors.university && <span className="reg-error">{errors.university}</span>}
              {errors.university_other && (
                <span className="reg-error">{errors.university_other}</span>
              )}
            </div>

            {/* Academic Year */}
            <div className="reg-field">
              <label className="reg-label" htmlFor="academic_year">
                Academic Year <span className="req">*</span>
              </label>
              <select
                id="academic_year"
                className={`reg-select ${errors.academic_year ? "has-error" : ""}`}
                value={form.academic_year}
                onChange={(e) => handleChange("academic_year", e.target.value)}
              >
                <option value="">Select your academic year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
              {errors.academic_year && (
                <span className="reg-error">{errors.academic_year}</span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="reg-submit-btn"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                <span className="reg-spinner-wrapper">
                  <span className="reg-spinner"></span>
                  Submitting...
                </span>
              ) : (
                "Register Now 🚀"
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>

      <Footer />

      {/* ─── Popup Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            className="reg-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={popup.type !== "success" ? closePopup : undefined}
          >
            <motion.div
              className={`reg-popup-box reg-popup-${popup.type}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated icon */}
              <div className="reg-popup-icon">
                {popup.type === "success" ? (
                  <svg viewBox="0 0 52 52" className="reg-checkmark">
                    <circle cx="26" cy="26" r="25" fill="none" />
                    <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                ) : popup.type === "duplicate" ? (
                  <svg viewBox="0 0 52 52" className="reg-crossmark">
                    <circle cx="26" cy="26" r="25" fill="none" />
                    <path fill="none" d="M16 16 36 36" />
                    <path fill="none" d="M36 16 16 36" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 52 52" className="reg-crossmark">
                    <circle cx="26" cy="26" r="25" fill="none" />
                    <path fill="none" d="M16 16 36 36" />
                    <path fill="none" d="M36 16 16 36" />
                  </svg>
                )}
              </div>

              <h2 className="reg-popup-title">
                {popup.type === "success"
                  ? "Welcome Aboard! 🎉"
                  : popup.type === "duplicate"
                  ? "Already Registered"
                  : "Oops!"}
              </h2>
              <p className="reg-popup-message">{popup.message}</p>

              {popup.type !== "success" && (
                <button className="reg-popup-btn" onClick={closePopup}>
                  Got it
                </button>
              )}
              {popup.type === "success" && (
                <p className="reg-popup-redirect">Redirecting to home...</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
