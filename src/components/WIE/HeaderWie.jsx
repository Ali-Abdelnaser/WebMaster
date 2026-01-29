import { useState, useEffect } from "react";
import "./HeaderWie.css";
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

export default function HeaderWie() {
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
      <header className={`wie-header ${scrolled ? "scrolled" : ""}`}>
        <nav className="wie-navbar">
          {/* Logo */}
          <div className="wie-logo">
            <img
              src={scrolled ? "/img/WIE/wie-white.svg": "/img/WIE/wie-purple.svg" }
              alt="WIE Logo"
              id="logo"
            />
          </div>

          {/* Join button */}
          <div className="wie-nav-button">
            <SmartLink to="/join" id="join-btn">
              Join WIE
            </SmartLink>
          </div>

          {/* Menu toggle */}
          <div
            className={`wie-menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <ul className={`wie-nav-links ${menuOpen ? "show" : ""}`}>
            <li>
              <SmartLink to="/" onClick={closeMenu}>Home</SmartLink>
            </li>
            <li>
              <SmartLink to="/about" onClick={closeMenu}>About</SmartLink>
            </li>
            <li className={`wie-events-item ${liveEvent ? "live" : ""}`}>
              <SmartLink to="/events" onClick={closeMenu}>Events</SmartLink>
            </li>
            <li>
              <SmartLink to="/ieee" onClick={closeMenu}>IEEE</SmartLink>
            </li>
                        <li >
              <SmartLink to="/join" onClick={closeMenu}>
                Join WIE
              </SmartLink>
            </li>
            <li className={`wie-dropdown ${mobileDropdownOpen ? "mobile-active" : ""}`}>
              <div className="wie-dropdown-trigger" onClick={toggleMobileChapters}>
                <span>Chapters</span>
                <i className="wie-dropdown-icon">▼</i>
              </div>
              <ul className="wie-dropdown-menu">
                <li><SmartLink to="/wie" onClick={closeMenu}>WIE Chapter</SmartLink></li>
                <li><SmartLink to="/CS" onClick={closeMenu}>CS Chapter</SmartLink></li>
                <li><SmartLink to="/AESS" onClick={closeMenu}>AESS Chapter</SmartLink></li>
              </ul>
            </li>

            {/* Mobile Social + Copyright */}

            <div className="wie-social-icons">
              <a href="https://www.facebook.com/profile.php?id=61560937966305" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/ieeemetsb/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
              <a href="https://www.tiktok.com/@ieee.met" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
              <a href="https://wa.me/201068643407" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
              <a href="mailto:ali.abdelnaser@ieee.org" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
            </div>

            <li className="wie-mobile-copyright">
              <div className="wie-copyright-content">
                <span className="wie-copyright-year">2026</span>
                <span className="wie-copyright-divider">•</span>
                <span className="wie-copyright-text">WIE Affinity Group</span>
              </div>
              <div className="wie-copyright-subtitle">Innovation & Excellence</div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Drawer overlay */}
      <div
        className={`wie-drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
