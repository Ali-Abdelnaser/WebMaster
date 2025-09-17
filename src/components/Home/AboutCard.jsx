import React, { useState } from "react";

function AboutCard({ icon, title, text }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={`about-card ${hovered ? "hovered" : ""}`}
      style={{ "--x": `${coords.x}px`, "--y": `${coords.y}px` }}
      onMouseEnter={(e) => {
        handleMouseMove(e);
        setHovered(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(false)} >
      <span className="icon">{icon}</span>
      <h5>{title}</h5>
      <p>{text}</p>
    </div>
  );
}

export default AboutCard;
