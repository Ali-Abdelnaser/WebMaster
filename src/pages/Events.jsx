import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../config/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventCard from "../components/events/EventCard";
import AnimatedBackground from "../components/join/AnimatedBackground";
import "../components/events/OurEvents.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  if (loading) return null;

  return (
    <div className="events-page">
      <Helmet>
        <title>Events | IEEE MET SB</title>
        <meta name="description" content="Explore IEEE MET SB events and workshops." />
      </Helmet>

      <Header />
      <AnimatedBackground />

      <main className="events-container">
        <header className="events-header">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="Home-title"
          >
            OUR EVENTS
          </motion.h1>
          <img src="img/hr.svg" alt="Divider" className="HR-divider" />
        </header>

        <motion.div 
          className="events-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
