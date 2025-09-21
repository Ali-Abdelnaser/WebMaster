import "./CallToAction.css";

export default function CallToAction({ data }) {
  return (
    <section className="cta-section">
      <h2>{data.text}</h2>
      <a href={data.link} className="cta-btn">
        {data.buttonText}
      </a>
    </section>
  );
}
