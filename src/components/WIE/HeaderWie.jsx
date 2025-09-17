// src/components/Header.js
import { useState, useEffect } from "react";
import "./HeaderWie.css";
import { Link } from "react-router-dom";
import eventsData from "../../data/upcomingEvent.json"; // ملف JSON بتاع الأحداث

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
      <header className={`wie-header ${scrolled ? "wie-scrolled" : ""}`}>
        <nav className="wie-navbar">
          {/* Logo */}
          <div className="wie-logo">
            <img
              src={scrolled ? "/img/WIE/wie-white.svg": "/img/WIE/wie-purple.svg"  }
              alt="WIE Logo"
              id="wie-logo"
            />
          </div>

          <div className="wie-nav-button">
            <Link to="/join" id="wie-join-btn"></Link>
          </div>

          {/* Menu toggle (hamburger) */}
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
              <Link to="/">Home</Link>
            </li>
            <li className={`wie-events-item ${liveEvent ? "wie-live" : ""}`}>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/wie">WIE</Link>
            </li>
            <li>
              <Link to="/CS">CS</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
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
