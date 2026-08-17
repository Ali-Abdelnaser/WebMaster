// src/components/Header.jsx
import { useState, useEffect } from "react";
import "./Header.css";
import SmartLink from "./SmartLink";
import eventsData from "../data/upcomingEvent.json";
import { GENESIS_CONFIG } from "../config/genesisConfig";
import { useEventCountdown } from "../hooks/useEventCountdown";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Hook for live registration status driven by single source of truth
  const countdown = useEventCountdown(GENESIS_CONFIG.registrationDeadline);
  const isEventLive = eventsData.status === "on" && countdown.isOpen;
  
  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // toggle drawer
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
      <header className={scrolled ? "scrolled" : ""}>
        <nav className="navbar">
          {/* Logo */}
          <div className="logo" onClick={() => {
            setLogoClicks(prev => {
              if (prev + 1 >= 5) {
                window.location.href = '/admin-login';
                return 0;
              }
              return prev + 1;
            });
          }}>
            <img
              src="/img/logo-2.png"
              alt="IEEE Logo"
              id="logo"
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Join button */}
          <div className="nav-button">
            <SmartLink to="/join" id="join-btn">
              Join US
            </SmartLink>
          </div>

          {/* Menu toggle (hamburger) */}
          <div
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
            <li>
              <SmartLink to="/" onClick={closeMenu}>
                Home
              </SmartLink>
            </li>
            <li>
              <SmartLink to="/about" onClick={closeMenu}>
                About
              </SmartLink>
            </li>
            <li className={`events-item ${isEventLive ? "live" : ""}`}>
              <SmartLink to="/events" onClick={closeMenu}>
                <span>Events</span>
                {isEventLive && (
                  <span className="nav-live-badge" title="Genesis Registration is Live">
                    <span className="nav-live-dot"></span>
                    <span className="nav-live-text">LIVE</span>
                  </span>
                )}
              </SmartLink>
            </li>
            <li>
              <SmartLink to="/ieee" onClick={closeMenu}>
                IEEE
              </SmartLink>
            </li>
            <li className="mobile-only-item">
              <SmartLink to="/join" onClick={closeMenu}>
                Join IEEE
              </SmartLink>
            </li>

            <li className={`dropdown ${mobileDropdownOpen ? "mobile-active" : ""}`}>
              <div className="dropdown-trigger" onClick={toggleMobileChapters}>
                <span>Chapters</span>
                <i className="dropdown-icon">▼</i>
              </div>
              <ul className="dropdown-menu">
                <li><SmartLink to="/wie"  onClick={closeMenu}>WIE Chapter</SmartLink></li>
                <li><SmartLink to="/CS"   onClick={closeMenu}>CS Chapter</SmartLink></li>
                <li><SmartLink to="/AESS" onClick={closeMenu}>AESS Chapter</SmartLink></li>
              </ul>
            </li>

            {/* Mobile Social + Copyright */}
            <div className="social-icons">
              <a
                href="https://www.facebook.com/profile.php?id=61560937966305"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/ieeemetsb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.tiktok.com/@ieee.met"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
              <a
                href="https://wa.me/201068643407"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="mailto:ali.abdelnaser@ieee.org"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>

            <li className="mobile-copyright">
              <div className="copyright-content">
                <span className="copyright-year">2026</span>
                <span className="copyright-divider">•</span>
                <span className="copyright-text">IEEE Student Branch</span>
              </div>
              <div className="copyright-subtitle">Innovation & Excellence</div>
            </li>
          </ul>
        </nav>
      </header>

      <div
        className={`drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
