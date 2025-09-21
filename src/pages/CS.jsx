import HeaderCS from "../components/CS/HeaderCS";
import FooterCS from "../components/CS/FooterCS";
import Hero from "../components/CS/HeroCS";
import AboutCS from "../components/CS/AboutCS";
import TracksCircle from "../components/CS/TracksGrid";
import OfficersCS from "../components/CS/OfficersCS";
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
      <Helmet>
        <title>Computer Society | IEEE MET SB</title>
        <meta
          name="description"
          content="The Computer Society (CS) at IEEE MET SB connects students passionate about coding, software, and computer science innovation."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, CS, Computer Society, Coding, Programming, Software, Innovation, Egypt"
        />

        <meta property="og:title" content="Computer Society | IEEE MET SB" />
        <meta
          property="og:description"
          content="Join the IEEE MET SB Computer Society — where students excel in coding, programming, and technology."
        />
        <meta property="og:image" content="/img/CS/CsOrange.webp" />
        <meta property="og:url" content="https://ieeemet.org/CS" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Computer Society | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Explore the Computer Society at IEEE MET SB: coding, software, and innovation."
        />
        <meta name="twitter:image" content="/img/CS/CsOrange.webp" />
      </Helmet>

      <HeaderCS />
      <AnimatedBackgroundCS />
      <Hero />
      <AboutCS />
      <TracksCircle />
      <OfficersCS />
      <FooterCS />
    </motion.div>
  );
}
