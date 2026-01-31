import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../../context/QuizContext';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const GlobalModal = () => {
    const { modalConfig, closeModal } = useQuiz();

    if (!modalConfig.isOpen) return null;

    const getIcon = () => {
        switch (modalConfig.type) {
            case 'danger': return <FaTrashAlt color="#f43f5e" size={40} />;
            case 'warning': return <FaExclamationTriangle color="#eab308" size={40} />;
            case 'success': return <FaCheckCircle color="#10b981" size={40} />;
            default: return <FaInfoCircle color="#00629b" size={40} />;
        }
    };

    const handleConfirm = () => {
        if (modalConfig.onConfirm) modalConfig.onConfirm();
        closeModal();
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass-card modal-container"
                >
                    <div className="modal-header">
                        <div className="modal-icon-bg">
                            {getIcon()}
                        </div>
                        <h2 className="modal-title">{modalConfig.title}</h2>
                    </div>
                    
                    <div className="modal-body">
                        <p>{modalConfig.message}</p>
                    </div>
                    
                    <div className="modal-footer">
                        {modalConfig.showCancel && (
                            <button className="secondary-btn" onClick={closeModal}>
                                {modalConfig.cancelText}
                            </button>
                        )}
                        <button 
                            className={`primary-btn ${modalConfig.type === 'danger' ? 'danger-btn' : ''}`} 
                            onClick={handleConfirm}
                        >
                            {modalConfig.confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GlobalModal;
