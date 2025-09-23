import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./ImageSwiper.css";
import { useState } from "react";

function LazyPartnerImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="partner-lazy-wrapper">
      <img
        src={src}
        alt={alt}
        className={`partner-lazy-image ${loaded ? "loaded" : ""}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <div className="partner-lazy-placeholder"></div>}
    </div>
  );
}

export default function ImageSwiper({ images }) {
  return (
    <div className="title">
      <h2 className="Home-title">OUR GALLARY</h2>
      <img src="img/hr.svg" alt="Divider" className="partners-divider" />
      <section className="image-swiper-section">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          allowTouchMove={false}
          breakpoints={{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <LazyPartnerImage
                src={img.src}
                alt={img.alt || `slide-${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
