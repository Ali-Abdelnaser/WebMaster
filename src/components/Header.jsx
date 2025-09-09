import { useState, useEffect } from "react";
import "./navbar.css"; // ملف الستايل اللي انت بعتني

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // toggle drawer
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
            <a href="/Pages/Join Us/join-us.html" id="join-btn"></a>
          </div>

          {/* Menu toggle (hamburger) */}
          <div
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            id="menu-toggle"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
          </div>

          {/* Links */}
          <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
            <li>
              <a href="/index.html">Home</a>
            </li>
            <li>
              <a href="/Pages/Events/event.html">Events</a>
            </li>
            <li>
              <a href="/Pages/We/we.html">WE</a>
            </li>
            <li>
              <a href="/Pages/Chapter/chapter.html">Chapter</a>
            </li>
            <li>
              <a href="/Pages/About As/about.html">About Us</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Drawer overlay */}
      <div
        className={`drawer-overlay ${menuOpen ? "show" : ""}`}
        id="drawer-overlay"
        onClick={closeMenu}
      ></div>
    </>
  );
}
