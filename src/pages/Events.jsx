import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
import UpcomingHero from "../components/events/UpcomingHero";
import UpcomingSection from "../components/events/UpcomingSection";
import OurEvents from "../components/events/OurEvents";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

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
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/4c0815f2-6160-4aec-82db-92fa37ceb6ee.png?token=Nsc-4i-C_OwJ5mOm23lflRsH8EfafqZ3cw1xBLSat5w&height=813&width=1200&expires=33294470769" />
        <meta property="og:url" content="https://ieeemet.org/events" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Join IEEE MET SB events: hackathons, workshops, and inspiring student activities."
        />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/4c0815f2-6160-4aec-82db-92fa37ceb6ee.png?token=Nsc-4i-C_OwJ5mOm23lflRsH8EfafqZ3cw1xBLSat5w&height=813&width=1200&expires=33294470769" />
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
