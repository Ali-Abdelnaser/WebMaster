import SmartLink from "../SmartLink";
import "./FooterWie.css";

export default function Footer() {
  return (
    <footer className="wie-footer">
      {/* موجة SVG فوق الفوتر */}
      <div className="wie-footer-wave">
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            className="wie-wave-path"
            fill="#622a90"
            d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,144C672,128,768,96,864,74.7C960,53,1056,43,1152,58.7C1248,75,1344,117,1392,138.7L1440,160V0H0Z"
          />
        </svg>
      </div>

      <div className="wie-footer-logo">
        <img src="/img/logo-2.png" alt="Logo" />
        <p className="wie-tagline">IEEE MET SB — Innovating the Future</p>
      </div>

      <div className="wie-footer-container">
        {/* Contact & Social */}
        <div className="wie-footer-column wie-contact-social">
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

          <div className="wie-social-icons">
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
        <div className="wie-footer-column wie-quick-links">
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
            <i className="fas fa-angle-right"></i> WiE
          </SmartLink >
          <SmartLink  to="/CS">
            <i className="fas fa-angle-right"></i> CS
          </SmartLink >
          {/* <SmartLink  to="/AESS">
            <i className="fas fa-angle-right"></i> AESS
          </SmartLink > */}
        </div>
      </div>

      <div className="wie-footer-bottom">
        <p>© 2025 IEEE MET SB. All rights reserved.</p>
      </div>
    </footer>
  );
}
