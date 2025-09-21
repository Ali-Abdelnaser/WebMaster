import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
import aboutData from "../data/aboutData.json";
import HeroSection from "../components/About Us/HeroSection";
import MissionVision from "../components/About Us/MissionVision";
import AboutTimeline from "../components/About Us/AboutTimeline";
import WhatWeDo from "../components/About Us/WhatWeDo";
import ImageSwiper from "../components/About Us/ImageSwiper";
import StatsSection from "../components/About Us/StatsSection";
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
        <title>About Us | IEEE MET SB</title>
        <meta
          name="description"
          content="Learn more about IEEE MET Student Branch, our vision, mission, and the passionate students who make it possible."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, About, Vision, Mission, Students, Innovation, Egypt"
        />

        <meta property="og:title" content="About Us | IEEE MET SB" />
        <meta
          property="og:description"
          content="Explore the story and mission of IEEE MET Student Branch in Mansoura, Egypt."
        />
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/3e1db924-5287-4b91-aa0b-db4f95793c1f.png?token=6GoDv05ee86C96MITaBgpvLunKem2pm1fZt44mbCqwk&height=1055&width=1200&expires=33294466926" />
        <meta property="og:url" content="https://ieeemet.org/about" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | IEEE MET SB" />
        <meta
          name="twitter:description"
          content="Discover the vision and journey of IEEE MET Student Branch in Mansoura, Egypt."
        />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/3e1db924-5287-4b91-aa0b-db4f95793c1f.png?token=6GoDv05ee86C96MITaBgpvLunKem2pm1fZt44mbCqwk&height=1055&width=1200&expires=33294466926" />
      </Helmet>

      <Header />
      <div className="about-container">
        <AnimatedBackground />
        <HeroSection data={aboutData.hero} />
        <MissionVision data={aboutData.missionVision} />
        <AboutTimeline storyData={aboutData.storyData} />
        <WhatWeDo data={aboutData.whatWeDo} />
        <StatsSection stats={aboutData.stats} />
        <ImageSwiper images={aboutData.images} />
      </div>
      <Footer />
    </motion.div>
  );
}
