import { useState, useEffect } from "react";
import "./HeaderCS.css";
import SmartLink from "../SmartLink";
import eventsData from "../../data/upcomingEvent.json";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function HeaderCS() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) setMobileDropdownOpen(false);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileDropdownOpen(false);
  };

  const toggleMobileChapters = (e) => {
    e.stopPropagation();
    setMobileDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <header className={`cs-header ${scrolled ? "scrolled" : ""}`}>
        <nav className="cs-navbar">
          {/* Logo */}
          <div className="cs-logo">
            <img
              src={scrolled ? "/img/CS/CsOrange.webp" : "/img/CS/CsOrange.webp"}
              alt="CS Logo"
              id="logo"
            />
          </div>

          {/* Join button */}
          <div className="cs-nav-button">
            <SmartLink to="/join" id="join-btn">
              Join CS
            </SmartLink>
          </div>

          {/* Menu toggle */}
          <div
            className={`cs-menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <ul className={`cs-nav-links ${menuOpen ? "show" : ""}`}>
            <li>
              <SmartLink to="/" onClick={closeMenu}>Home</SmartLink>
            </li>
            <li>
              <SmartLink to="/about" onClick={closeMenu}>About</SmartLink>
            </li>
            <li className={`cs-events-item ${liveEvent ? "live" : ""}`}>
              <SmartLink to="/events" onClick={closeMenu}>Events</SmartLink>
            </li>
            <li>
              <SmartLink to="/ieee" onClick={closeMenu}>IEEE</SmartLink>
            </li>
            <li className="mobile-only-item">
              <SmartLink to="/join" onClick={closeMenu}>
                Join CS
              </SmartLink>
            </li>
            <li className={`cs-dropdown ${mobileDropdownOpen ? "mobile-active" : ""}`}>
              <div className="cs-dropdown-trigger" onClick={toggleMobileChapters}>
                <span>Chapters</span>
                <i className="cs-dropdown-icon">▼</i>
              </div>
              <ul className="cs-dropdown-menu">
                <li><SmartLink to="/wie" onClick={closeMenu}>WIE Chapter</SmartLink></li>
                <li><SmartLink to="/CS" onClick={closeMenu}>CS Chapter</SmartLink></li>
                <li><SmartLink to="/AESS" onClick={closeMenu}>AESS Chapter</SmartLink></li>
              </ul>
            </li>

            {/* Mobile Social + Copyright */}

            <div className="cs-social-icons">
              <a href="https://www.facebook.com/profile.php?id=61560937966305" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/ieeemetsb/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
              <a href="https://www.tiktok.com/@ieee.met" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
              <a href="https://wa.me/201068643407" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
              <a href="mailto:ali.abdelnaser@ieee.org" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
            </div>

            <li className="cs-mobile-copyright">
              <div className="cs-copyright-content">
                <span className="cs-copyright-year">2026</span>
                <span className="cs-copyright-divider">•</span>
                <span className="cs-copyright-text">CS Chapter</span>
              </div>
              <div className="cs-copyright-subtitle">Innovation & Excellence</div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Drawer overlay */}
      <div
        className={`cs-drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
