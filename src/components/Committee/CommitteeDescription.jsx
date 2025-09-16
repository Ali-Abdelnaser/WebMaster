import { motion } from "framer-motion";
import "./CommitteeDescription.css";

export default function CommitteeDescription({ title, description }) {
  return (
    <motion.section
      className="committee-description-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
       <h2>{title}</h2>
      <p>{description}</p>
    </motion.section>
  );
}
