import { motion } from "framer-motion";
import Header from "../Header";
import Footer from "../Footer";
import AnimatedBackground3D from "./AnimatedBackground";
import "./Instructions.css";

export default function JoinUsInstructions({ onStart }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35, // زيادة المدة بين ظهور العناصر
        delayChildren: 0.3, // زيادة البداية لتكون أنعم
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 50, // أخف من 80 -> أبطأ حركة الارتداد
        damping: 20, // أخف damping -> حركة أبطأ وأقل حدة
        mass: 1.2, // تزيد شعور بالثقل
      },
    },
  };

  return (
    <motion.div
      className="instructions-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />
      <AnimatedBackground3D />

      <main className="instructions-container">
        <motion.div className="instructions-content" variants={itemVariants}>
          <div className="instructions-text">
            <motion.div
              className="instructions-illustration"
              variants={itemVariants}
            >
              <img src="/img/Instructions.svg" alt="Instructions" />
            </motion.div>
            <motion.h1 className="instructions-title" variants={itemVariants}>
              Welcome to <span>IEEE MET SB Recruitment</span> 🚀
            </motion.h1>

            <motion.p className="instructions-subtitle" variants={itemVariants}>
              Before you start your application, please take a moment to read
              these instructions carefully. This will ensure your application
              process goes smoothly and that you don’t miss any important
              details.
            </motion.p>

            <motion.ul className="instructions-list" variants={itemVariants}>
              <motion.li variants={itemVariants}>
                Fill out all required fields accurately.
              </motion.li>
              <motion.li variants={itemVariants}>
                Use a valid email address so we can contact you.
              </motion.li>
              <motion.li variants={itemVariants}>
                Take your time — you can always come back and continue.
              </motion.li>
              <motion.li variants={itemVariants}>
                Once submitted, you won’t be able to edit your answers.
              </motion.li>
            </motion.ul>

            <motion.div
              className="job-description-section"
              variants={itemVariants}
            >
              <h2 className="job-title">📄 Job Description</h2>
              <p className="job-text">
                To make the best of your application, please{" "}
                <strong className="Strong-text">
                  read the Job Description
                </strong>{" "}
                carefully before starting. It will help you understand the
                roles, expectations, and responsibilities.
              </p>
              <button
                className="job-btn"
                onClick={() =>
                  window.open(
                    "https://exciting-anaconda-240.notion.site/Executive-Job-Description-27d3069a395880b2945ae68983297015?source=copy_link",
                    "_blank"
                  )
                }
              >
                View Job Description
              </button>
            </motion.div>

            <h3
              class="deadline deadline--urgent"
              aria-label="Deadline: 05 October"
            >
              <span class="deadline__label">Deadline Form</span>
              <span class="deadline__date">05 / 10</span>
            </h3>

            <motion.button
              className="instructions-start-btn"
              variants={itemVariants}
              onClick={() => {
                localStorage.setItem("showInstructions", "false");
                onStart();
              }}
            >
              Go to Form
            </motion.button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
