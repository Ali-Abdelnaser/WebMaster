import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../config/supabase";
import CommitteeHeader from "../components/Committee/CommitteeHeader";
import CommitteeDescription from "../components/Committee/CommitteeDescription";
import CommitteeResponsibilities from "../components/Committee/CommitteeResponsibilities";
import AnimatedBackground from "../components/join/AnimatedBackground";
import TeamStructure from "../components/Committee/TeamStructure";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/committeePage.css";

export default function CommitteePage() {
  const { name } = useParams();
  const [committee, setCommittee] = useState(null);
  const [team, setTeam] = useState({ head: null, vice: [], advisors: [], members: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeData = async () => {
      setLoading(true);
      // 1. Fetch Committee Main Data
      const { data: comm, error: commErr } = await supabase
        .from('committees')
        .select('*')
        .eq('name', name)
        .single();

      if (!commErr && comm) {
        setCommittee(comm);
        
        // 2. Fetch Members for this Committee
        const { data: members, error: mErr } = await supabase
          .from('committee_members')
          .select('*')
          .eq('committee_name', name);

        if (!mErr && members) {
          const structure = {
            head: members.find(m => m.role === 'head'),
            vice: members.filter(m => m.role === 'vice'),
            advisors: members.filter(m => m.role === 'advisor'),
            members: members.filter(m => m.role === 'member')
          };
          setTeam(structure);
        }
      }
      setLoading(false);
    };

    fetchCommitteeData();
  }, [name]);

  if (loading) return null;
  if (!committee) return <div className="page-center"><p>Committee not found</p></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.35,
        delayChildren: 0.3
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
        stiffness: 50,
        damping: 20,
        mass: 1.2
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
        <meta name="description" content={committee.description} />
      </Helmet>

      <Header />
      <AnimatedBackground />

      <main className="committee-content">
        <motion.div variants={itemVariants}>
          <CommitteeHeader image={committee.image} name={committee.name} />
        </motion.div>

        <CommitteeDescription
          title={committee.title}
          description={committee.description}
        />
        
        <CommitteeResponsibilities
          responsibilities={committee.responsibilities}
        />

        <TeamStructure
          name={committee.name}
          head={team.head}
          vice={team.vice}
          advisors={team.advisors}
          members={team.members}
        />
      </main>
      <Footer />
    </motion.div>
  );
}
