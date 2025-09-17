import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./AboutWIE.css";

export default function AboutWIE() {
  return (
    <section className="wie-about">
      {/* العنوان */}
      <div className="wie-about-header">
        <h2> IEEE WOMEN IN ENGINEERING </h2>
        <img src="/img/WIE/Wie-hr.svg" alt="wie-underline" className="wie-underline" />
      </div>

      <div className="wie-about-content">
        {/* النص */}
        <div className="wie-about-text">
          <h3>What is WIE?</h3>
          <p>
            IEEE Women in Engineering (WIE) is a global network that empowers women 
            in engineering and technology, inspiring young girls worldwide to explore STEM.
          </p>

          <h3>Mission & Vision</h3>
          <p><strong>Mission:</strong> Inspire, engage, and advance women in STEM.</p>
          <p><strong>Vision:</strong> To be the leading global community supporting women engineers.</p>

          <h3>Our Goals</h3>
          <ul>
            <li>🌟 Inspiration — Encourage girls to explore STEM confidently.</li>
            <li>🤝 Engagement — Hands-on workshops & collaborative projects.</li>
            <li>🚀 Advancement — Mentorship, scholarships, and leadership opportunities.</li>
          </ul>

          {/* Social Icons */}
          <div className="wie-about-socials">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* صورة جانبية */}
        <div className="wie-about-image">
          <img src="/img/WIE/WomanInEngineering-white.svg" alt="WIE Community" />
        </div>
      </div>
    </section>
  );
}
