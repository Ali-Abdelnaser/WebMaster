// ExecutiveOfficers.jsx
import React from "react";
import "./ExecutiveOfficers.css";

const officers = [
  {
    name: "Amr Mohamed",
    role: "Vice Chair",
    img: "img/officers/amr.png",
    linkedin: "https://www.linkedin.com/in/amr-mohamed-0620b6336/",
    email: "#",
    extraClass: "vice",
  },
  {
    name: "Mahmoud Amer",
    role: "Chairman",
    img: "img/officers/amer.png",
    linkedin: "https://www.linkedin.com/in/mahmoud-amer-5070ab296/",
    email: "mahmoudassy279@gmail.com",
    extraClass: "chair",
  },
  {
    name: "Mai Salah",
    role: "Secretary",
    img: "img/officers/mai.png",
    linkedin: "https://www.linkedin.com/in/mai-salah-5945b8322/",
    email: "maisalah24320005@gmail.com",
    extraClass: "secretary",
  },
  {
    name: "Shahd Elhoseny",
    role: "Treasurer",
    img: "img/officers/shahd.png",
    linkedin: "https://www.linkedin.com/in/shahd-elhosiny-4672a72a6/",
    email: "shahdelhosiny21@gmail.com",
    extraClass: "treasurer",
  },
  {
    name: "Ali Abdelnaser",
    role: "Webmaster",
    img: "img/officers/ali.png",
    linkedin: "https://www.linkedin.com/in/ali-abdelnaser-947230295/",
    email: "alinaserhema60@gmail.com",
    extraClass: "webmaster",
  },
];

function ExecutiveOfficers() {
  return (
    <section id="executive-officers" style={{ backgroundColor: "#fff", padding: "60px 20px" }}>
      <div className="container">
        <h2 className="section-titlee">Executive Officers</h2>
        <div className="officers-grid">
          {officers.map((officer, index) => (
            <div
              key={index}
              className={`officer-card ${officer.extraClass ? officer.extraClass : ""}`}
            >
                <div className="officer-img-wrapper" >
              <img src={officer.img} alt={`${officer.name} - ${officer.role}`} className="officer-img" />
                    
                    </div>                
              <h3>{officer.name}</h3>
              <p>{officer.role}</p>
              <div className="links">
                <a href={officer.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href={`mailto:${officer.email}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExecutiveOfficers;
