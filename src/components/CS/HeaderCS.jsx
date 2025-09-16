import { useState, useEffect } from "react";
import "./HeaderCS.css";
import { Link } from "react-router-dom";

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
          <div className="cs-nav-button">
            <Link to="/join" id="join-btn"></Link>
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/wie">WIE</Link></li>
            <li><Link to="/CS">CS</Link></li>
            <li><Link to="/about">About Us</Link></li>
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
