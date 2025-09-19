import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaEnvelope,
  FaFacebook,
  FaLink,
  FaChalkboardTeacher,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa"; // 👈 ضفنا الأيقونات
import AboutCard from "./AboutCard";
import "./DrSallySection.css";

export default function CounselorSection() {
  return (
    <section className="counselor-section">
      <h2 className="Home-title">COUNSOLAR</h2>
      <img src="/img/hr.svg" alt="Divider" className="counselor-divider" />
      <div className="counselor-content">
        {/* Left - Avatar */}
        <motion.div
          className="counselor-avatar"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <img src="/img/sally2.png" alt="Dr. Sally El Ghamrawy" />
          <h3 className="counselor-name">Dr. Sally</h3>
          <span className="counselor-surname">El Ghamrawy</span>
        </motion.div>

        {/* Right - About */}
        <motion.div
          className="counselor-about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-cards">
            <AboutCard
              icon={<FaChalkboardTeacher />} // 🎓 ➝ FaChalkboardTeacher
              title="Academic Leadership"
              text="First woman to serve as Dean of MISR Higher Institute. Head of Communications & Computer Engineering, Vice Dean for Community Service and Development."
            />
            <AboutCard
              icon={<FaTrophy />} // 🏆 ➝ FaTrophy
              title="Awards & Recognition"
              text="Excellence in Research Award (2018), Arab Research Councils Award (2019) , State Encouragement Award (2021). "
            />
            <AboutCard
              icon={<FaBookOpen />} // 📚 ➝ FaBookOpen
              title="Research & Contributions"
              text="Member of the Egyptian Scientific Research School, contributor to books on Big Data & AI, speaker at international conferences."
            />
          </div>

          {/* Bio Summary */}
          <p className="about-summary">
            Dr. Sally El Ghamrawy is an experienced professor with a
            demonstrated history of working at the American University in Cairo
            (AUC), the British University in Egypt (BUE), and MISR Higher
            Institute for Engineering and Technology. She holds a PhD in
            Computer Engineering and Systems (2012, Mansoura University), and
            has contributed extensively to research in AI, Big Data, and
            engineering education.
          </p>

          {/* Social Media */}
          <div className="social-links-home">
            <a
              target="_blank"
              href="https://www.linkedin.com/in/sally-elghamrawy-821aa736/?trk=people-guest_people_search-card&originalSubdomain=eg"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              target="_blank"
              href="mailto:sally_elghamrawy@ieee.org"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/sallyelghamrawy"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              target="_blank"
              href="http://sallyelghamrawy.com/"
              aria-label="Website"
            >
              <FaLink />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
