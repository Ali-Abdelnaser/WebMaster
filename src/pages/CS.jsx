import HeaderCS from "../components/CS/HeaderCS";
import FooterCS from "../components/CS/FooterCS";
import Hero from "../components/CS/HeroCS";
import AboutCS from "../components/CS/AboutCS";
import TracksCircle from "../components/CS/TracksGrid";
import AnimatedBackgroundCS from "../components/CS/AnimatedBackgroundCS";
import { motion } from "framer-motion";

export default function CS() {
  return (
    <motion.div
      className="cs-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderCS />
      <AnimatedBackgroundCS />
      <Hero />
      <AboutCS />
      <TracksCircle />
      <FooterCS />
    </motion.div>
  );
}
