import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Partners.css";
import partners from "../../data/partners.json"; // 👈 لو عندك JSON بره

export default function Partners() {
  return (
    <section className="partners-section">
      <h2 className="Home-title">Our Partners</h2>
      <img src="img/hr.svg" alt="Divider" className="partners-divider" />

      {/* 🖥️ Desktop & Tablet: صف واحد */}
      <div className="desktop-only">
        <Swiper
          modules={[Autoplay]}

          loop={true}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={4000}
          grabCursor={true}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 20 }, // موبايل صغير
            480: { slidesPerView: 3, spaceBetween: 25 }, // موبايل متوسط
            768: { slidesPerView: 4, spaceBetween: 30 }, // تابلت
            1024: { slidesPerView: 5, spaceBetween: 35 }, // ديسكتوب
          }}
        >
          {partners.map((p, i) => (
            <SwiperSlide key={`desk-${i}`}>
              <a href={p.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={p.img}
                  alt={`Partner ${i}`}
                  className="partner-logo"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
