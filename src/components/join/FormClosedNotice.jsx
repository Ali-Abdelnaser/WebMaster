import React from "react";
import "./FormClosedNotice.css"; // ملف CSS الخاص بالكومبوننت

export default function FormClosedNotice() {
  return (
    <div className="form-closed-page">
      <div className="form-closed-content">
        <img
          src="/img/form-closed.svg"
          alt="Form Closed"
          className="form-closed-image"
        />
        <div className="form-closed-text">
          <h2>Registration is currently closed</h2>
          <p>
            The application form is now closed. Stay tuned and follow us on our
            social media channels to get updated with the latest news and
            openings!
          </p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61560937966305"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/ieeemetsb/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-met-sb-pioneers/posts/?feedView=all"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
