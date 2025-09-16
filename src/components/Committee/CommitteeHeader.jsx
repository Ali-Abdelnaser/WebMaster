import { motion } from "framer-motion";
import "./CommitteeHeader.css";

export default function CommitteeHeader({ image, name, Icon }) {
  return (
    <motion.div
      className="committee-header-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* لو عايز تحط icon زي Hero */}
      {Icon && (
        <motion.div
          style={{ position: "absolute", top: 20, right: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        >
          <Icon size={50} color="white" />
        </motion.div>
      )}

      <motion.img
        src={image}
        alt={name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <h2>{name} Committe </h2>
    </motion.div>
  );
}
