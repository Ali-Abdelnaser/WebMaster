import { useEffect, useState, useRef } from "react";
import "./StatsSection.css";

function Counter({ target, label, icon, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return; // مش هيبدأ يعد غير لما يكون ظاهر

    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    let duration = 2000; // 2 ثانية
    let stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, inView]);

  return (
    <div className="stat-card">
      <i className={icon}></i>
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  );
}

export default function StatsSection({ stats }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect(); // يشتغل مرة واحدة بس
        }
      },
      { threshold: 0.3 } // يبدأ يعد لما 30% من السيكشن يظهر
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <h2 className="Home-title">OUR NUMBERS</h2>
      <img src="img/hr.svg" alt="Divider" className="stats-divider" />

      <div className="stats-container">
        {stats.map((item, index) => (
          <Counter
            key={index}
            target={item.number}
            label={item.label}
            icon={item.icon}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}
