// src/components/about/SummarySection.jsx
import "./SummarySection.css";

export default function SummarySection({ data }) {
  return (
    <section className="summary-section">
      <div className="summary-container">
        <h2 className="Home-title">{data.title}</h2>
        <img src="/img/hr.svg" alt="Divider" className="summary-divider" />
        <p className="summary-text">{data.description}</p>
        {/* <div className="summary-highlights">
          {data.highlights.map((item, index) => (
            <div key={index} className="summary-card">
              <i className={item.icon}></i>
              <h3>{item.heading}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
