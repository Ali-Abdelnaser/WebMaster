import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
import UpcomingHero from "../components/events/UpcomingHero";
import UpcomingSection from "../components/events/UpcomingSection";
import OurEvents from "../components/events/OurEvents";
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
      <Header />
      <AnimatedBackground />
      <UpcomingHero />
      <UpcomingSection />
      <OurEvents />
      <Footer />
    </motion.div>
  );
}
