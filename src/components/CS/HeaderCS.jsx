import { useState, useEffect } from "react";
import "./HeaderCS.css";
import SmartLink from "../SmartLink";

export default function HeaderCS() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`cs-header ${scrolled ? "scrolled" : ""}`}>
        <nav className="cs-navbar">
          {/* Logo */}
          <div className="cs-logo">
            <img
              src={scrolled ? "/img/CS/CsBlack.webp" : "/img/CS/CsOrange.webp"}
              alt="CS Logo"
              id="logo"
            />
          </div>

          {/* Join button */}
          {/* <div className="cs-nav-button">
            <SmartLink to="/join" id="join-btn"></SmartLink>
          </div> */}
          <div className="cs-nav-button">
            <SmartLink to="/join" id="join-btn"></SmartLink>
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
              <SmartLink to="/">Home</SmartLink>
            </li>
            <li>
              <SmartLink to="/about">About</SmartLink>
            </li>
            <li>
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

      {/* Drawer overlay */}
      <div
        className={`cs-drawer-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
