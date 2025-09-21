import Tilt from "react-parallax-tilt";
import "./FoundingSection.css";

export default function FoundingSection({ data }) {
  return (
    <section className="founding-section">
      <h2 className="Home-title">FOUNDING OFFICERS</h2>
      <img src="img/hr.svg" alt="Divider" className="founding-divider" />

      <div className="founding-cards">
        {data.map((person, index) => (
          <Tilt
            key={index}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareColor="#027dcf"
            glarePosition="all"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            className="founding-card"
          >
            <div className="founding-avatar">
              <img src={person.image} alt={person.name} />
            </div>
            <h3 className="founding-name">{person.name}</h3>
            <p className="founding-role">{person.role}</p>
            <div className="social-links">
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={`mailto:${person.mail}`}>
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
