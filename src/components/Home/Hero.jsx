import { useState } from "react";
import { motion } from "framer-motion";
import "./hero.css";
import LogoAnimation from "./LogoAnimation";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* الخلفية */}
      <div className="hero-bg-wrapper">
        {!loaded && <div className="img-skeleton" />} {/* اللودينج */}
        <motion.img
          src="/img/home.jpg" // 👈 حط الصورة الموحدة هنا
          alt="Background"
          className={`hero-bg ${loaded ? "show" : ""}`}
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2 }}
        />
      </div>

      {/* اللوجو فوق الخلفية */}
      <LogoAnimation />
    </motion.section>
  );
}
