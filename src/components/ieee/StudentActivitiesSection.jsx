import React from "react";
import "./StudentActivitiesSection.css";
import data from "../../data/student-activities-data.json";

export default function StudentActivitiesSection() {
  return (
    <section className="student-activities-section">
      <h2 className="student-activities-title">{data.title}</h2>
      <p className="student-activities-desc">{data.description}</p>
      <div className="student-activities-highlights">
        {data.highlights.map((item, i) => (
          <div className="student-activities-card" key={i}>
            <span className="student-activities-icon">{item.icon}</span>
            <div className="student-activities-head">{item.title}</div>
            <div className="student-activities-label">{item.desc}</div>
          </div>
        ))}
      </div>
      <a
        className="ieee-link"
        href="/about"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about IEEE MET Student Branch 
        <i className="fa fa-external-link-alt"></i>
      </a>
    </section>
  );
}
