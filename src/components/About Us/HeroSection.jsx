import "./HeroSection.css";

export default function HeroSection({ data }) {
  return (
    <section className="about-hero-section">
      <div className="about-hero-overlay">
        <h1>{data.title}</h1>
        <p>{data.subtitle}</p>
      </div><img
          src={data.background}
          alt={data.title}
          className="about-hero-img"
        />
    </section>
  );
}
