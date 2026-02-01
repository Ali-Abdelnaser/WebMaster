import React, { useEffect, useState, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { motion } from 'framer-motion';
import { 
    FaShareAlt, FaCertificate, FaHome, FaUserEdit, FaDownload, 
    FaRocket, FaTools, FaCrown, FaBolt, FaBullseye, FaTrophy, FaRedo, FaMedal 
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const FinalDashboard = () => {
    const { userProfile, startGame, setCurrentStage, setGameState, startMarathon } = useQuiz();
    const [badges, setBadges] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [safePhotoURL, setSafePhotoURL] = useState(null);
    const cardRef = useRef(null);

    // Convert external image to Base64 to bypass CORS issues for canvas capture
    useEffect(() => {
        const convertToBase64 = async () => {
            const originalURL = userProfile?.photoURL || '/img/avatars/male1.png';
            
            // Try fetching first (works for local and CORS-enabled remote)
            try {
                const response = await fetch(originalURL, { mode: 'cors' });
                if (!response.ok) throw new Error('Fetch failed');
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => setSafePhotoURL(reader.result);
                reader.readAsDataURL(blob);
            } catch (err) {
                console.warn("Direct fetch failed, trying via Image element...", err);
                
                // Secondary attempt: Use Image element with Anonymous crossOrigin
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = originalURL;
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        setSafePhotoURL(canvas.toDataURL("image/png"));
                    } catch (e) {
                        console.error("Canvas draw failed (CORS):", e);
                        setSafePhotoURL(originalURL); // Last resort fallback
                    }
                };
                img.onerror = () => {
                    console.error("Image load failed altogether");
                    setSafePhotoURL(originalURL);
                };
            }
        };

        convertToBase64();
    }, [userProfile?.photoURL]);

    const totalBase = (userProfile?.stage1Score || 0) + (userProfile?.stage2Score || 0) + (userProfile?.stage3Score || 0);
    const totalBonus = (userProfile?.stage1Bonus || 0) + (userProfile?.stage2Bonus || 0) + (userProfile?.stage3Bonus || 0);
    const totalScore = totalBase + totalBonus;

    useEffect(() => {
        const earned = [];
        const s1 = userProfile?.stage1Score || 0;
        const s2 = userProfile?.stage2Score || 0;
        const s3 = userProfile?.stage3Score || 0;
        const b1 = userProfile?.stage1Bonus || 0;
        const b2 = userProfile?.stage2Bonus || 0;
        const b3 = userProfile?.stage3Bonus || 0;
        const totalBonus = b1 + b2 + b3;
        const totalBase = s1 + s2 + s3;

        // Performance & Skill Badges
        if (totalBase === 3000) {
            earned.push({ id: 'flawless', name: "Flawless", icon: <FaCrown />, flavor: "gold" });
        } else if (totalBase > 2500) {
            earned.push({ id: 'acc', name: "Sharpshooter", icon: <FaBullseye />, flavor: "silver" });
        }

        if (totalBonus > 1500) {
            earned.push({ id: 'speed', name: "Sonic", icon: <FaBolt />, flavor: "cyan" });
        }

        if (totalScore >= 6500) {
            earned.push({ id: 'titan', name: "IEEE Titan", icon: <FaTrophy />, flavor: "gold" });
        } else if (totalScore >= 5000) {
            earned.push({ id: 'elite', name: "Elite Agent", icon: <FaMedal />, flavor: "silver" });
        }

        // Always show at least one if they reached here
        if (earned.length === 0) {
            earned.push({ id: 'survivor', name: "Survivor", icon: <FaRocket />, flavor: "bronze" });
        }

        setBadges(earned);
    }, [totalScore, userProfile]);

    const handleDownloadImage = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 500));
        
        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                allowTaint: false,
                scale: 3, // Even higher resolution
                backgroundColor: '#020617',
                logging: false,
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `IEEE-MET-Achievement-${userProfile?.fullName || 'Winner'}.png`;
            link.click();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Could not generate image. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'IEEE MET SB Challenge Accomplishment',
            text: `🏆 I just conquered the IEEE MET SB Challenge with ${totalScore} points! Can you beat me? #IEEEMETSB #TechChallenge`,
            url: window.location.origin
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.text);
                alert("Achievement text copied to clipboard! 🚀");
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    const getRankClass = () => {
        if (userProfile?.rank === 1) return 'rank-card-gold shimmer-effect';
        if (userProfile?.rank === 2) return 'rank-card-silver';
        if (userProfile?.rank === 3) return 'rank-card-bronze';
        return '';
    };

    const getRankColor = () => {
        if (userProfile?.rank === 1) return '#FFD700';
        if (userProfile?.rank === 2) return '#C0C0C0';
        if (userProfile?.rank === 3) return '#CD7F32';
        return 'rgba(255,255,255,0.7)';
    };

    const getRankFlavor = () => {
        if (userProfile?.rank === 1) return 'gold';
        if (userProfile?.rank === 2) return 'silver';
        if (userProfile?.rank === 3) return 'bronze';
        return '';
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ maxWidth: '900px' }}
        >
            <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
            >
                <FaCertificate size={80} color="var(--gold)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(255,207,75,0.4))' }} />
            </motion.div>

            <h1 className="game-title">Mission Accomplished</h1>
            <p className="subtitle">You've successfully completed all IEEE MET SB challenge stages.</p>

            <div className={`share-card ${getRankClass()}`} ref={cardRef} style={{ 
                background: 'linear-gradient(135deg, #020617 0%, #002855 100%)', 
                padding: '40px', 
                borderRadius: '30px',
                margin: '2rem auto',
                maxWidth: '650px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                transition: 'all 0.5s ease'
            }}>
                {/* Rank Badge */}
                <div className="rank-badge-final" style={{ color: getRankColor(), borderColor: getRankColor() }}>
                    RANK #{userProfile?.rank || '---'}
                </div>

                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '1.5rem', textAlign: 'left' }}>Official Achievement Card</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '2.5rem' }}>
                        <div className="avatar-large" style={{ width: '110px', height: '110px', minWidth: '110px', flexShrink: 0, border: '4px solid rgba(255,255,255,0.2)', boxShadow: '0 0 30px rgba(0,0,0,0.3)' }}>
                            <img 
                                src={safePhotoURL || '/img/avatars/male1.png'} 
                                alt="Hero" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '5px' }}>{userProfile?.fullName}</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', opacity: 0.8 }}>{userProfile?.branch || 'IEEE MET SB Official'}</div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '2.5rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>TOTAL SCORE</div>
                            <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Orbitron' }}>{totalScore}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>GLOBAL RANK</div>
                            <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Orbitron' }}>#{userProfile?.rank || '---'}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>BADGES</div>
                            <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Orbitron' }}>{badges.length}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {badges.map((badge, i) => (
                            <motion.div 
                                key={badge.id}
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.6 + i * 0.1, type: 'spring', damping: 12 }}
                                className="scout-badge-wrapper"
                            >
                                <div className={`scout-badge ${badge.flavor}`}>
                                    {badge.icon}
                                </div>
                                <span className="scout-badge-name">{badge.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary-btn" 
                    onClick={handleShare}
                    style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <FaShareAlt /> Share Result
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary-btn" 
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                    <FaDownload /> {isGenerating ? 'Generating...' : 'Save as Image'}
                </motion.button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="secondary-btn" 
                    onClick={() => setGameState('auth')}
                    style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <FaUserEdit /> Edit Identity
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="secondary-btn" 
                    onClick={() => setGameState('entry')}
                    style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <FaHome /> Master Hall
                </motion.button>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
                    
                    {/* Replay Stages */}
                    <div>
                        <h3 style={{ marginBottom: '1.2rem', fontSize: '0.9rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic Replay</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {[1, 2, 3].map(s => (
                                <motion.button 
                                    key={s} 
                                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }}
                                    className="secondary-btn" 
                                    onClick={() => { setCurrentStage(s); startGame(); }}
                                    style={{ padding: '0.8rem 1.2rem', fontSize: '0.85rem' }}
                                >
                                     Phase {s}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Full Operations */}
                    <div>
                        <h3 style={{ marginBottom: '1.2rem', fontSize: '0.9rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>System Operations</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                             <motion.button 
                                whileHover={{ scale: 1.05, background: 'var(--primary-glow)' }}
                                className="primary-btn" 
                                onClick={startMarathon}
                                style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', flex: 1 }}
                            >
                                <FaRedo /> Start Marathon Mode
                            </motion.button>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default FinalDashboard;
