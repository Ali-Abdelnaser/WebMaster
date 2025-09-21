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
  return (
    <motion.div
      className="wie-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
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
