import React from 'react';
import { QuizProvider, useQuiz } from '../context/QuizContext';
import EntrySection from '../components/QuizGame/EntrySection';
import AuthData from '../components/QuizGame/AuthData';
import Rules from '../components/QuizGame/Rules';
import GameInterface from '../components/QuizGame/GameInterface';
import InterStageDashboard from '../components/QuizGame/InterStageDashboard';
import FinalDashboard from '../components/QuizGame/FinalDashboard';
import GameBackground from '../components/QuizGame/GameBackground';
import GlobalModal from '../components/QuizGame/GlobalModal';
import "../components/QuizGame/QuizGame.css"; // Global styles for the game

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
    return (
        <QuizProvider>
            <QuizPageContent />
        </QuizProvider>
    );
};

const QuizPageContent = () => {
    const { gameState } = useQuiz();
    
    return (
        <div className="quiz-game-container">
            <GlobalModal />
            {/* Only show GameBackground when NOT in entry state */}
            {gameState !== "entry" && <GameBackground />}
            <QuizContent />
        </div>
    );
};

export default QuizPage;
