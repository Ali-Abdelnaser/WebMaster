import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={event.images.length > 1}
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

      <div className="event-info">
        <h2>{event.title}</h2>
        <hr className="event-divider" />
        <div className="event-meta">
          <p className="event-date">
            <i className="far fa-calendar-alt"></i> {event.date}
          </p>
          {event.location && (
            <p className="event-location">
              <i className="fas fa-map-marker-alt"></i> {event.location}
            </p>
          )}
        </div>
        <p className="event-desc">{event.description}</p>
        
        {event.socials && (
          <div className="social-links">
            {event.socials.facebook && (
              <a
                href={event.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {event.socials.instagram && (
              <a
                href={event.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {event.socials.linkedin && (
              <a
                href={event.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
