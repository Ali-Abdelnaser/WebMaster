import React from "react";
import "./OfficersAESS.css";
import aessData from "../../data/aessData.json";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function OfficersAESS() {
  const { officers } = aessData;

  return (
    <section className="aess-personnel-dossier">
      <div className="dossier-header">
        <span style={{ fontFamily: 'Share Tech Mono', color: 'rgba(0, 229, 255, 0.5)', letterSpacing: '2px' }}>PERSONNEL DATABASE</span>
        <h2>FLIGHT CREW</h2>
      </div>
      
      <div className="dossier-grid">
        {officers.map((officer, index) => (
          <div className="personnel-card" key={index}>
            <div className="personnel-status">VERIFIED</div>
            <div className="personnel-img-frame">
              <div className="scan-line"></div>
              <img 
                src={officer.img} 
                alt={officer.name} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
                }}
              />
            </div>

            <div className="personnel-info">
              <span className="personnel-id">ID: MET_AESS_00{index + 1}</span>
              <h3 className="personnel-name">{officer.name}</h3>
              <span className="personnel-role">ROLE: {officer.role}</span>
              
              <div className="personnel-socials">
                {officer.linkedin && officer.linkedin !== "#" && (
                  <a href={officer.linkedin} target="_blank" rel="noreferrer">
                    <FaLinkedin />
                  </a>
                )}
                {officer.email && officer.email !== "#" && (
                  <a href={`mailto:${officer.email}`}>
                    <FaEnvelope />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
