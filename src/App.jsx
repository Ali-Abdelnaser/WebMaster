import Header from "./components/Header";
import Hero from "./components/Hero";
import DrSallySection from "./components/DrSallySection";
import AboutTimeline from "./components/AboutTimeline";
import OurCycle  from "./components/OurCycle";
import "./components/timeline.css";
function App() {
  return (
    <>
      <Header />
      <Hero />
      <AboutTimeline />
      <OurCycle/>
      <DrSallySection/>
    </>
  );
}
export default App;
