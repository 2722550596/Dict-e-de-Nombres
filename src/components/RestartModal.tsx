import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface RestartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetestCurrent: () => void;
  onNewPractice: () => void;
}

export const RestartModal: React.FC<RestartModalProps> = ({
  isOpen,
  onClose,
  onRetestCurrent,
  onNewPractice
}) => {
  const { translations } = useLanguage();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{translations.restartModal.title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p>{translations.restartModal.message}</p>
        </div>
        
        <div className="modal-actions">
          <button
            className="button button-secondary"
            onClick={onRetestCurrent}
          >
            {translations.restartModal.retestCurrent}
          </button>
          <button
            className="button button-primary"
            onClick={onNewPractice}
          >
            {translations.restartModal.newPractice}
          </button>
        </div>
      </div>
    </div>
  );
};
