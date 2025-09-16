import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import committeesData from "../../data/committees.json"; // عدل المسار حسب مكان JSON
import { Link } from "react-router-dom"; // برضه لازم Link

import {
  FaUsers,
  FaHandsHelping,
  FaBook,
  FaCalendarAlt,
  FaBullhorn,
  FaHandshake,
  FaCamera,
  FaChartLine,
  FaMoneyBillWave,
  FaLaptopCode,
  FaLightbulb,
  FaBullseye,
} from "react-icons/fa"; // أيقونات جاهزة
import "./cycle.css";

const committees = [
  { name: "Event\nManagement", image: "/img/committees/event.svg" },
  { name: "Marketing", image: "/img/committees/marketing.svg" },
  { name: "PR", image: "/img/committees/pr.svg" },
  { name: "FR", image: "/img/committees/fr.svg" },
];

// أيقونات الخلفية
const bgIcons = [
  FaUsers,
  FaHandsHelping,

  FaBook,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBullhorn,
  FaHandshake,
  FaBullseye,
  FaCamera,
  FaChartLine,
  FaLaptopCode,
  FaLightbulb,
];

function FloatingBgIcon({ Icon }) {
  const randomX = Math.random() * 100; // position %
  const randomY = Math.random() * 100;
  const duration = 10 + Math.random() * 10; // 10–20s

  return (
    <motion.div
      className="floating-bg-icon"
      style={{ left: `${randomX}%`, top: `${randomY}%` }}
      animate={{
        x: [0, (Math.random() - 0.5) * 200],
        y: [0, (Math.random() - 0.5) * 200],
        rotate: [0, Math.random() * 360],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <Icon />
    </motion.div>
  );
}

export default function OurCycle() {
  return (
    <section className="cycle-section">
      <div className="cycle-background">
        {Array.from({ length: 25 }).map((_, i) => {
          const Icon = bgIcons[i % bgIcons.length];
          return <FloatingBgIcon key={i} Icon={Icon} />;
        })}
      </div>
      <h2 className="section-title">Our Cycle</h2>

      <div className="hex-grid">
        {committeesData.map((item, index) => (
          <motion.div
            key={index}
            className="hex"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/committee/${item.name}`}>
              <div className="hex-inner">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="cycle-quote">
        Like <span>Bees</span> In a Hive, Every Committee Plays a Role — But
        Together, <br></br>
        WE ARE ONE.
      </p>
    </section>
  );
}
