// src/components/join/CycleQuestionsStep.jsx
import React from "react";
import { useFormContext } from "react-hook-form";
import cycleQuestions from "../../data/cycleQuestions.json";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function CycleQuestionsStep() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const selectedCycle = watch("cycle");

  if (!selectedCycle) {
    return (
      <section className="step">
        <h2>Cycle Questions</h2>
        <p>Please go back and choose a cycle first.</p>
      </section>
    );
  }

  const questions = cycleQuestions[selectedCycle] || [];

  const renderField = (q) => {
    switch (q.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={q.placeholder || ""}
            {...register(q.name, {
              required: q.required && `${q.label} is required`,
            })}
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={q.placeholder || ""}
            {...register(q.name, {
              required: q.required && `${q.label} is required`,
            })}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        );
      case "slider":
        return (
          <div className="slider-question">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              {q.images?.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="slider-frame">
                    <img src={img} alt={`slide-${i}`} className="slider-img" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <textarea
              className="styled-textarea"
              placeholder="Write your caption here..."
              {...register(q.name, {
                required: q.required && `${q.label} is required`,
              })}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="step">
      <h2>{selectedCycle} Questions</h2>
      {questions.map((q) => (
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
