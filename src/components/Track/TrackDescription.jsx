import { motion } from "framer-motion";
import "./TrackDescription.css";

export default function TrackDescription({ title, description }) {
  return (
    <section className="track-desc-section">
      <div className="track-desc-container">
        <motion.div
          className="track-desc-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="track-desc-header">
            <h2 className="track-desc-title">{title}</h2>
            <img src="img/CS/CS-hr.svg" alt="Divider" className="track-desc-divider" />
          </div>
          
          <div className="track-desc-content">
            <p>{description}</p>
          </div>

          {/* Decorative Elements */}
          <div className="track-desc-decoration track-desc-decoration-1"></div>
          <div className="track-desc-decoration track-desc-decoration-2"></div>
        </motion.div>
      </div>
    </section>
  );
}
