import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./LogoAnimation.css";

export default function LogoAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timers = [];

    const runCycle = () => {
      setStep(0);

      // 1. بعد ثانية ونص النص يطلع
      timers.push(setTimeout(() => setStep(1), 1500));

      // 2. بعد 3 ثواني يغير اللون
      timers.push(setTimeout(() => setStep(2), 3000));

      // 3. يفضل ثابت (30 ثانية مثلاً)
      timers.push(setTimeout(() => setStep(3), 33000));

      // 4. النص يختفي
      timers.push(setTimeout(() => setStep(4), 34000));

      // 5. بعد ثانية يبدأ الرمز يصغر (ديلاي بعد النص)
      timers.push(setTimeout(() => setStep(5), 36000));

      // 6. بعد 10 ثواني إضافية يبدأ من الأول
      timers.push(setTimeout(runCycle, 40000));
    };

    runCycle();

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="logo-container">
      {/* الرمز */}
       <motion.img
        src="/logo/Shape-white.png"
        alt="Logo Symbol"
        className="logo-symbol"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: step >= 0 ? 1 : 0,
          scale:
            step === 5
              ? 0 // 👈 يصغر في آخر مرحلة
              : 1,
          x: step === 1 || step === 2 || step === 3 ? -130 : 0,
        }}
        transition={{ duration: 1.5 }}
      />

      {/* النص */}
      <motion.img
        src="/logo/text-white.svg"
        alt="Logo Text"
        className="logo-text"
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: step === 1 || step === 2 || step === 3 ? 1 : 0,
          x: step === 1 || step === 2 || step === 3 ? 135 : 0,
        }}
        transition={{ duration: 1.5 }}
      />
    </div>
  );
}
