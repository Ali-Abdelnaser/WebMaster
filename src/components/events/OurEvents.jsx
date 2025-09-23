import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import events from "../../data/events.json";
import "./OurEvents.css";

export default function OurEvents() {
  return (
    <section className="our-events-section">
      <div className="our-events-header">
        <h2 className="Home-title">Latest Events</h2>
        <img src="img/hr.svg" alt="Divider" className="HR-divider" />
        <p className="our-events-description">
          Explore our previous and upcoming events — knowledge, networking, and
          inspiration all in one place.
        </p>
      </div>

      <div className="our-events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            {/* Swiper for images */}
            <div className="event-image-wrapper">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                className="event-swiper"
              >
                {event.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`${event.title}-${index}`}
                      className="event-img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Event Info */}
            <div className="event-info">
              <h2>{event.title}</h2>
              <hr className="event-divider" />
              <div className="event-meta">
                <p className="event-date">
                  <i className="far fa-calendar-alt"></i> {event.date}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
              </div>
              <p className="event-desc">{event.description}</p>

              <p className="event-readmore">Read more about event</p>

              <div className="social-links">
                {event.socials?.facebook && (
                  <a
                    href={event.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {event.socials?.instagram && (
                  <a
                    href={event.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {event.socials?.linkedin && (
                  <a
                    href={event.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
