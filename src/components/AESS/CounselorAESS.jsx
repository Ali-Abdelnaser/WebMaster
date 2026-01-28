import React from 'react';
import './CounselorAESS.css';
import { FaLinkedin, FaWhatsapp, FaEnvelope, FaFingerprint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import aessData from "../../data/aessData.json";

export default function CounselorAESS() {
    const { counselor } = aessData;

    return (
        <section className="aess-terminal-section">
            <div className="terminal-bg-glow"></div>
            
            <motion.div 
                className="terminal-header"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="terminal-status">
                    <span className="status-dot"></span>
                    SECURE_ACCESS: GRANTED
                </div>
                <div className="terminal-path">ARCHIVE / PERSONNEL / {counselor.name.toUpperCase().replace(' ', '_')}</div>
            </motion.div>

            <div className="terminal-container">
                {/* Left Side: The Visual Identity */}
                <div className="terminal-visual-side">
                    <motion.div 
                        className="profile-frame"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="frame-corners">
                            <span></span><span></span><span></span><span></span>
                        </div>
                        <div className="img-wrapper">
                            <div className="scan-overlay"></div>
                            <img 
                                src={counselor.img} 
                                alt={counselor.name} 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
                                }}
                            />
                        </div>
                        <div className="biometric-tag">
                            <FaFingerprint /> BIOMETRIC_ID: VERIFIED
                        </div>
                    </motion.div>

                    <div className="quick-stats-sidebar">
                        {counselor.stats.map((stat, idx) => (
                            <motion.div 
                                className="stat-module" 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                            >
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-value">{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: The Detailed Intel */}
                <div className="terminal-content-side">
                    <motion.div 
                        className="info-header"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <span className="info-role">{counselor.role}</span>
                        <h2 className="info-name">{counselor.name}</h2>
                        <div className="info-rank-bar">
                            <span className="rank-text">{counselor.title}</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="info-bio-box"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bio-label">BIO_INTELLIGENCE:</div>
                        <p className="bio-text">{counselor.bio}</p>
                    </motion.div>

                    <motion.div 
                        className="info-actions"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="action-label">COMMUNICATION_CHANNELS:</div>
                        <div className="btns-wrapper">
                            <a href={counselor.social.linkedin} target="_blank" rel="noreferrer" className="tech-btn">
                                <span className="btn-glitch"></span>
                                <FaLinkedin /> LINKEDIN
                            </a>
                            <a href={counselor.social.whatsapp} target="_blank" rel="noreferrer" className="tech-btn whatsapp">
                                <FaWhatsapp /> WHATSAPP
                            </a>
                            <a href={`mailto:${counselor.social.email}`} className="tech-btn email">
                                <FaEnvelope /> EMAIL
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
