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
  FaDatabase
} from "react-icons/fa";
import "./TracksGrid.css";
import data from "../../data/tracks.json";

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
  const duration = 10 + Math.random() * 10;

  return (
    <motion.div
      className="floating-bg-icon-cs"
      style={{ left: `${randomX}%`, top: `${randomY}%` }}
      animate={{
        x: [0, (Math.random() - 0.5) * 200],
        y: [0, (Math.random() - 0.5) * 200],
        rotate: [0, Math.random() * 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <Icon />
    </motion.div>
  );
}

export default function TracksGrid() {
  const { title, subtitle, tracks } = data;

  return (
    <section className="tracks-section">
      {/* الخلفية */}
      <div className="tracks-background">
        {Array.from({ length: 20 }).map((_, i) => {
          const Icon = bgIcons[i % bgIcons.length];
          return <FloatingBgIcon key={i} Icon={Icon} />;
        })}
      </div>

      {/* العنوان */}
      <h2 className="tracks-title">{title}</h2>
      <p className="tracks-subtitle">{subtitle}</p>

      {/* الكروت */}
      <div className="tracks-grid">
        {tracks.map((track, i) => (
          <motion.div
            key={i}
            className="track-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <img src={track.image} alt={track.name} />
            <h3>{track.name}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
