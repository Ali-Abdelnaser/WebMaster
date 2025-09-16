import Hero from "../components/Home/Hero";
import DrSallySection from "../components/Home/DrSallySection";
import AboutTimeline from "../components/Home/AboutTimeline";
import OurCycle from "../components/Home/OurCycle";
import Partners from "../components/Home/Partners";
import ExecutiveOfficers from "../components/Home/ExecutiveOfficers";
import Header from "../components/Header";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Header/>
      <Hero />
      <AboutTimeline />
      <OurCycle />
      <DrSallySection />
      <ExecutiveOfficers />
      <Partners />
      <Footer />
    </>
  );
}

export default Home;
