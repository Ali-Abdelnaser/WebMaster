import React from "react";
import "./OfficersCS.css";

export default function csTwoOfficers() {
  const officers = [
    {
      name: "Mahmoud Hatem",
      role: "Chairman",
      img: "/img/CS/hatem.svg",
      linkedin: "#",
      email: "officer1@email.com",
    },
    {
      name: "Mohamed Sakr",
      role: "Vice Chair",
      img: "/img/CS/sakr.svg",
      linkedin: "#",
      email: "officer2@email.com",
    },
  ];

  return (
    <section className="cs-two-officers">
        <div className="wie-carousel-header">
        <h2 className="cs-title">CS OFFICERS</h2>
        <img src="img/CS/CS-hr.svg" alt="Divider" className="wie-carousel-divider" />
      </div>
      <div className="cs-officers-container">
        {officers.map((officer, index) => (
          <div className="cs-officer-card" key={index}>
            <div className="cs-officer-img">
              <img src={officer.img} alt={officer.name} />
            </div>
            <h3 className="cs-officer-name">{officer.name}</h3>
            <p className="cs-officer-role">{officer.role}</p>
            <div className="cs-officer-socials">
              {officer.linkedin && (
                <a href={officer.linkedin} target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              )}
              {officer.email && officer.email !== "#" && (
                <a href={`mailto:${officer.email}`}>
                  <i className="fas fa-envelope"></i>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
