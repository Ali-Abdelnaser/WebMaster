import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import EntrySection from '../components/QuizGame/EntrySection';
import AuthData from '../components/QuizGame/AuthData';
import Rules from '../components/QuizGame/Rules';
import GameInterface from '../components/QuizGame/GameInterface';
import InterStageDashboard from '../components/QuizGame/InterStageDashboard';
import FinalDashboard from '../components/QuizGame/FinalDashboard';
import GameBackground from '../components/QuizGame/GameBackground';
import GlobalModal from '../components/QuizGame/GlobalModal';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../components/QuizGame/QuizGame.css"; // Global styles for the game

const MaintenanceOverlay = () => {
    const navigate = useNavigate();
    return (
        <div className="maintenance-overlay-wrapper">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card maintenance-card"
            >
                <div className="m-icon-box">
                    <FaExclamationTriangle size={50} color="#eab308" />
                </div>
                <h2>SYSTEM SUSPENDED</h2>
                <p>The central server is currently undergoing technical upgrades. Field operations have been temporarily suspended by HQ.</p>
                <div className="m-footer">
                    <button className="primary-btn" onClick={() => navigate('/')}>RETURN TO HOME</button>
                </div>
            </motion.div>
        </div>
    );
};

const QuizContent = () => {
    const { gameState, user, userProfile } = useQuiz();

    // If user is not logged in or hasn't created a profile, show Auth/Entry
    if (gameState === "entry") {
        return <EntrySection />;
    }
    
    if (gameState === "auth") {
        return <AuthData />;
    }

    if (gameState === "rules") {
        return <Rules />;
    }

    if (gameState === "playing") {
        return <GameInterface />;
    }

    if (gameState === "interStage") {
        return <InterStageDashboard />;
    }

    if (gameState === "final") {
        return <FinalDashboard />;
    }

    return <div>Loading...</div>;
};


const QuizPage = () => {
    const { gameState, gameLive } = useQuiz();
    
    return (
        <div className={`quiz-game-container ${!gameLive ? 'system-offline' : ''}`}>
            <GlobalModal />
            {!gameLive && <MaintenanceOverlay />}
            
            {/* Only show GameBackground when NOT in entry state */}
            {gameState !== "entry" && <GameBackground />}
            <QuizContent />
        </div>
    );
};

export default QuizPage;
