import React from "react";
import "./Region8Section.css";
import region8Data from "../../data/region8-data.json";

const Region8Section = () => (
  <section className="region8-section">
    <div className="region8-top-row">
      <div className="region8-main-text">
        <h2 className="region8-title">{region8Data.title}</h2>
        <p className="region8-description">{region8Data.description}</p>
      </div>

      <div className="region8-img">
        <img src={region8Data.image} alt="Region 8 Map" />
      </div>
    </div>

    <div className="region8-highlights">
      {region8Data.highlights.map((item, i) => (
        <div className="region8-highlight-card" key={i} tabIndex={0}>
          <div className="region8-icon" aria-hidden="true">
            {item.icon}
          </div>
          <strong>{item.title}</strong>
          <span>{item.desc}</span>
        </div>
      ))}
    </div>
    <a
      className="ieee-link"
      href={region8Data.website}
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more from official website{" "}
      <i className="fa fa-external-link-alt"></i>
    </a>
    <div className="region8-egypt">
      <span className="region8-egypt-icon">🇪🇬</span>
      <span className="region8-egypt-text">{region8Data.egyptFact}</span>
    </div>
  </section>
);

export default Region8Section;
