import { motion } from "framer-motion";
import "./TrackTopics.css";
import { FaCheckCircle } from "react-icons/fa";

export default function TrackTopics({ topics = [] }) {
  return (
    <section className="track-topics-section">
      <div className="track-topics-container">
        <motion.div
          className="track-topics-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="track-topics-title">What You'll Learn</h2>
          <img src="img/CS/CS-hr.svg" alt="Divider" className="track-topics-divider" />
        </motion.div>

        <div className="track-topics-grid">
          {topics.map((topic, idx) => (
            <motion.div
              key={idx}
              className="track-topic-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                z: 50
              }}
            >
              <div className="track-topic-icon-wrapper">
                <div className="track-topic-icon-glow"></div>
                <FaCheckCircle className="track-topic-icon" />
                <span className="track-topic-number">{idx + 1}</span>
              </div>
              
              <div className="track-topic-content">
                <h3 className="track-topic-title">Topic {idx + 1}</h3>
                <p className="track-topic-text">{topic}</p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="track-topic-hover-overlay"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
