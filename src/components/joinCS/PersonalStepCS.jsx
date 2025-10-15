import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import personalQuestions from "../../data/personalQuestions.json"; // ممكن نخليها personalQuestionsCS بعدين

export default function PersonalStepCS() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const [dob, setDob] = useState(null);

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
            {...register(q.name)}
            className="cs-input"
          />
        );

      case "radio":
        return (
          <div className="cs-radios">
            {q.options.map((opt) => (
              <label key={opt} className="cs-radio-label">
                <input
                  type="radio"
                  value={opt}
                  {...register(q.name)}
                  className="cs-radio-input"
                />
                <span className="cs-radio-text">{opt}</span>
              </label>
            ))}
          </div>
        );

      case "date":
        return (
          <DatePicker
            selected={dob}
            onChange={(date) => {
              setDob(date);
              setValue(q.name, date, { shouldValidate: true });
            }}
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            className="cs-datepicker-input"
            calendarClassName="cs-datepicker-calendar"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperContainer={({ children }) => <div>{children}</div>}
            popperPlacement="bottom-start"
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="step personal-step cs-theme">
      <h2 className="cs-step-title">Personal Information</h2>
      {personalQuestions.map((q) => (
        <label className="cs-field" key={q.name}>
          <span className="cs-label">{q.label}</span>
          {renderField(q)}
          {errors[q.name] && (
            <small className="cs-error">{errors[q.name]?.message}</small>
          )}
        </label>
      ))}
    </section>
  );
}
