import React from "react";
import aboutData from "../../data/csData.json";
import "./AboutCS.css";

export default function AboutCS() {
  const { title, description } = aboutData.about;

  return (
    <section className="cs-about">
      <div className="cs-about-container">
        <h2 className="cs-about-title">{title}</h2>
        <span className="cs-about-underline"></span>
        <div className="cs-about-text">
          {description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
