// src/components/AboutMetWie.js
import "./AboutMetWie.css";
import underline from "/img/WIE/Wie-hr.svg";
import wieImage from "/img/WIE/wie-white.svg"; 
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function AboutMetWie() {
  return (
    <section className="metwie-about">
      <div className="metwie-about-header">
        <h2> IEEE <span>MET</span> WOMEN IN ENGINEERING </h2>
        <img src={underline} alt="underline" className="metwie-underline" />
      </div>

      <div className="metwie-about-content">
        {/* الصورة */}
        <div className="metwie-about-image">
          <img src={wieImage} alt="IEEE MET WIE" />
        </div>

        {/* النص المختصر */}
        <div className="metwie-about-text">
          <h3>What is IEEE MET WIE ?</h3>
          <p>
            IEEE MET WIE is the first WIE affinity group in the Delta region —
            a movement to empower women in engineering and technology.
          </p>

          <h3>Our Vision</h3>
          <p>
            To inspire and support women engineers to leave a real mark on the world.
          </p>

          <h3>Our Mission</h3>
          <ul>
            <li>Empower female students to compete globally.</li>
            <li>Encourage creativity and innovation.</li>
            <li>Break stereotypes about women in tech.</li>
          </ul>

          <h3>Our Goals</h3>
          <ul>
            <li>Unique events & hackathons.</li>
            <li>Safe, supportive community.</li>
            <li>Partnerships with tech companies.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
