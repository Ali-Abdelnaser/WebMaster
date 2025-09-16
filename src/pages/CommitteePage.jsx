import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import committeesData from "../data/committees.json";
import CommitteeHeader from "../components/Committee/CommitteeHeader";
import CommitteeDescription from "../components/Committee/CommitteeDescription";
import CommitteeResponsibilities from "../components/Committee/CommitteeResponsibilities";
import AnimatedBackground from "../components/join/AnimatedBackground";
import TeamStructure from "../components/Committee/TeamStructure";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/committeePage.css"; // CSS الخاص بالصفحة + blobs

export default function CommitteePage() {
  const { name } = useParams();
  const committee = committeesData.find((c) => c.name === name);

  if (!committee) return <p>Committee not found</p>;

  return (
    <motion.div
      className="committee-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      {/* الخلفية Animated */}
      <AnimatedBackground />

      {/* Main Content */}
      <main className="committee-content">
        {/* Hero Header */}
        <CommitteeHeader image={committee.image} name={committee.name} />

        {/* Description Section */}
        <CommitteeDescription
          title={committee.title}
          description={committee.description}
        />
        <CommitteeResponsibilities
          responsibilities={committee.responsibilities}
        />
        <TeamStructure
          name={committee.name}
          head={committee.team.head}
          vice={committee.team.vice}
          advisors={committee.team.advisors}
          members={committee.team.members}
        />
      </main>
      <Footer />
    </motion.div>
  );
}
