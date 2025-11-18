import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";
import { useCallback, useMemo } from "react";

export default function HeroBackground({ style }) {
  const particlesInit = useCallback(async (engine) => {
    await loadLinksPreset(engine);
  }, []);

  // قوم بتحديد الـ options حسب حجم الشاشة
  const particleOptions = useMemo(() => {
    const width = window.innerWidth;
    if (width <= 700) {
      // موبايل
      return {
        preset: "links",
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          color: { value: "#007BFF" },
          links: {
            color: "#ffffff",
            distance: 85,
            enable: true,
            opacity: 0.13,
            width: 1.2,
          },
          move: { enable: true, speed: 0.7 },
          number: { value: 300 },     // أقل عدد للموبايل
          size: { value: 1.5 },
          opacity: { value: 0.7 }
        }
      };
    }
    if (width <= 1024) {
      // تابلت
      return {
        preset: "links",
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          color: { value: "#007BFF" },
          links: {
            color: "#ffffff",
            distance: 120,
            enable: true,
            opacity: 0.17,
            width: 2.0,
          },
          move: { enable: true, speed: 2 },
          number: { value: 350 },    // متوسط للتابلت
          size: { value: 2.3 },
          opacity: { value: 0.85 }
        }
      };
    }
    // ديسكتوب
    return {
      preset: "links",
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        color: { value: "#007BFF" },
        links: {
          color: "#ffffff",
          distance: 140,
          enable: true,
          opacity: 0.2,
          width: 2.6,
        },
        move: { enable: true, speed: 1.5 },
        number: { value: 400 },      // الأعلى للديسكتوب
        size: { value: 4 },
        opacity: { value: 1 }
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,       // عالج inset بدلاً من inset:1
        zIndex: 1,
        pointerEvents: "none",
        ...style
      }}
    >
      <Particles
        id="hero-bg"
        init={particlesInit}
        options={particleOptions}
      />
    </div>
  );
}
