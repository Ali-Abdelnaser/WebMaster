import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import personalQuestions from "../../data/personalQuestions.json";

export default function PersonalStep() {
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
            {...register(q.name)} // ❌ شيل rules، الرسائل بتيجي من Yup
          />
        );

      case "radio":
        return (
          <div className="radios">
            {q.options.map((opt) => (
              <label key={opt}>
                <input type="radio" value={opt} {...register(q.name)} />
                {opt}
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
            className="custom-datepicker-input"
            calendarClassName="custom-datepicker-cal"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperContainer={({ children }) => <div>{children}</div>} // ⬅️ الحل
            popperPlacement="bottom-start"
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="step personal-step">
      <h2>Personal Information</h2>
      {personalQuestions.map((q) => (
        <label className="field" key={q.name}>
          <span>{q.label}</span>
          {renderField(q)}
          {errors[q.name] && (
            <small className="error">{errors[q.name]?.message}</small>
          )}
        </label>
      ))}
    </section>
  );
}
