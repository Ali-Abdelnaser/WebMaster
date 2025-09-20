import React from "react";
import "./OfficersCS.css";

export default function csTwoOfficers() {
  const officers = [
    {
      name: "Mahmoud Hatem",
      role: "Chairman",
      img: "/img/CS/hatem.svg",
      linkedin:
        "https://www.linkedin.com/in/mahmoudhatems?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "mahmoudhatemc@gmail.com",
    },
    {
      name: "Mohamed Sakr",
      role: "Vice Chair",
      img: "/img/CS/sakr.svg",
      linkedin:
        "https://www.linkedin.com/in/mohamed-sakr-15b674279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "mo.sakr1400@gmail.com",
    },
  ];

  return (
    <section className="cs-two-officers">
      <div className="wie-carousel-header">
        <h2 className="cs-title">CS OFFICERS</h2>
        <img
          src="img/CS/CS-hr.svg"
          alt="Divider"
          className="wie-carousel-divider"
        />
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
