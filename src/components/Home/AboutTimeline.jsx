import { motion } from "framer-motion";
import "./timeline.css";
const storyData = [
  {
    year: "2020",
    title: "The Beginning",
    text: "A small group of passionate students came together with one vision in mind.",
  },
  {
    year: "2021",
    title: "First Achievements",
    text: "We launched our first events and started growing our community.",
  },
  {
    year: "2023",
    title: "Expanding Horizons",
    text: "Collaborations and workshops that reached more students than ever.",
  },
  {
    year: "2025",
    title: "The Future",
    text: "Continuing our mission to inspire, innovate, and lead.",
  },
];

export default function AboutStory() {
  return (
    <section className="story-section">
      <h2 className="section-title">Our Story</h2>
      <div className="story-wrapper">
        {storyData.map((item, index) => (
          <motion.div
            key={index}
            className="story-block"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className="story-year">{item.year}</div>
            <div className="story-content">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
