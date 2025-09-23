import SmartLink from "../SmartLink";
import "./FooterCS.css";

export default function FooterCS() {
  return (
    <footer className="cs-footer">
      {/* موجة SVG فوق الفوتر */}
      <div className="cs-footer-wave">
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="csWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FAA41AFF" />
              <stop offset="100%" stopColor="#A76606B7" />
            </linearGradient>
          </defs>
          <path
            className="cs-wave-path"
            fill="url(#csWaveGradient)"
            d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,144C672,128,768,96,864,74.7C960,53,1056,43,1152,58.7C1248,75,1344,117,1392,138.7L1440,160V0H0Z"
          />
        </svg>
      </div>

      <div className="cs-footer-logo">
        <img src="/img/logo-2.png" alt="Logo" />
        <p className="cs-tagline">IEEE MET SB — Innovating the Future</p>
      </div>

      <div className="cs-footer-container">
        {/* Contact & Social */}
        <div className="cs-footer-column cs-contact-social">
          <h3>Contact Us</h3>
          <p>
            <i className="fas fa-envelope"></i> ali.abdelnaser@ieee.org
          </p>
          <p>
            <i className="fas fa-phone"></i> +20 1068643407
          </p>
          <p>
            <i className="fas fa-location-dot"></i> Mansoura, Egypt
          </p>

          <div className="cs-social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=61560937966305"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/ieeemetsb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="https://www.tiktok.com/@ieee.met"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="https://wa.me/201068643407"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a
              href="mailto:ali.abdelnaser@ieee.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="cs-footer-column cs-quick-links">
          <h3>Quick Links</h3>
          <SmartLink  to="/">
            <i className="fas fa-angle-right"></i> Home
          </SmartLink >
          <SmartLink  to="/about">
            <i className="fas fa-angle-right"></i> About
          </SmartLink >
          <SmartLink  to="/events">
            <i className="fas fa-angle-right"></i> Events
          </SmartLink >
          <SmartLink  to="/wie">
            <i className="fas fa-angle-right"></i> WIE
          </SmartLink >
          <SmartLink  to="/CS">
            <i className="fas fa-angle-right"></i> CS
          </SmartLink >
        </div>
      </div>

      <div className="cs-footer-bottom">
        <p>© 2025 IEEE MET SB. All rights reserved.</p>
      </div>
    </footer>
  );
}
