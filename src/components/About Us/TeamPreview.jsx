import "./TeamPreview.css";

export default function TeamPreview({ data }) {
  return (
    <section className="team-preview">
      <h2>{data.title}</h2>
      <a href={data.link} className="team-btn">See Full Team</a>
    </section>
  );
}
