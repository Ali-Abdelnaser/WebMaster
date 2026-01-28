import { useState, useEffect } from "react";
import "./HeaderAESS.css";
import SmartLink from "../SmartLink";
import eventsData from "../../data/upcomingEvent.json";
import aessData from "../../data/aessData.json";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function HeaderAESS() {
  const { header } = aessData;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveEvent, setLiveEvent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLiveEvent(eventsData.status === "on");
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`aess-header ${scrolled ? "scrolled" : ""}`}>
        <nav className="aess-navbar">
          {/* Logo */}
          <div className="aess-logo">
            <img
              src={scrolled ? "/img/met-logo.png" : "/img/met-logo.png"}
              alt="AESS Logo"
              id="logo"
            />
          </div>

          {/* Join button */}
          <div className="aess-nav-button">
            <SmartLink to={header.joinLink} id="join-btn"></SmartLink>
          </div>

          {/* Menu toggle */}
          <div
            className={`aess-menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <ul className={`aess-nav-links ${menuOpen ? "show" : ""}`}>
            {header.links.map((link, index) => (
              <li key={index} className={link.name === "Events" && liveEvent ? "aess-events-item live" : ""}>
                <SmartLink to={link.path} onClick={closeMenu}>{link.name}</SmartLink>
              </li>
            ))}

            {/* Mobile Social + Copyright */}
            {menuOpen && (
              <>
                <li className="aess-mobile-join-btn">
                  <SmartLink to={header.joinLink} onClick={closeMenu}>
                    Join AESS
                  </SmartLink>
                </li>
                <div className="aess-social-icons">
                  <a href={aessData.footer.social.facebook} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                  <a href={aessData.footer.social.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  <a href={aessData.footer.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                  <a href={aessData.footer.social.tiktok} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                  <a href={aessData.footer.social.whatsapp} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                  <a href={`mailto:${aessData.footer.contact.email}`} target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
                </div>

                <li className="aess-mobile-copyright">
                  <div className="aess-copyright-content">
                    <span className="aess-copyright-year">2026</span>
                    <span className="aess-copyright-divider">•</span>
                    <span className="aess-copyright-text">AESS Chapter</span>
                  </div>
                  <div className="aess-copyright-subtitle">Innovation & Excellence</div>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Drawer overlay */}
      <div
        className={`aess-drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
