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

export default function CS() {
  return (
    <motion.div
      className="cs-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <div className="about-container">
        <AnimatedBackground />
        <HeroSection data={aboutData.hero} />
        <MissionVision data={aboutData.missionVision} />
        <AboutTimeline storyData={aboutData.storyData}/>
        <WhatWeDo data={aboutData.whatWeDo} />
         <StatsSection stats={aboutData.stats} />
        <ImageSwiper images={aboutData.images} />
      </div>
      <Footer />
    </motion.div>
  );
}
