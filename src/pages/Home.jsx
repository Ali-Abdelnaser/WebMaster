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
import { Helmet } from "react-helmet";
function Home() {
  return (
    <>
      <Helmet>
        <title>IEEE MET SB | Home</title>
        <meta
          name="description"
          content="Welcome to IEEE MET Student Branch in Mansoura, Egypt. A vibrant student community passionate about technology, innovation, and leadership."
        />
        <meta
          name="keywords"
          content="IEEE, MET SB, Student Branch, Mansoura, Egypt, Technology, Innovation, Engineering, Leadership, Events"
        />

        <meta property="og:title" content="IEEE MET SB | Home" />
        <meta
          property="og:description"
          content="Discover IEEE MET Student Branch — where students innovate, collaborate, and lead through technology and events."
        />
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/e9f5d2c5-0dd8-41ac-b993-06d86db20374.png?token=QophnvuIP3FcHxgJ_K21Wnhvx9Kke2drXBWp7bb1v8g&height=1143&width=1200&expires=33294466238" />
        <meta property="og:url" content="https://ieeemet.org/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IEEE MET SB | Home" />
        <meta
          name="twitter:description"
          content="Join IEEE MET SB in Mansoura — where students connect through technology, innovation, and leadership."
        />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/e9f5d2c5-0dd8-41ac-b993-06d86db20374.png?token=QophnvuIP3FcHxgJ_K21Wnhvx9Kke2drXBWp7bb1v8g&height=1143&width=1200&expires=33294466238" />
      </Helmet>

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
