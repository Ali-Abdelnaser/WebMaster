import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import tracksData from "../data/tracks.json";
import TrackHeader from "../components/Track/TrackHeader";
import TrackDescription from "../components/Track/TrackDescription";
import TrackBoard from "../components/Track/TrackBoard";
import TrackTopics from "../components/Track/TrackTopics";
import TrackRoadmap from "../components/Track/TrackRoadmap";
import TrackTechBackground from "../components/Track/TrackTechBackground";
import HeaderCS from "../components/CS/HeaderCS";
import FooterCS from "../components/CS/FooterCS";
import "../styles/trackPage.css";

export default function TrackPage() {
  const { name } = useParams();
  const track = tracksData.tracks.find((t) => t.name === name);

  if (!track) return <p>Track not found</p>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    },
  };

  return (
    <motion.div
      className="track-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>{track.name} Track | IEEE MET SB</title>
        <meta
          name="description"
          content={`Discover the ${track.name} Track at IEEE MET SB CS. ${track.description}`}
        />
        <meta
          name="keywords"
          content={`IEEE, MET SB, ${track.name} Track, CS, Computer Science, Students, Innovation, Mansoura, Egypt`}
        />
        <meta
          property="og:title"
          content={`${track.name} Track | IEEE MET SB`}
        />
        <meta
          property="og:description"
          content={`Learn more about the ${track.name} Track at IEEE MET SB CS.`}
        />
        <meta
          property="og:image"
          content="/Social.png"
        />
        <meta
          property="og:url"
          content={`https://ieeemet.org/track/${track.name}`}
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${track.name} Track | IEEE MET SB`}
        />
        <meta
          name="twitter:description"
          content={`Get to know the ${track.name} Track at IEEE MET SB CS and what you'll learn.`}
        />
        <meta
          name="twitter:image"
          content="/Social.png"
        />
      </Helmet>

      <HeaderCS />

      {/* Technical Background */}
      <TrackTechBackground />

      {/* Main Content */}
      <main className="track-content">
        {/* Hero Header */}
        <motion.div variants={itemVariants}>
          <TrackHeader image={track.image} name={track.name} />
        </motion.div>

        {/* Description Section */}
        <TrackDescription
          title={track.title}
          description={track.description}
        />

        {/* Board Section */}
        <TrackBoard trackName={track.name} />

      

        {/* Roadmap Section */}
        <TrackRoadmap trackName={track.name} />
      </main>
      <FooterCS />
    </motion.div>
  );
}
