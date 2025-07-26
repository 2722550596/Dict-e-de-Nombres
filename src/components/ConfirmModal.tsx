import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { playSound } from '../utils/audioEffects';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const { translations } = useLanguage();

  // 播放模态框打开音效
  useEffect(() => {
    if (isOpen) {
      playSound('navigation'); // 模态框打开时播放导航音效
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      playSound('click'); // 点击背景关闭时播放点击音效
      onCancel();
    }
  };

  const handleConfirm = () => {
    playSound('submit'); // 确认时播放提交音效
    onConfirm();
  };

  const handleCancel = () => {
    playSound('click'); // 取消时播放点击音效
    onCancel();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={handleCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button
            className="button button-secondary"
            onClick={handleCancel}
          >
            {translations.confirmModal.cancel}
          </button>
          <button
            className="button button-primary"
            onClick={handleConfirm}
          >
            {translations.confirmModal.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
