import React from "react";
import "./AboutAESS.css";
import { motion } from "framer-motion";
import aessData from "../../data/aessData.json";
import { FaGlobe, FaCogs, FaRocket, FaFlag } from "react-icons/fa";

export default function AboutAESS() {
  const { globalAESS, metAESS } = aessData;

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="aess-about-page-wrapper">
      
      {/* SECTION 1: GLOBAL AESS (The Big Picture) */}
      <section className="aess-global-infographic">
        <div className="global-container">
          <motion.div 
            className="scanner-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="scanner-ring r1"></div>
            <div className="scanner-ring r2"></div>
            <div className="scanner-ring r3"></div>
            <img 
              src={globalAESS.globalLogo} 
              alt="Global AESS Logo" 
              className="scanner-logo-img"
            />
          </motion.div>

          <motion.div 
            className="global-text-content"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span style={{ fontFamily: 'Share Tech Mono', color: '#1C76AE', letterSpacing: '3px' }}>IEEE GLOBAL ORGANIZATION</span>
            <h2>{globalAESS.title}</h2>
            {globalAESS.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: MET AESS (The Pioneers) */}
      <section className="met-aess-dashboard">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="badge-egypt">EGYPTIAN FIELD OPERATIONS // NODE_01</div>
          <h2>{metAESS.title}</h2>
          <p style={{ color: '#92BDD7', fontFamily: 'Share Tech Mono' }}>{metAESS.subtitle}</p>
        </motion.div>

        <div className="dashboard-grid">
          {/* Mission Box */}
          <motion.div 
            className="dashboard-item mission-box"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="item-label">DIRECTIVE_01: MISSION</span>
            <h3><FaFlag style={{ marginRight: '10px' }} /> Our Mission</h3>
            <p>{metAESS.mission}</p>
          </motion.div>

          {/* Vision Box */}
          <motion.div 
            className="dashboard-item vision-box"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="item-label">DIRECTIVE_02: VISION</span>
            <h3><FaCogs style={{ marginRight: '10px' }} /> Our Vision</h3>
            <p>{metAESS.vision}</p>
          </motion.div>

          {/* Objectives Full Width Box */}
          <motion.div 
            className="dashboard-item objectives-box"
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="item-label">DEPLOYMENT_LOG: CHAPTER OBJECTIVES</span>
            <h3><FaRocket style={{ marginRight: '10px' }} /> Operational Goals</h3>
            <p style={{ marginBottom: '30px' }}>{metAESS.content}</p>
            
            <div className="objectives-list">
              {metAESS.goals.map((goal, i) => (
                <div key={i} className="objective-entry">
                  <div className="entry-point"></div>
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
