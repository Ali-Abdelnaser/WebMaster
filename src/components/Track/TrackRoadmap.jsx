import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaPython, FaChartBar, FaBrain, FaProjectDiagram, FaChevronRight, 
  FaNetworkWired, FaLock, FaGlobe, FaShieldAlt, FaCode, FaMobileAlt, 
  FaDatabase, FaRocket, FaHtml5, FaCss3Alt, FaJsSquare, FaReact, 
  FaJs, FaNodeJs, FaServer, FaCogs, FaSearch, FaVectorSquare, 
  FaPalette, FaMicrochip, FaTools, FaWifi 
} from "react-icons/fa";
import roadmapsData from "../../data/roadmaps.json";
import "./TrackRoadmap.css";

const iconMap = {
  FaPython: <FaPython />,
  FaChartBar: <FaChartBar />,
  FaBrain: <FaBrain />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaNetworkWired: <FaNetworkWired />,
  FaLock: <FaLock />,
  FaGlobe: <FaGlobe />,
  FaShieldAlt: <FaShieldAlt />,
  FaCode: <FaCode />,
  FaMobileAlt: <FaMobileAlt />,
  FaDatabase: <FaDatabase />,
  FaRocket: <FaRocket />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaJsSquare: <FaJsSquare />,
  FaReact: <FaReact />,
  FaJs: <FaJs />,
  FaNodeJs: <FaNodeJs />,
  FaServer: <FaServer />,
  FaCogs: <FaCogs />,
  FaSearch: <FaSearch />,
  FaVectorSquare: <FaVectorSquare />,
  FaPalette: <FaPalette />,
  FaMicrochip: <FaMicrochip />,
  FaTools: <FaTools />,
  FaWifi: <FaWifi />,
  FaIterate: <FaProjectDiagram /> // Default or fallback
};

export default function TrackRoadmap({ trackName }) {
  const data = roadmapsData[trackName] || roadmapsData["AI"]; // Fallback to AI if not found
  
  return (
    <section className="track-roadmap-section">
      <div className="track-roadmap-container">
        <div className="track-roadmap-grid">
          {/* Left Column */}
          <motion.div 
            className="roadmap-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="roadmap-eyebrow">{data.eyebrow}</span>
            <h2 className="roadmap-title">
              {data.titlePrefix} <span className="highlight">{data.titleHighlight}</span>
            </h2>
            <p className="roadmap-description">
              {data.description}
            </p>

            <div className="roadmap-steps-list">
              {data.steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="roadmap-step-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="step-icon">
                    {iconMap[step.icon] || <FaCode />}
                  </div>
                  <div className="step-info">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="roadmap-actions">
              <Link to={data.joinLink || "/join"} className="primary-cta">
                Join the Track
              </Link>
              <a 
                href={data.fullRoadmapLink || "https://github.com/ieeemetcsc/roadmaps-2025-2026"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="secondary-link"
              >
                View full roadmap <FaChevronRight />
              </a>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="roadmap-right"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="roadmap-visual-container">
              <div className="roadmap-timeline-line"></div>
              <div className="phases-grid">
                {data.phases.map((phase, index) => (
                  <motion.div 
                    key={index}
                    className="phase-card"
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <span className="phase-range">{phase.range}</span>
                    <h4 className="phase-title">{phase.title}</h4>
                    <p className="phase-detail">{phase.detail}</p>
                    <div className="phase-dot"></div>
                  </motion.div>
                ))}
              </div>
              
              {/* Decorative elements */}
              <div className="roadmap-glow-1"></div>
              <div className="roadmap-glow-2"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
