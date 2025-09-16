// src/components/Header.js
import { useState, useEffect } from "react";
import "../components/Header.css";
import { Link } from "react-router-dom";
import eventsData from "../data/upcomingEvent.json"; // ملف JSON بتاع الأحداث

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
    // بما إن عندك كائن واحد، فقط تحقق من الـ status مباشرة
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
            <Link to="/join" id="join-btn"></Link>
          </div>

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
              <Link to="/">Home</Link>
            </li>
            <li className={`events-item ${liveEvent ? "live" : ""}`}>
              <Link to="/events">Events</Link>
              {/* {liveEvent && (
                <span className="tooltip"></span>
              )} */}
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
        className={`drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
