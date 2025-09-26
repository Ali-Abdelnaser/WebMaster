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
              text="Dean of MISR Higher Institute for Engineering & Technology (first woman in this role). Former Vice Dean for Community Service and Development, and Head of the Communications & Computer Engineering Department. Founder and Counselor of IEEE MET Student Branch."
            />
            <AboutCard
              icon={<FaTrophy />} // 🏆 ➝ FaTrophy
              title="Awards & Recognition"
              text="State Encouragement Award in Energy, Water & Environmental Engineering Sciences (2021). Arab Scientific Research Councils Prize in AI (2019). Excellence in Research Award (2018). Best Paper Award at ITC-Egypt IEEE Conference (2023)."
            />
            <AboutCard
              icon={<FaBookOpen />} // 📚 ➝ FaBookOpen
              title="Research & Contributions"
              text="Author of 40+ peer-reviewed papers in top journals (Elsevier, IEEE, Springer). Editor of Springer books on AI, Big Data, and Sustainability. Reviewer for leading international journals, and keynote speaker at global conferences. Led AI-driven projects in climate change, healthcare, IoT, and robotics."
            />
          </div>

          {/* Bio Summary */}
          <p className="about-summary">
            Dr. Sally Elghamrawy is a Professor of Computer Engineering and IEEE
            Senior Member, currently Dean of MISR Higher Institute for
            Engineering & Technology. With 20+ years of experience, she has
            served as Vice Dean and Head of the Communications & Computer
            Engineering Department. She holds a PhD in Computer & Systems
            Engineering (Mansoura University, 2012) and specializes in
            Artificial Intelligence, Big Data, and Distributed Systems. Dr.
            Elghamrawy has published widely in top journals, edited
            international books, and supervised numerous postgraduate theses.
            Recognized with awards such as the State Award for Women in
            Engineering Sciences (2021) and the Arab Scientific Research
            Councils Prize in AI (2019), she is also active in community
            development, focusing on digital transformation, healthcare
            innovation, and entrepreneurship.
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
