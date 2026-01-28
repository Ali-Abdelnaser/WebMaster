import React, { useEffect, useState } from "react";
import "./HeroAESS.css";
import { motion } from "framer-motion";
// Import Main Logo as fallback for AESS
// import aessLogo from "../../../public/img/logo-1.png"; // Removed for JSON usage
import aessData from "../../data/aessData.json";

const HeroAESS = () => {
  const { hero } = aessData;
  const [altitude, setAltitude] = useState(35000);

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.aess-about-epic');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="aess-hero-hud">
      {/* Background Layers */}
      {/* Stars moved to global background */}
      <div className="hud-grid"></div>

      {/* Corners */}
      <div className="hud-corner corner-tl"></div>
      <div className="hud-corner corner-tr"></div>
      <div className="hud-corner corner-bl"></div>
      <div className="hud-corner corner-br"></div>

      {/* Animated HUD Rings */}
      <div className="hud-target-circle">
         
        <motion.div 
          className="hud-target-inner"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <div className="hud-crosshair"></div>
      </div>

      {/* Side HUD Info */}
      <div className="hud-side-panel panel-left">
        <div className="hud-stat">
          <span className="stat-label">ALTITUDE</span>
          <span className="stat-value">{altitude} FT</span>
        </div>
        <div className="hud-stat">
          <span className="stat-label">VELOCITY</span>
          <span className="stat-value">MACH 2.4</span>
        </div>
        <div className="hud-stat">
          <span className="stat-label">SATELLITE LOCK</span>
          <span className="stat-value" style={{ color: "#00ff00" }}>STABLE</span>
        </div>
      </div>

      <div className="hud-side-panel panel-right">
        <div className="hud-stat">
          <span className="stat-label">COORDS</span>
          <span className="stat-value">31.0409° N, 31.3785° E</span>
        </div>
        <div className="hud-stat">
          <span className="stat-label">SYSTEM RECOVERY</span>
          <span className="stat-value">100%</span>
        </div>
        <div className="hud-stat">
          <span className="stat-label">MISSION STATUS</span>
          <span className="stat-value" style={{ color: "#ffcc00" }}>ACTIVE</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="hud-content">
        <motion.span 
          className="hud-mission-id"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          // MISSION ID: IEEE_MET_AESS_2026
        </motion.span>

        <motion.h1 
          className="hud-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="outline">{hero.subtitle}</span>
          <span>{hero.title}</span>
        </motion.h1>

        <div className="hud-tracks-list">
          {hero.tracks.map((track, index) => (
            <motion.span 
              key={index}
              className="hud-track-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {track}
            </motion.span>
          ))}
        </div>

        <motion.button 
          className="hud-launch-btn"
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {hero.ctaText}
        </motion.button>
      </div>
    </section>
  );
};

export default HeroAESS;
