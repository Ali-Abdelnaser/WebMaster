import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ إضافة Helmet
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.35, // زيادة المدة بين ظهور العناصر
      delayChildren: 0.3     // زيادة البداية لتكون أنعم
    },
  },
};


  const itemVariants = {
  hidden: { opacity: 0, y: 50, rotateX: 15, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 50,  // أخف من 80 -> أبطأ حركة الارتداد
      damping: 20,    // أخف damping -> حركة أبطأ وأقل حدة
      mass: 1.2       // تزيد شعور بالثقل
    } 
  },
};
  return (
    <motion.div
      className="committee-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Helmet>
        <title>{committee.name} Committee | IEEE MET SB</title>
        <meta
          name="description"
          content={`Discover the ${committee.title} Committee at IEEE MET SB. ${committee.description}`}
        />
        <meta
          name="keywords"
          content={`IEEE, MET SB, ${committee.title} Committee, Students, Innovation, Mansoura, Egypt`}
        />
        <meta
          property="og:title"
          content={`${committee.title} Committee | IEEE MET SB`}
        />
        <meta
          property="og:description"
          content={`Learn more about the ${committee.title} Committee at IEEE MET SB.`}
        />
        <meta
          property="og:image"
          content="/Social.png"
        />
        <meta
          property="og:url"
          content={`https://ieeemet.org/committee/${committee.name}`}
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${committee.title} Committee | IEEE MET SB`}
        />
        <meta
          name="twitter:description"
          content={`Get to know the ${committee.title} Committee at IEEE MET SB and their responsibilities.`}
        />
        <meta
          name="twitter:image"
          content="/Social.png"
        />
      </Helmet>

      <Header />
      {/* الخلفية Animated */}
      <AnimatedBackground />

      {/* Main Content */}
      <main className="committee-content">
        {/* Hero Header */}
        <motion.div variants={itemVariants}>
          <CommitteeHeader image={committee.image} name={committee.name} />
        </motion.div>

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
