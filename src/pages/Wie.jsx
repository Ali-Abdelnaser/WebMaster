import HeaderWIE from "../components/WIE/HeaderWie";
import FooterWIE from "../components/WIE/FooterWie";
import HeroWIE from "../components/WIE/Wie-Hero";
import AboutWIE from "../components/WIE/AboutWIE";
import AboutMetWie from "../components/WIE/AboutMetWie";
import WieOfficersCarousel from "../components/WIE/WieOfficersCarousel";
import WieFaqs from "../components/WIE/WieFAQ";
import AnimatedBackgroundWIE from "../components/WIE/AnimatedBackgroundWie";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function WIE() {
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
      className="wie-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>WIE | IEEE MET SB</title>
        <meta
          name="description"
          content="Women in Engineering (WIE) at IEEE MET SB empowers female engineers, celebrates diversity, and fosters leadership."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, WIE, Women in Engineering, Diversity, Leadership, Innovation, Egypt"
        />

        <meta property="og:title" content="WIE | IEEE MET SB" />
        <meta
          property="og:description"
          content="Explore WIE at IEEE MET SB — empowering female engineers and leaders in Mansoura, Egypt."
        />
        <meta property="og:image" content="/img/WIE/wie-purple.svg" />
        <meta property="og:url" content="https://ieeemet.org/wie" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WIE | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Discover IEEE MET SB’s Women in Engineering chapter empowering diversity and innovation."
        />
        <meta name="twitter:image" content="/img/WIE/wie-purple.svg" />
      </Helmet>

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
