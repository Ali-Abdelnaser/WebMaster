import "./WhatWeDo.css";

export default function WhatWeDo({ data }) {
  return (
    <section className="what-we-do">
      <h2 className="Home-title">What We Do</h2>
      <img src="img/hr.svg" alt="Divider" className="what-divider" />
      <div className="activities">
        {data.map((item, i) => (
          <div key={i} className="activity-card">
            <i className={`fas ${item.icon}`}></i>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
