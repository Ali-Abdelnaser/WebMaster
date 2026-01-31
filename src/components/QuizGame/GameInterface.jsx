import React, { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { getQuestionsForStage } from '../../data/quizData';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBolt, FaLightbulb, FaForward, FaMinusCircle, FaPause, FaPlay, FaSignOutAlt } from 'react-icons/fa';

// --- Improved Sound Utility ---
const playSound = (type, timeLeftVal) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime);

    const now = ctx.currentTime;

    if (type === 'correct') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
        osc2.frequency.setValueAtTime(659.25, now); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.3, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc1.connect(g);
        osc2.connect(g);
        g.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);

    } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        ctx.resume(); // Ensure audio context is active
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(350, now); 
        osc.frequency.linearRampToValueAtTime(150, now + 0.5);

        g.gain.setValueAtTime(0.4, now); 
        g.gain.linearRampToValueAtTime(0.01, now + 0.5);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.5);

    } else if (type === 'timeout') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
        
        g.gain.setValueAtTime(0.3, now);
        g.gain.linearRampToValueAtTime(0.01, now + 0.8);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.8);

    } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(timeLeftVal < 5 ? 1200 : 800, now);
        
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
    }
};

const TIMER_DURATION = 20; // Faster for excitement

const GameInterface = () => {
    const { 
        currentStage, 
        setGameState, 
        stageScore, 
        setStageScore, 
        confidenceBonus, 
        setConfidenceBonus,
        lifelines,
        setLifelines,
        userProfile,
        quitStage,
        showConfirm
    } = useQuiz();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [removedOptions, setRemovedOptions] = useState([]);
    const [warningMsg, setWarningMsg] = useState('');

    const timerRef = useRef(null);

    useEffect(() => {
        const q = getQuestionsForStage(currentStage);
        setQuestions(q);
        setCurrentIndex(0);
    }, [currentStage]);

    useEffect(() => {
        if (isAnswered || isPaused) return;
        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        if (timeLeft < 5) playSound('tick', timeLeft);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft, isAnswered, isPaused]);

    useEffect(() => {
        const handleBlur = () => {
             setWarningMsg("⚠️ Stay in the zone! Game fairness is tracked.");
             setTimeout(() => setWarningMsg(''), 4000);
        };
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, []);

    const currentQuestion = questions[currentIndex];

    const handleTimeUp = () => {
        setIsAnswered(true);
        playSound('timeout');
        setTimeout(nextQuestion, 1500);
    };

    const handleAnswer = (option) => {
        if (isAnswered) return;
        setIsAnswered(true);
        setSelectedOption(option);

        const isCorrect = option === currentQuestion.correct;
        if (isCorrect) {
            playSound('correct');
            const basePoints = 100;
            // Higher bonus for faster answers
            const timeBonus = Math.floor((timeLeft / TIMER_DURATION) * 80); 
            
            setStageScore(prev => prev + basePoints);
            setConfidenceBonus(prev => prev + timeBonus);
        } else {
            playSound('wrong');
        }

        setTimeout(nextQuestion, 1500);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(TIMER_DURATION);
            setIsAnswered(false);
            setSelectedOption(null);
            setRemovedOptions([]);
        } else {
            setGameState('interStage');
        }
    };

    const useRemoveTwo = () => {
        if (!lifelines.removeTwo || isAnswered) return;
        setLifelines(prev => ({ ...prev, removeTwo: false }));
        const incorrect = currentQuestion.options.filter(o => o !== currentQuestion.correct);
        setRemovedOptions(incorrect.slice(0, 2));
    };

    const useSkip = () => {
        if (!lifelines.skip || isAnswered) return;
        setLifelines(prev => ({ ...prev, skip: false }));
        nextQuestion();
    };

    const useHint = () => {
        if (!lifelines.hint || isAnswered || isPaused) return;
        setLifelines(prev => ({ ...prev, hint: false }));
        // Highlight one incorrect answer
        const incorrect = currentQuestion.options.filter(o => o !== currentQuestion.correct && !removedOptions.includes(o));
        setRemovedOptions(prev => [...prev, incorrect[0]]);
    };

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            return;
        }
        if (!lifelines.pause || isAnswered) return;
        setLifelines(prev => ({ ...prev, pause: false }));
        setIsPaused(true);
    };

    const handleExit = () => {
        showConfirm({
            title: 'TERMINATE MISSION?',
            message: 'Are you sure you want to exit?',
            type: 'danger',
            confirmText: 'TERMINATE',
            cancelText: 'RESUME',
            onConfirm: () => quitStage()
        });
    };

    const getLifelineStyle = (type) => ({
        ...lifelineStyle,
        opacity: !lifelines[type] && !isPaused ? 0.3 : (isPaused && type !== 'pause' ? 0.5 : 1),
        cursor: (!lifelines[type] && !isPaused) || (isAnswered) ? 'not-allowed' : 'pointer',
        filter: !lifelines[type] && !isPaused ? 'grayscale(1)' : 'none',
        pointerEvents: isAnswered || (isPaused && type !== 'pause') ? 'none' : 'auto',
        transform: !lifelines[type] && !isPaused ? 'scale(0.9)' : 'scale(1)',
        border: (type === 'pause' && isPaused) ? '2px solid var(--accent-cyan)' : '1px solid var(--glass-border)'
    });

    if (!currentQuestion) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ maxWidth: '1000px', padding: '2.5rem' }}
        >
            <AnimatePresence>
                {warningMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ color: 'var(--gold)', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}
                    >
                        {warningMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Header Stats */}
            <div className="header-stats">
                <div className="stat-group">
                    <div className="stat-pill">
                        <span style={{ opacity: 0.5 }}>PHASE</span>
                        <span className="value">{currentStage}</span>
                    </div>
                    <div className="stat-pill">
                        <span style={{ opacity: 0.5 }}>TASK</span>
                        <span className="value">{currentIndex + 1}<span style={{ fontSize: '0.7em', opacity: 0.4 }}>/{questions.length}</span></span>
                    </div>
                </div>
                
                <div className="stat-group">
                    <div className="stat-pill points">
                        <FaBolt size={14} />
                        <span className="value">{stageScore}</span>
                    </div>
                    <div className="stat-pill bonus">
                        <FaLightbulb size={14} />
                        <span className="value">+{confidenceBonus}</span>
                    </div>
                    <button onClick={handleExit} className="exit-btn-tech" title="Abort Mission">
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>

            {/* Circular Tech Timer */}
            <div className={`tech-timer ${timeLeft < 5 ? 'warning' : ''}`}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <motion.circle 
                        cx="50" cy="50" r="46" fill="none" 
                        stroke={timeLeft < 5 ? 'var(--error)' : 'var(--primary)'} 
                        strokeWidth="5"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * timeLeft) / TIMER_DURATION}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="time-value">{timeLeft}</div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ 
                        x: 0, 
                        opacity: 1,
                        filter: isPaused ? 'blur(20px)' : 'blur(0px)'
                    }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="question-block"
                >
                    {isPaused && (
                        <div style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            zIndex: 20,
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            <motion.h3 
                                animate={{ scale: [1, 1.1, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ fontSize: '3.5rem', fontFamily: 'Orbitron', color: 'var(--primary)', textShadow: '0 0 30px var(--primary-glow)' }}
                            >
                                SYSTEM PAUSED
                            </motion.h3>
                            <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>Visual uplink scrambled. Resume to clear optics.</p>
                        </div>
                    )}

                    <div className="question-meta">Primary Directive 0{currentIndex + 1}</div>
                    <h2 className="question-text">
                        {currentQuestion.question}
                    </h2>

                    <div className="options-grid" style={{ pointerEvents: isPaused ? 'none' : 'auto', marginTop: '2rem' }}>
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedOption === option;
                            const isCorrect = isAnswered && option === currentQuestion.correct;
                            const isWrong = isAnswered && isSelected && option !== currentQuestion.correct;
                            const isHidden = removedOptions.includes(option);

                            return (
                                <motion.button
                                    key={idx}
                                    className={`option-btn ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswered || isHidden || isPaused}
                                    style={{ visibility: isHidden ? 'hidden' : 'visible' }}
                                    whileHover={!isAnswered && !isPaused ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                                    whileTap={!isAnswered && !isPaused ? { scale: 0.98 } : {}}
                                >
                                    {option}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Enhanced Lifelines */}
            <div className="lifelines-container" style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                    <button 
                        className="lifeline-btn-new" 
                        onClick={useRemoveTwo} 
                        disabled={!lifelines.removeTwo || isAnswered || isPaused}
                        style={getLifelineStyle('removeTwo')}
                    >
                        <FaMinusCircle />
                    </button>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', fontWeight: 800, opacity: 0.6, fontFamily: 'Orbitron' }}>50:50</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button 
                        className="lifeline-btn-new" 
                        onClick={useSkip} 
                        disabled={!lifelines.skip || isAnswered || isPaused}
                        style={getLifelineStyle('skip')}
                    >
                        <FaForward />
                    </button>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', fontWeight: 800, opacity: 0.6, fontFamily: 'Orbitron' }}>SKIP</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button 
                        className="lifeline-btn-new" 
                        onClick={useHint} 
                        disabled={!lifelines.hint || isAnswered || isPaused}
                        style={getLifelineStyle('hint')}
                    >
                        <FaLightbulb />
                    </button>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', fontWeight: 800, opacity: 0.6, fontFamily: 'Orbitron' }}>HINT</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button 
                        className="lifeline-btn-new" 
                        onClick={togglePause} 
                        disabled={(isAnswered) || (!lifelines.pause && !isPaused)}
                        style={getLifelineStyle('pause')}
                    >
                        {isPaused ? <FaPlay /> : <FaPause />}
                    </button>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', fontWeight: 800, opacity: 1, color: isPaused ? 'var(--primary)' : 'rgba(255,255,255,0.6)', fontFamily: 'Orbitron' }}>
                        {isPaused ? 'RESUME' : 'FREEZE'}
                    </div>
                </div>
            </div>
            
            <div className="scanline" style={{ borderRadius: '40px' }}></div>
        </motion.div>
    );
};

const lifelineStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
};

export default GameInterface;
