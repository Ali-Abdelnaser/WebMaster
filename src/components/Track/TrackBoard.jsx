import { memo } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./TrackBoard.css";
import trackBoardsData from "../../data/trackBoards.json";

export default memo(function TrackBoard({ trackName }) {
  const boardData = trackBoardsData[trackName];

  if (!boardData) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
      rotateX: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 0.6
      }
    },
  };

  return (
    <section className="track-board-section">
      <div className="track-board-container">
        <motion.div
          className="track-board-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="track-board-title">Track Board</h2>
         <p className="track-board-subtitle">Meet the amazing team leading this track</p>
        </motion.div>

        <motion.div
          className="track-board-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Head */}
          <motion.div
            className="track-board-head-card"
            variants={cardVariants}
          >
            <div className="track-board-card-inner">
              <div className="track-board-image-wrapper track-board-head-image">
                <div className="track-board-image-glow"></div>
                <img src={boardData.head.image} alt={boardData.head.name} />
              </div>
              <div className="track-board-info">
                <h3 className="track-board-name">{boardData.head.name}</h3>
                <p className="track-board-position">{boardData.head.position}</p>
                <div className="track-board-socials">
                  {boardData.head.linkedin && (
                    <a
                      href={boardData.head.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-board-social-link"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {boardData.head.email && (
                    <a
                      href={`mailto:${boardData.head.email}`}
                      className="track-board-social-link"
                    >
                      <FaEnvelope />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vice & Members Grid */}
          <div className="track-board-grid">
            {/* Vice */}
            {boardData.vice.map((vice, idx) => (
              <motion.div
                key={`vice-${idx}`}
                className="track-board-card track-board-vice-card"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
              >
                <div className="track-board-card-inner">
                  <div className="track-board-image-wrapper">
                    <div className="track-board-image-glow"></div>
                    <img src={vice.image} alt={vice.name} />
                  </div>
                  <div className="track-board-info">
                    <h3 className="track-board-name">{vice.name}</h3>
                    <p className="track-board-position">{vice.position}</p>
                    <div className="track-board-socials">
                      {vice.linkedin && (
                        <a
                          href={vice.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="track-board-social-link"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {vice.email && (
                        <a
                          href={`mailto:${vice.email}`}
                          className="track-board-social-link"
                        >
                          <FaEnvelope />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Members */}
            {boardData.members.map((member, idx) => (
              <motion.div
                key={`member-${idx}`}
                className="track-board-card track-board-member-card"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
              >
                <div className="track-board-card-inner">
                  <div className="track-board-image-wrapper">
                    <div className="track-board-image-glow"></div>
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="track-board-info">
                    <h3 className="track-board-name">{member.name}</h3>
                    <p className="track-board-position">{member.position}</p>
                    <div className="track-board-socials">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="track-board-social-link"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="track-board-social-link"
                        >
                          <FaEnvelope />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
