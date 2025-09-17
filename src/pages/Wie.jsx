import HeaderWIE from "../components/WIE/HeaderWie";
import FooterWIE from "../components/WIE/FooterWie";
import HeroWIE from "../components/WIE/Wie-Hero";
import AboutWIE from "../components/WIE/AboutWIE";
import AboutMetWie from "../components/WIE/AboutMetWie";
import WieOfficersCarousel from "../components/WIE/WieOfficersCarousel";
import WieFaqs from "../components/WIE/WieFAQ";
import AnimatedBackgroundWIE from "../components/WIE/AnimatedBackgroundWie";
import { motion } from "framer-motion";

export default function WIE() {
  return (
    <motion.div
      className="wie-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderWIE />
      <AnimatedBackgroundWIE />
      <HeroWIE />
      <AboutWIE />
      <AboutMetWie />
      <WieFaqs />
      <WieOfficersCarousel />
      <FooterWIE />
    </motion.div>
  );
}
