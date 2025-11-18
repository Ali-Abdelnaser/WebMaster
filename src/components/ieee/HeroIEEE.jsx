import React, { useRef, useEffect, useState } from "react";
import anime from "animejs";
import HeroBackground from "./HeroBackground";
import "./HeroIEEE.css";

const letters = "IEEE".split("");
const words = ["Institute", "Electrical", "Electronics", "Engineers"];

export default function HeroIEEE() {
  const lettersRefs = letters.map(() => useRef(null));
  const wordsRefs = words.map(() => useRef(null));
  const [showWordIdx, setShowWordIdx] = useState(-1);
  const [showSentence, setShowSentence] = useState(false);

  useEffect(() => {
    let timers = [];
    for (let i = 0; i < 4; i++) {
      timers.push(
        setTimeout(() => {
          setShowWordIdx(i);
          anime({
            targets: lettersRefs[i].current,
            scale: [1, 1.48],
            color: ["#004B8DFF", "#004B8DFF", "#ffffff"],
            duration: 520,
            easing: "easeOutElastic(1, .7)",
          });

          anime({
            targets: wordsRefs[i].current,
            opacity: [0, 1],
            translateY: [-22, 0],
            duration: 520,
            easing: "easeOutQuad",
          });
        }, i * 1200 + 900)
      );
    }

    timers.push(
      setTimeout(() => {
        setShowSentence(true);
        for (let i = 0; i < 4; i++) {
          anime({
            targets: wordsRefs[i].current,
            opacity: 0,
            duration: 480,
            delay: 120 * i,
            easing: "easeInOutQuad",
          });
        }
      }, 4 * 1200 + 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="ieee-hero-v2">
      <HeroBackground />
      <div className="ieee-hero-content-v2">
        <div className="ieee-letters-row">
          {letters.map((char, i) => (
            <span key={i} ref={lettersRefs[i]} className="ieee-letter">
              {char}
            </span>
          ))}
        </div>

        <div className="ieee-words-row">
          {words.map((word, i) => (
            <span
              key={i}
              ref={wordsRefs[i]}
              className={`ieee-word ${showWordIdx === i ? "show" : ""}`}
              style={{ opacity: 0 }}
            >
              <span className="ieee-word-first">{word[0]}</span>
              {word.slice(1)}
            </span>
          ))}
        </div>
        {showSentence && (
          <span className="ieee-meaning-main ieee-sentence-show">
            Institute of Electrical and Electronics Engineers
          </span>
        )}
      </div>
    </section>
  );
}
