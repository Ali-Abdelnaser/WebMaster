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
        <meta property="og:image" content="/img/logo-1.png" />
        <meta property="og:url" content="https://ieeemet.org/events" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Join IEEE MET SB events: hackathons, workshops, and inspiring student activities."
        />
        <meta name="twitter:image" content="/img/logo-1.png" />
      </Helmet>

      <Header />
      <AnimatedBackground />
      <UpcomingHero />
      <UpcomingSection />
      <OurEvents />
      <Footer />
    </motion.div>
  );
}
