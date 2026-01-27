import React from "react";
import "../../styles/CS.css";
import { motion } from "framer-motion";
import { 
  FaReact, FaPython, FaShieldAlt, FaMobileAlt, FaBrain, 
  FaCloud, FaDatabase, FaRobot, FaNetworkWired, FaMicrochip
} from "react-icons/fa";

// Import CS Branch Logo
import csLogo from "/logo/Shape-white.png"; // Update this path to your actual CS logo

const Hero = () => {
  // Enhanced particle configuration for ALL CS tracks - all orange themed
  const techIcons = [
    { Icon: FaReact, delay: 0, x: -15, y: -20 },        // Web Development
    { Icon: FaPython, delay: 1, x: 20, y: 25 },         // Programming/AI
    { Icon: FaShieldAlt, delay: 2, x: -25, y: 15 },     // Cybersecurity
    { Icon: FaMobileAlt, delay: 0.5, x: 15, y: -15 },   // Mobile Development
    { Icon: FaBrain, delay: 1.5, x: -10, y: 30 },       // AI/Machine Learning
    { Icon: FaCloud, delay: 2.5, x: 25, y: -10 },       // Cloud Computing
    { Icon: FaDatabase, delay: 1.2, x: 0, y: -35 },     // Data Science
    { Icon: FaRobot, delay: 1.8, x: -30, y: -25 },      // Robotics/Automation
    { Icon: FaNetworkWired, delay: 0.8, x: 30, y: 20 }, // Networking/IoT
    { Icon: FaMicrochip, delay: 2.2, x: -5, y: -30 },   // Embedded Systems
  ];

  // Smooth scroll to tracks section
  const scrollToTracks = () => {
    const tracksSection = document.getElementById('tracks-section');
    if (tracksSection) {
      tracksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="cs-hero-vortex">
      {/* 1. The Super-Charged Vortex Tunnel */}
      <div className="vortex-container">
        {[...Array(7)].map((_, i) => ( // Increased ring count for depth
          <div key={i} className={`vortex-ring ring-${i + 1}`}></div>
        ))}
        <div className="vortex-core-glow"></div>
      </div>

      {/* 2. Multi-Track Floating Arsenal - All Orange */}
      <div className="tech-shards">
        {techIcons.map((item, index) => (
          <motion.div 
            key={index} 
            className={`shard s${index + 1}`}
            animate={{ 
              y: [0, item.y, 0], 
              x: [0, item.x, 0], 
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.25, 0.1]
            }} 
            transition={{ 
              duration: 5 + index, 
              repeat: Infinity, 
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <item.Icon />
          </motion.div>
        ))}
      </div>

      {/* 3. High-Energy Central Reactor */}
      <div className="hero-reactor-core">
        <motion.div 
          className="reactor-housing"
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 20, duration: 1.5 }}
        >
          <div className="reactor-energy-field outer"></div>
          <div className="reactor-energy-field inner"></div>
          <div className="reactor-logo-wrapper">
            <img src={csLogo} alt="CS Logo" className="cs-branch-logo" />
          </div>
        </motion.div>

        <motion.div 
          className="reactor-text-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="holographic-plate"></div>
          <h1 className="reactor-title">
            <span className="static">IEEE MET SB</span>
            <span className="glitch-text" data-text="COMPUTER SOCIETY">COMPUTER SOCIETY</span>
          </h1>
          
          {/* Updated: All 7 Tracks */}
          <div className="track-badges">
            <span>WEB</span><span>•</span>
            <span>AI/ML</span><span>•</span>
            <span>CYBER</span><span>•</span>
            <span>MOBILE</span>
          </div>
          
          <motion.button 
            className="reactor-btn"
            onClick={scrollToTracks}
            whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-content">EXPLORE TRACKS</span>
            <div className="btn-glare"></div>
          </motion.button>
        </motion.div>
      </div>

      {/* 4. Cinematic Overlays */}
      <div className="vortex-overlay-noise"></div>
      <div className="vortex-overlay-vignette"></div>
    </section>
  );
};

export default Hero;
