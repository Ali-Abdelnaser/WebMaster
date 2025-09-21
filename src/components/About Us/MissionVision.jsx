import "./MissionVision.css";

export default function MissionVision({ data }) {
  return (
    <section className="mission-vision">
      <div className="mission">
        <h2>Our Mission</h2>
        <p>{data.mission}</p>
      </div>
      <div className="vision">
        <h2>Our Vision</h2>
        <p>{data.vision}</p>
      </div>
    </section>
  );
}
