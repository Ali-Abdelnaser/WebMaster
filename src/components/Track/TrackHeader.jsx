import { motion } from "framer-motion";
import "./TrackHeader.css";

export default function TrackHeader({ image, name }) {
  return (
    <section className="track-hero-section">
      {/* Gradient Overlay */}
      <div className="track-hero-overlay"></div>
      
      {/* Floating Particles */}
      <div className="track-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="track-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated Background Shapes */}
      <div className="track-hero-shapes">
        <motion.div
          className="track-shape track-shape-1"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="track-shape track-shape-2"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="track-shape track-shape-3"
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0],
            rotate: [0, -180, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="track-hero-content">
        <motion.div
          className="track-hero-image-wrapper"
          initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotateY: 0,
            rotateZ: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 50,
            rotateZ: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.05,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
        >
          <div className="track-image-glow"></div>
          <motion.img 
            src={image} 
            alt={name} 
            className="track-hero-image"
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(250, 164, 26, 0.4))",
                "drop-shadow(0 0 40px rgba(250, 164, 26, 0.6))",
                "drop-shadow(0 0 20px rgba(250, 164, 26, 0.4))"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Floating Rings */}
          <motion.div
            className="track-ring track-ring-1"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          <motion.div
            className="track-ring track-ring-2"
            animate={{
              rotate: -360,
              scale: [1, 0.9, 1]
            }}
            transition={{
              rotate: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>

        <motion.h1
          className="track-hero-title"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.span 
            className="track-title-main"
            animate={{
              backgroundPosition: ["0% center", "200% center", "0% center"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {name}
          </motion.span>
          <motion.span 
            className="track-title-sub"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Track
          </motion.span>
        </motion.h1>

        <motion.div
          className="track-hero-badge"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0]
          }}
          transition={{ 
            delay: 0.6, 
            type: "spring",
            stiffness: 200,
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 30px rgba(250, 164, 26, 0.6)",
            transition: { duration: 0.3 }
          }}
        >
          <motion.span
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Explore & Learn
          </motion.span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="track-scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="track-scroll-arrow"></div>
      </motion.div>
    </section>
  );
}
