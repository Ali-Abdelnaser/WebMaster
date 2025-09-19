import Hero from "../components/Home/Hero";
import DrSallySection from "../components/Home/DrSallySection";
import AboutTimeline from "../components/Home/AboutTimeline";
import OurCycle from "../components/Home/OurCycle";
import Partners from "../components/Home/Partners";
import BestMembers from "../components/Home/BestMembers";
import OfficersCarousel from "../components/Home/OfficersCarousel";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
function Home() {
  return (
    <>
      <Header/>
      <Hero />
      <AnimatedBackground />
      <AboutTimeline />
      <OurCycle />
      <BestMembers />
      <DrSallySection />
      <OfficersCarousel />
      
      <Partners />
      <Footer />
    </>
  );
}

export default Home;
