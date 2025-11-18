import { useState } from "react";
import data from "../../data/ieeePageData.json";
import "./ieeeSection.css";

export default function IEEESection() {
  const items = data.ieeesection.ieeeTopics;
  const details = data.ieeesection.ieeeDetails;
  const [selected, setSelected] = useState(items[0].id);

  const curr = details[selected];

  function renderAboutCard() {
    return (
      <div className="ieee-details ieee-details-about">
        {curr.tagline && <div className="tagline">{curr.tagline}</div>}
        <p>{curr.description}</p>
        <div className="about-row">
          <div className="about-facts">
            <ul>
              {curr.facts.map((fact, idx) => (
                <li key={idx}>
                  <i className={`fa ${fact.icon}`}></i> {fact.text}
                </li>
              ))}
            </ul>
          </div>
          {curr.image && (
            <img src={curr.image} alt={curr.title} className="main-img" />
          )}
        </div>
        {curr.highlights && (
          <div className="about-highlights">
            {curr.highlights.map((item, idx) => (
              <div key={idx} className="about-highlight-card">
                <i className={`fa ${item.icon}`}></i>
                <strong>{item.heading}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
        {curr.website && (
          <a
            className="ieee-link"
            href={curr.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more from official website{" "}
            <i className="fa fa-external-link-alt"></i>
          </a>
        )}
      </div>
    );
  }
  function rendersitesCard() {
    return (
      <div className="ieee-details ieee-details-sites">
        <div className="sites-main-title">Main IEEE Websites</div>
        <div className="ieee-sites-rows">
          {curr.sites.map((site) => (
            <div className="ieee-site-row" key={site.id}>
              <div className="site-img-box">
                <img src={site.img} alt={site.name} className="site-img" />
              </div>
              <div className="site-info">
                <i className={`fa ${site.icon} main-icon`}></i>
                <div className="site-title">{site.name}</div>
                <div className="site-desc">{site.desc}</div>
                <div className="site-imp">{site.importance}</div>
                <a
                  className="site-link"
                  href={site.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More <i className="fa fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function renderHistoryCard() {
    return (
      <div className="ieee-details ieee-details-history">
        <div className="history-headline">{curr.headline}</div>
        <p>{curr.description}</p>
        <div className="timeline-modern">
          {curr.timeline.map((ev, idx) => (
            <div key={idx} className="timeline-step">
              <div className="icon-circle">
                <i className={`fa ${ev.icon}`}></i>
              </div>
              <div className="timeline-step-content">
                <strong>{ev.year}</strong> <small>{ev.event}</small>
                <p>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          className="ieee-link"
          href={curr.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more from official website{" "}
          <i className="fa fa-external-link-alt"></i>
        </a>
      </div>
    );
  }
  function renderDefaultCard() {
    return (
      <div className={`ieee-details ieee-details-${curr.id}`}>
        {curr.description && <p>{curr.description}</p>}

        {curr.points && (
          <ul>
            {curr.points.map((point, idx) => (
              <li key={idx}>
                <i
                  className={`fa ${point.icon || "fa-check"}`}
                  style={point.color ? { color: point.color } : {}}
                />
                {point.text || point}
              </li>
            ))}
          </ul>
        )}

        {curr.image && (
          <img src={curr.image} alt={curr.title} className="main-img" />
        )}
      </div>
    );
  }
  function rendermembershipCard() {
    return (
      <div className="ieee-details ieee-details-membership">
        <div className="card-title">{curr.title}</div>
        <div className="membership-desc">{curr.description}</div>
        <ul className="membership-benefits">
          {curr.benefits.map((benefit, idx) => (
            <li key={idx}>
              <i className="fa fa-check-circle benefit-icon"></i> {benefit}
            </li>
          ))}
        </ul>
        <a
          className="membership-link"
          href={curr.joinLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join IEEE Now <i className="fa fa-arrow-circle-right"></i>
        </a>
      </div>
    );
  }
  function renderCard() {
    switch (curr.cardType) {
      case "about":
        return renderAboutCard();
      case "history":
        return renderHistoryCard();
      case "numbers":
        return renderNumbersCard();
      case "sites":
        return rendersitesCard();
      case "membership":
        return rendermembershipCard();
      default:
        return renderDefaultCard();
    }
  }
  return (
    <section className="ieee-section-cards">
      <div className="ieee-side-bar">
        {items.map((item) => (
          <div
            key={item.id}
            className={`ieee-side-item${
              selected === item.id ? " selected" : ""
            }`}
            onClick={() => setSelected(item.id)}
          >
            <i className={`fa ${item.icon}`}></i>
            <div>
              <div className="item-label">{item.label}</div>
              <div className="item-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ieee-main-content">
        <div className="ieee-content-row">
          <div className={`ieee-details ieee-details-${curr.id}`}>
            {renderCard()}
          </div>
        </div>
      </div>

    </section>
  );
}
