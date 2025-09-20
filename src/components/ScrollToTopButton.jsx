import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa"; // 👈 أيقونة سهم
import "./ScrollToTopButton.css";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 👀 متابعة الاسكرول
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        // يظهر بعد 400px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⬆️ وظيفة الصعود لفوق
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
}
