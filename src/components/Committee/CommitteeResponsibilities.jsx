import { motion } from "framer-motion";
import "./CommitteeResponsibilities.css";
import { FaCheck } from "react-icons/fa";
export default function CommitteeResponsibilities({ responsibilities = [] }) {
  return (
    <section className="crt-section" aria-labelledby="crt-title">
      <h2 id="crt-title" className="Home-title">Responsibilities</h2>
      <img src="../img/hr.svg" alt="Divider" className="crt-divider" />

      <div className="crt-timeline">
        {responsibilities.map((task, idx) => (
          <motion.div
            key={idx}
            className="crt-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
          >
            <div className="crt-marker-wrap">
              <span className="crt-line" aria-hidden="true" />
              <div className="crt-marker" aria-hidden="true">
                <FaCheck className="crt-marker-icon" />
              </div>
            </div>

            <div className="crt-content">
              <div className="crt-step-number">Step {idx + 1}</div>
              <p className="crt-task">{task}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
