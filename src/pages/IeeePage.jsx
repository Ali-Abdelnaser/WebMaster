// src/pages/IeeePage.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroIEEE from "../components/ieee/HeroIEEE";
import IEEESection from "../components/ieee/ieeeSection";
import Arrow from "../components/ieee/arrow";
import Region8Section from "../components/ieee/Region8Section";
import IEEEEgyptSection from "../components/ieee/ieee-egypt-section";
import SacEgyptSection from "../components/ieee/SacEgyptSection";
import AnimatedBackground from "../components/join/AnimatedBackground";
import { motion } from "framer-motion";
export default function IeeePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35, // زيادة المدة بين ظهور العناصر
        delayChildren: 0.3, // زيادة البداية لتكون أنعم
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 50, 
        damping: 20, 
        mass: 1.2, 
      },
    },
  };
  return (
    <motion.div
      className="cs-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedBackground />
      <Header />
      <div className="ieee-page">
        <motion.div className="" variants={itemVariants}>
          <HeroIEEE />
        </motion.div>
        <motion.div className="ieee-section" variants={itemVariants}>
          <IEEESection />
        </motion.div>
        <Arrow />
        <Region8Section />
        <Arrow />
        <IEEEEgyptSection />
        <Arrow />
        <SacEgyptSection />
      </div>
      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
}
