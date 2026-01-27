import React from "react";
import aboutData from "../../data/csData.json";
import "./AboutCS.css";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";

export default function AboutCS() {
  const { title, description } = aboutData.about;

  return (
    <section className="cs-about-epic">
      
      {/* Section Header */}
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="cs-about-title">ABOUT CS</h2>
        <img src="img/CS/CS-hr.svg" alt="Divider" className="about-divider" />
        <p className="about-subtitle">
          Empowering the next generation of tech innovators through hands-on learning and collaboration
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="cs-about-wrapper">
        {/* Terminal Window */}
        <motion.div 
          className="terminal-window"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Window Header */}
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close"></span>
              <span className="btn-minimize"></span>
              <span className="btn-maximize"></span>
            </div>
            <div className="terminal-title">
              <FaCode /> about_cs.md — IEEE MET SB
            </div>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body">
            <div className="terminal-prompt">
              <span className="prompt-symbol">$</span>
              <span className="prompt-command">cat about_cs.md</span>
            </div>

            <motion.div 
              className="terminal-output"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <h2 className="output-title">
                <span className="hash">#</span> {title}
              </h2>
              
              <div className="output-text">
                {description.map((para, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                  >
                    <span className="line-number">{i + 1}</span>
                    {para}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
