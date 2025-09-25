import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
import UpcomingHero from "../components/events/UpcomingHero";
import UpcomingSection from "../components/events/UpcomingSection";
import OurEvents from "../components/events/OurEvents";
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
        <title>Events | IEEE MET SB</title>
        <meta
          name="description"
          content="Explore IEEE MET SB events: workshops, hackathons, seminars, and networking opportunities for students."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, Events, Hackathon, Workshops, Seminars, Networking, Students, Egypt"
        />

        <meta property="og:title" content="Events | IEEE MET SB" />
        <meta
          property="og:description"
          content="Check out IEEE MET SB’s events and activities that empower students with technology and innovation."
        />
        <meta
          property="og:image"
          content="/Social.png"/>
        <meta property="og:url" content="https://ieeemet.org/events" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Join IEEE MET SB events: hackathons, workshops, and inspiring student activities."
        />
        <meta
          name="twitter:image"
          content="/Social.png"/>
      </Helmet>
      <Header />
      <AnimatedBackground />
      <div className="about-container">
        <motion.div variants={itemVariants}>
          <UpcomingHero />
        </motion.div>
        <motion.div variants={itemVariants}>
          <UpcomingSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <OurEvents />
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}
