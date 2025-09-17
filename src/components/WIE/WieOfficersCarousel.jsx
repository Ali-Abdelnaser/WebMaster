import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/pagination";
import "./WieOfficersCarousel.css";
import officers from "../../data/wieOfficers.json";

const WieOfficersCarousel = () => {
  return (
    <section className="wie-officers-carousel">
      {/* Header */}
      <div className="wie-carousel-header">
        <h2 className="wie-carousel-title">WIE OFFICERS</h2>
        <img src="img/WIE/Wie-hr.svg" alt="Divider" className="wie-carousel-divider" />
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Pagination]}
        spaceBetween={45}
        slidesPerView={2}
        loop={false}
        centeredSlides={true}
        initialSlide={1}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 }
        }}
      >
        {officers.map((officer, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div className={`wie-officer-card ${isActive ? "active" : ""}`}>
                <div className="wie-officer-image-wrapper">
                  <img src={officer.img} alt={officer.name} />
                </div>
                <h3 className="wie-officer-name">{officer.name}</h3>
                <p className="wie-officer-role">{officer.role}</p>
                {isActive && officer.testimonial && (
                  <p className="wie-officer-testimonial">{officer.testimonial}</p>
                )}
                <div className="wie-officer-socials">
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

export default WieOfficersCarousel;
