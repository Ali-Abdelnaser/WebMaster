import "./Timeline.css";

export default function Timeline({ data }) {
  return (
    <section className="timeline">
      <h2>Our Journey</h2>
      <div className="timeline-container">
        {data.map((item, i) => (
          <div key={i} className="timeline-item">
            <span className="year">{item.year}</span>
            <p>{item.event}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
