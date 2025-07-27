import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings } from '../../types/exercise';
import { GameDataManager, RecommendationResult } from '../../utils/gameData';
import { DifficultySelector } from '../DifficultySelector';
import { ConfirmModal } from '../ConfirmModal';

interface NumberSettingsPanelProps {
  onStart: (settings: ExerciseSettings) => void;
}

export const NumberSettingsPanel: React.FC<NumberSettingsPanelProps> = ({ onStart }) => {
  const { translations } = useLanguage();
  const [rangeKey, setRangeKey] = useState('0-20');
  const [quantity, setQuantity] = useState(20);
  const [customMin, setCustomMin] = useState(0);
  const [customMax, setCustomMax] = useState(9999);
  const [recommendation, setRecommendation] = useState<RecommendationResult>({ text: '', recommendedRange: '' });
  const [showClearStatsModal, setShowClearStatsModal] = useState(false);

  // 加载智能推荐
  useEffect(() => {
    const numberStats = GameDataManager.loadNumberStats();
    const rec = GameDataManager.getRecommendation(numberStats, translations);
    setRecommendation(rec);
  }, [translations]);

  // 清空准确率记录
  const handleClearStats = () => {
    setShowClearStatsModal(true);
  };

  // 确认清空统计
  const handleConfirmClearStats = () => {
    GameDataManager.clearNumberStats();
    // 重新加载推荐
    const numberStats = GameDataManager.loadNumberStats();
    const rec = GameDataManager.getRecommendation(numberStats, translations);
    setRecommendation(rec);
    setShowClearStatsModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let range: [number, number];
    
    if (rangeKey === 'custom') {
      range = [Math.max(0, customMin), Math.min(9999, customMax)];
    } else if (rangeKey === 'tens') {
      range = [10, 90]; // Special case handled in generation
    } else {
      const [min, max] = rangeKey.split('-').map(Number);
      range = [min, max];
    }

    const settings: ExerciseSettings = {
      mode: 'number',
      range,
      quantity: Math.max(1, Math.min(200, quantity))
    };

    onStart(settings);
  };

  return (
    <div className="settings-panel">
      {recommendation.text && (
        <div className="recommendation-banner">
          <div className="recommendation-text">
            💡 {recommendation.text}
          </div>
          <button
            type="button"
            className="recommendation-clear-btn"
            onClick={handleClearStats}
            title={translations.clearStatsTooltip}
          >
            ×
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="difficulty">{translations.difficulty}</label>
          <DifficultySelector
            value={rangeKey}
            onChange={setRangeKey}
            recommendedRange={recommendation.recommendedRange}
          />
        </div>

        {rangeKey === 'custom' && (
          <div className="form-group">
            <label>{translations.customRange}</label>
            <div className="custom-range-inputs">
              <input
                type="number"
                className="input"
                value={customMin}
                onChange={(e) => setCustomMin(parseInt(e.target.value, 10) || 0)}
                min="0"
                max="9999"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                className="input"
                value={customMax}
                onChange={(e) => setCustomMax(parseInt(e.target.value, 10) || 9999)}
                min="0"
                max="9999"
                placeholder="Max"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="quantity">{translations.quantity}</label>
          <input 
            id="quantity" 
            type="number" 
            className="input" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} 
            min="1" 
            max="200" 
          />
        </div>

        <button type="submit" className="button button-primary start-button">
          {translations.startExercise}
        </button>
      </form>

      <ConfirmModal
        isOpen={showClearStatsModal}
        title={translations.clearStatsModal.title}
        message={translations.clearStatsModal.message}
        onConfirm={handleConfirmClearStats}
        onCancel={() => setShowClearStatsModal(false)}
      />
    </div>
  );
};
