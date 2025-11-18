import Tilt from "react-parallax-tilt";
import "./IEEEEgyptSection.css";
import data from "../../data/ieee-egypt-data.json";

const IEEEEgyptSection = () => (
  <section className="ieee-egypt-main-row">
    <div className="ieee-egypt-side-card">
      <img src={data.logo} alt="IEEE Egypt Logo" className="ieee-egypt-logo" />
      <h2 className="ieee-egypt-title">IEEE EGYPT SECTION</h2>
      <div className="ieee-egypt-about">{data.about}</div>
    </div>

    <div className="ieee-egypt-cards-scroll">
      <h2 className="ieee-egypt-title">{data.title}</h2>
      <div className="ieee-egypt-cards-row">
        {data.organizations.map((org, i) => (
          <Tilt
            key={i}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareColor="#027dcf"
            glarePosition="all"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            className="ieee-egypt-org-card"
          >
            <img src={org.image} alt={org.name} className="ieee-egypt-org-img" />
            <div className="ieee-egypt-org-name">{org.name}</div>
            <a className="ieee-egypt-readmore" href={org.readMoreUrl}           target="_blank"
          rel="noopener noreferrer">
              Read More{" "}<i className="fa fa-external-link-alt"></i>
            </a>
           
          </Tilt>
        ))}
      </div>
    </div>
  </section>
);

export default IEEEEgyptSection;
