import HeaderCS from "../components/CS/HeaderCS";
import FooterCS from "../components/CS/FooterCS";
import Hero from "../components/CS/HeroCS";
import AboutCS from "../components/CS/AboutCS";
import TracksCircle from "../components/CS/TracksGrid";
import OfficersCS from "../components/CS/OfficersCS";
import AnimatedBackgroundCS from "../components/CS/AnimatedBackgroundCS";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function CS() {
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.35, // زيادة المدة بين ظهور العناصر
      delayChildren: 0.3     // زيادة البداية لتكون أنعم
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
      stiffness: 50,  // أخف من 80 -> أبطأ حركة الارتداد
      damping: 20,    // أخف damping -> حركة أبطأ وأقل حدة
      mass: 1.2       // تزيد شعور بالثقل
    } 
  },
};
  return (
    <motion.div
      className="cs-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
