import React from "react";
import "./BestMembers.css";
// استيراد البيانات مباشرة
import members from "../../data/bestMembers.json";

const BestMembers = () => {
  return (
    <section className="best-members-section section-with-bg">
      <div className="section-header">
        <h2 className="best-members-title">BEST MEMBERS</h2>
        <img src="img/hr.svg" alt="Divider" className="HR-divider" />
      </div>
      <div className="members-grid">
        {members.map((member, index) => (
          <div className="best-card" key={index}>
            <div className="image-wrapper">
              <img src={member.img} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.team}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestMembers;
