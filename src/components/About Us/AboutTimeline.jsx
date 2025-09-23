import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./timeline.css";

export default function AboutStory({ storyData }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="story-section">
      <h2 className="Home-title">OUR STORY</h2>
      <img src="img/hr.svg" alt="Divider" className="story-divider" />

      <div className="story-wrapper">
        {storyData.map((item, index) => (
          <motion.div
            key={index}
            className="story-block"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div className="story-year">{item.year}</div>

            <div className="story-content">
              {activeIndex === index ? (
                <TypewriterText text={item.details} />
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); // نبدأ بسلسلة فارغة

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <p className="typewriter-text">{displayedText}</p>;
}
