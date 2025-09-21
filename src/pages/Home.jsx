import Hero from "../components/Home/Hero";
import DrSallySection from "../components/Home/DrSallySection";
import SummarySection from "../components/Home/SummarySection";
import OurCycle from "../components/Home/OurCycle";
import Partners from "../components/Home/Partners";
import BestMembers from "../components/Home/BestMembers";
import OfficersCarousel from "../components/Home/OfficersCarousel";
import FoundingSection from "../components/Home/FoundingSection";
import data from "../data/aboutData.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/join/AnimatedBackground";
function Home() {
  return (
    <>
      <Header />
      <Hero />
      <AnimatedBackground />
      <SummarySection data={data.summary} />
      <OurCycle />
      <BestMembers />
      <DrSallySection />
      <FoundingSection data={data.founding} />
      <OfficersCarousel />
      <Partners />
      <Footer />
    </>
  );
}

export default Home;
