import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../config/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventCard from "../components/events/EventCard";
import AnimatedBackground from "../components/join/AnimatedBackground";
import UpcomingHero from "../components/events/UpcomingHero";
import UpcomingSection from "../components/events/UpcomingSection";
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="events-page">
      <Helmet>
        <title>Events | IEEE MET SB</title>
      </Helmet>

      <div className="events-navbar">
        <Header />
      </div>

      <div className="events-bg-layer">
        <AnimatedBackground />
      </div>

      <main className="events-container">
        <UpcomingHero />
        <UpcomingSection />

        <section className="our-events-section">
          <div className="our-events-header">
            <span className="our-events-kicker">Archive Highlights</span>
            <h2 className="our-events-title">Past Events</h2>
            <p className="our-events-description">
              Browse some of our most impactful activities, workshops, and
              sessions that shaped our journey.
            </p>
          </div>

          {loading ? (
            <p className="events-loading">Loading events...</p>
          ) : (
            <motion.div
              className="our-events-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {events.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && events.length === 0 && (
            <p className="events-empty">No past events found yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;