import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaBolt, FaShieldAlt, FaRocket, FaTerminal } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizPromo.css';

const QuizPromo = () => {
    const navigate = useNavigate();

    return (
        <section className="quiz-promo-section">
            {/* Background Architecture */}
            <div className="quiz-promo-grid"></div>
            
            {/* HUD Decorative Elements */}
            <motion.div 
                animate={{ y: [0, -20, 0], rotate: [-15, -12, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="hud-element hud-1"
            ></motion.div>
            
            <motion.div 
                animate={{ y: [0, 15, 0], rotate: [10, 12, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="hud-element hud-2"
            ></motion.div>

            <motion.div 
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="hud-element hud-3"
            >
                <div style={{ padding: '8px', color: '#00d2ff', fontSize: '0.7rem', fontWeight: 600 }}>SYSTEM_LEVEL: [OMEGA]</div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="quiz-promo-card"
            >
                <div className="promo-tagline">
                    <FaBolt /> OPERATIONAL INTEL <FaBolt />
                </div>
                
                <h2 className="promo-title">
                    The <span>IEEE MET SB</span> Challenge
                </h2>
                
                <p className="promo-desc">
                    Ignite your cognitive pathways. Master 3 tactical phases, decrypt complex challenges, 
                    and secure your legacy on the global leaderboard.
                </p>
                
                <div className="promo-features">
                    <motion.div className="feature-pill" whileHover={{ scale: 1.05 }}>
                        <FaShieldAlt style={{ color: '#00d2ff' }} />
                        <span>Advanced Security</span>
                    </motion.div>
                    
                    <motion.div className="feature-pill" whileHover={{ scale: 1.05 }}>
                        <FaTrophy style={{ color: '#ffcf4b' }} />
                        <span>Rank Recognition</span>
                    </motion.div>

                    <motion.div className="feature-pill" whileHover={{ scale: 1.05 }}>
                        <FaTerminal style={{ color: '#bd93f9' }} />
                        <span>Tactical Interface</span>
                    </motion.div>
                </div>
                
                <motion.button 
                    onClick={() => navigate('/quiz')}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,210,255,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="launch-button"
                >
                    <FaRocket style={{ marginRight: '15px' }} />
                    START MISSION
                </motion.button>
            </motion.div>
        </section>
    );
};

export default QuizPromo;

