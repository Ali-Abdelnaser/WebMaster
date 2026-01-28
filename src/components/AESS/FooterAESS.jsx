import SmartLink from "../SmartLink";
import "./FooterAESS.css";
import aessData from "../../data/aessData.json";

export default function FooterAESS() {
  const { footer, header } = aessData;
  return (
    <footer className="aess-footer">
      {/* Wave SVG above footer */}
      <div className="aess-footer-wave">
        <svg
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="aessWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0066A4" />
              <stop offset="100%" stopColor="#0E6EA9" />
            </linearGradient>
          </defs>
          <path
            className="aess-wave-path"
            fill="url(#aessWaveGradient)"
            d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,144C672,128,768,96,864,74.7C960,53,1056,43,1152,58.7C1248,75,1344,117,1392,138.7L1440,160V0H0Z"
          />
        </svg>
      </div>

      <div className="aess-footer-logo">
        <img src="/img/logo-2.png" alt="Logo" />
        <p className="aess-tagline">{footer.tagline}</p>
      </div>

      <div className="aess-footer-container">
        {/* Contact & Social */}
        <div className="aess-footer-column aess-contact-social">
          <h3>Contact Us</h3>
          <p>
            <i className="fas fa-envelope"></i> {footer.contact.email}
          </p>
          <p>
            <i className="fas fa-phone"></i> {footer.contact.phone}
          </p>
          <p>
            <i className="fas fa-location-dot"></i> {footer.contact.location}
          </p>

          <div className="aess-social-icons">
            <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href={footer.social.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            <a href={footer.social.tiktok} target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
            <a href={footer.social.whatsapp} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
            <a href={`mailto:${footer.contact.email}`} target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="aess-footer-column aess-quick-links">
          <h3>Quick Links</h3>
          {header.links.slice(0, 6).map((link, index) => (
             <SmartLink key={index} to={link.path}>
                <i className="fas fa-angle-right"></i> {link.name}
             </SmartLink>
          ))}
        </div>
      </div>

      <div className="aess-footer-bottom">
        <p>© 2026 IEEE MET SB. All rights reserved.</p>
      </div>
    </footer>
  );
}
