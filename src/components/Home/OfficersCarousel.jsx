import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/pagination";
import "./OfficersCarousel.css";
import officers from "../../data/officers.json";

const OfficersCarousel = () => {
  return (
    <section className="executive-officers-carousel">
      {/* Header */}
      <div className="carousel-header">
        <h2 className="carousel-title">EXECUTIVE OFFICERS</h2>
        <img src="img/hr.svg" alt="Divider" className="carousel-divider" />
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Pagination]}
        spaceBetween={45}
        slidesPerView={3}
        loop={true}
        centeredSlides={true}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 }
        }}
      >
        {officers.map((officer, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div className={`officer-card ${isActive ? "active" : ""}`}>
                <div className="officer-image-wrapper">
                  <img src={officer.img} alt={officer.name} />
                </div>
                <h3 className="officer-name">{officer.name}</h3>
                <p className="officer-role">{officer.role}</p>
                {isActive && officer.testimonial && (
                  <p className="officer-testimonial">{officer.testimonial}</p>
                )}
                <div className="officer-socials">
                  {officer.linkedin && (
                    <a href={officer.linkedin} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                  {officer.email && officer.email !== "#" && (
                    <a href={`mailto:${officer.email}`} target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-envelope"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OfficersCarousel;
