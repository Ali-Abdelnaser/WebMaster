import React from 'react';

const GameBackground = () => {
    return (
        <div className="game-bg-elements">
            {/* Animated Stars/Particles */}
            <div className="stars-overlay"></div>
            
            {/* Pulsing Gaming Blobs */}
            <div className="bg-blob blob-1" style={{ background: 'var(--primary)', opacity: 0.1 }}></div>
            <div className="bg-blob blob-2" style={{ background: '#004a75', opacity: 0.1 }}></div>
            
            {/* Cyber Grid with Motion */}
            <div className="cyber-grid-container">
                <div className="cyber-grid"></div>
            </div>

            {/* Scanline Effect */}
            <div className="scanlines"></div>

            {/* Ambient Pulse */}
            <div className="ambient-pulse"></div>
        </div>
    );
};

export default GameBackground;
