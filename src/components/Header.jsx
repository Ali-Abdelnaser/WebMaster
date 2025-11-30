// src/components/Header.js
import { useState, useEffect } from "react";
import "../components/Header.css";
import SmartLink from "./SmartLink";
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
            <SmartLink  to="/join-cs" id="join-btn"></SmartLink >
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
              <SmartLink to="/">Home</SmartLink>
            </li>
            <li>
              <SmartLink to="/about">About</SmartLink>
            </li>
            <li className={`events-item ${liveEvent ? "live" : ""}`}>
              <SmartLink to="/events">Events</SmartLink>
            </li>
            <li>
              <SmartLink to="/wie">WIE</SmartLink>
            </li>
            <li>
              <SmartLink to="/CS">CS</SmartLink>
            </li>
            <li>
              <SmartLink to="/ieee">IEEE</SmartLink>
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
