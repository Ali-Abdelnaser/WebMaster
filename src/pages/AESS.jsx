import HeaderAESS from "../components/AESS/HeaderAESS";
import HeroAESS from "../components/AESS/HeroAESS";
import AboutAESS from "../components/AESS/AboutAESS";
import OfficersAESS from "../components/AESS/OfficersAESS";
import "../styles/AESS.css";
// import AnimatedBackgroundAESS from "../components/AESS/AnimatedBackgroundAESS"; // Todo: Create if needed
import FooterAESS from "../components/AESS/FooterAESS";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function AESS() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="aess-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>AESS | IEEE MET SB</title>
        <meta
          name="description"
          content="Aerospace and Electronic Systems Society (AESS) at IEEE MET SB. Advancing the frontiers of aerospace trade and technology."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, AESS, Aerospace, Electronic Systems, Avionics, Space, Engineering"
        />

        <meta property="og:title" content="AESS | IEEE MET SB" />
        <meta
          property="og:description"
          content="Join the IEEE MET SB AESS Chapter — Innovation in aerospace and electronic systems."
        />
        <meta property="og:image" content="/Social.png" />
        <meta property="og:url" content="https://ieeemet.org/AESS" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="aess-space-background">
        <div className="space-void"></div>
        <div className="space-stars-1"></div>
        <div className="space-stars-2"></div>
        <div className="space-stars-3"></div>
        <div className="space-nebula"></div>
        <div className="space-comets">
          <div className="comet c1"></div>
          <div className="comet c2"></div>
          <div className="comet c3"></div>
        </div>
        <div className="space-satellite"></div>
      </div>
      <HeaderAESS />
      {/* <AnimatedBackgroundAESS /> */}
      <HeroAESS />
      <AboutAESS />
      <OfficersAESS />
      <FooterAESS />
    </motion.div>
  );
}
