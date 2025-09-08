import { motion } from "framer-motion";
import "./cycle.css";

const committees = [
  { name: "HR", image: "/img/committees/hr.svg" },
  { name: "Logistics", image: "/img/committees/logistics.svg" },
  { name: "Event\nManagement", image: "/img/committees/event.svg" },
  { name: "Marketing", image: "/img/committees/marketing.svg" },
  { name: "PR", image: "/img/committees/pr.svg" },
  { name: "FR", image: "/img/committees/fr.svg" },
  { name: "Media", image: "/img/committees/media.svg" },
];

export default function OurCycle() {
  return (
    <section className="cycle-section">
      <h2 className="section-title">Our Cycle</h2>

      <div className="hex-grid">
        {committees.map((item, index) => (
          <motion.div
            key={index}
            className="hex"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="hex-inner">
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="cycle-quote">
        Like <span>Bees</span> In a Hive, Every Committee Plays a Role — But Together, <br></br>
        WE ARE ONE.
      </p>
    </section>
  );
}
