import React from "react";
import "./SacEgyptSection.css";
import data from "../../data/sac-egypt-section-data.json";

export default function SacEgyptSection() {
  return (
    <section className="sac-egypt-section">
      <h2 className="sac-title">{data.title}</h2>
      <div className="sac-hero-row">
        <div className="sac-description">{data.description}</div>
        <div className="sac-logo-box">
          <img src={data.logo} alt="SAC Egypt Logo" className="sac-logo" />
        </div>
      </div>
      <div className="sac-stats-row">
        {data.stats.map((stat, i) => (
          <div className="sac-stat-card" key={i}>
            <div className="sac-stat-value">{stat.value}</div>
            <div className="sac-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="sac-programs-row">
        {data.programs.map((prog, i) => (
          <a href={prog.link} className="sac-program-card" key={i} target="_blank" rel="noopener noreferrer">
            {prog.name}
          </a>
        ))}
      </div>
      <a
        className="sac-egypt-cta"
        href={data.cta.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {data.cta.label}
      </a>
    </section>
  );
}
