// src/components/about/ImageSwiper.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./ImageSwiper.css";

export default function ImageSwiper({ images }) {
  return (
    <div className="title">
      <h2 className="Home-title">OUR GALLARY</h2>
      <img src="img/hr.svg" alt="Divider" className="partners-divider" />
      <section className="image-swiper-section">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10} // مفيش فواصل بين الصور
          // عدد الصور اللي يبانوا في نفس الوقت (هنظبطه بالـ CSS)
          loop={true}
          autoplay={{
            delay: 0, // مفيش توقف
            disableOnInteraction: false,
          }}
          speed={3000} // السرعة (كل ما تقل الرقم الصور تسرع)
          allowTouchMove={false}
          breakpoints={{
            0: { slidesPerView: 2 }, // موبايل صغير // موبايل متوسط
            768: { slidesPerView: 3 }, // تابلت // ديسكتوب
          }} // المستخدم مش يقدر يوقف أو يسحب
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img.src} alt={img.alt || `slide-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
