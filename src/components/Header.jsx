import { useState, useEffect } from "react";
import "../components/Header.css";
import SmartLink from "./SmartLink";
import eventsData from "../data/upcomingEvent.json";
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
  const [liveEvent, setLiveEvent] = useState(false);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // check live events
  useEffect(() => {
    setLiveEvent(eventsData.status === "on");
  }, []);

  // toggle drawer
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <nav className="navbar">
          {/* Logo */}
          <div className="logo">
            <img
              src={scrolled ? "/img/logo-1.png" : "/img/logo-2.png"}
              alt="IEEE Logo"
              id="logo"
            />
          </div>

          {/* Join button */}
          <div className="nav-button">
            <SmartLink to="/join" id="join-btn"></SmartLink>
          </div>
          {/* <div className="nav-button">
            <SmartLink to="/join-cs" id="join-btn"></SmartLink>
          </div> */}

          {/* Menu toggle (hamburger) */}
          <div
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
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
            <li className={`events-item ${liveEvent ? "live" : ""}`}>
              <SmartLink to="/events" onClick={closeMenu}>
                Events
              </SmartLink>
            </li>
            <li>
              <SmartLink to="/wie" onClick={closeMenu}>
                WIE
              </SmartLink>
            </li>
            <li>
              <SmartLink to="/CS" onClick={closeMenu}>
                CS
              </SmartLink>
            </li>
            <li>
              <SmartLink to="/ieee" onClick={closeMenu}>
                IEEE
              </SmartLink>
            </li>
						<li>
              <SmartLink to="/AESS" onClick={closeMenu}>
                AESS
              </SmartLink>
            </li>

            

            {/* Mobile Social + Copyright - يظهروا بس مع فتح المنيو */}
            {menuOpen && (
              <>
                {/* Mobile Join Button */}
            <li className="mobile-join-btn">
              <SmartLink to="/join" onClick={closeMenu}>
                Join IEEE
              </SmartLink>
            </li>
                  <div className="social-icons">
                    <a
                      href="https://www.facebook.com/profile.php?id=61560937966305"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://www.instagram.com/ieeemetsb/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="https://www.tiktok.com/@ieee.met"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTiktok />
                    </a>
                    <a
                      href="https://wa.me/201068643407"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href="mailto:ali.abdelnaser@ieee.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEnvelope />
                    </a>
                  </div>
                
 
                <li className="mobile-copyright">
                  <div className="copyright-content">
                    <span className="copyright-year">
                      2026
                    </span>
                    <span className="copyright-divider">•</span>
                    <span className="copyright-text">
                      IEEE Student Branch
                    </span>
                  </div>
                  <div className="copyright-subtitle">
                    Innovation & Excellence
                  </div>
                </li>
              </>
            )}
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
