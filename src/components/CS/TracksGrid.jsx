import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaShieldAlt,
  FaMobileAlt,
  FaPalette,
  FaCogs,
  FaRobot,
  FaSatellite,
  FaUnlock,
  FaLock,
  FaSignal,
  FaDatabase,
  FaArrowRight
} from "react-icons/fa";
import "./TracksGrid.css";
import data from "../../data/tracks.json";
import { Link } from "react-router-dom";

// أيقونات الخلفية
const bgIcons = [
  FaLaptopCode,
  FaShieldAlt,
  FaMobileAlt,
  FaPalette,
  FaCogs,
  FaRobot,
  FaSatellite,
  FaUnlock,
  FaLock,
  FaSignal,
  FaDatabase
];

function FloatingBgIcon({ Icon }) {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const duration = 15 + Math.random() * 10;

  return (
    <motion.div
      className="floating-bg-icon-cs"
      style={{ left: `${randomX}%`, top: `${randomY}%` }}
      animate={{
        x: [0, (Math.random() - 0.5) * 300],
        y: [0, (Math.random() - 0.5) * 300],
        rotate: [0, 360],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      }}
    >
      <Icon />
    </motion.div>
  );
}

export default function TracksGrid() {
  const { title, subtitle, tracks } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    },
  };

  return (
    <section id="tracks-section" className="tracks-section">
      {/* Background Elements */}
      <div className="tracks-background">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingBgIcon key={i} Icon={bgIcons[i % bgIcons.length]} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="cs-about-title">{title}</h2>
        <img src="img/CS/CS-hr.svg" alt="Divider" className="tracks-divider" />
        <p className="tracks-subtitle">{subtitle}</p>
      </motion.div>

      <motion.div 
        className="tracks-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {tracks.map((track, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="track-card-wrapper"
          >
            <Link to={`/track/${track.name}`} style={{ textDecoration: 'none' }}>
              <motion.div 
                className="track-card"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: -5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="track-card-inner">
                  <img src={track.image} alt={track.name} />
                  <div className="track-card-content">
                    <span className="track-tag">{`CORE_MODULE_0${i + 1}`}</span>
                    <h3>{track.name}</h3>
                    <div className="explore-btn">
                      Explore Track <FaArrowRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

