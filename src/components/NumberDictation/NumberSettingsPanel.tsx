import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings } from '../../types/exercise';
import { GameDataManager, RecommendationResult } from '../../utils/gameData';
import { ConfirmModal } from '../ConfirmModal';
import { DifficultySelector } from '../DifficultySelector';
import './EnhancedRecommendation.css';

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
  const [enhancedRecommendation, setEnhancedRecommendation] = useState<any>(null);
  const [showClearStatsModal, setShowClearStatsModal] = useState(false);
  const [RecommendationComponent, setRecommendationComponent] = useState<any>(null);

  // 加载智能推荐
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // 加载传统推荐（向后兼容）
        const numberStats = GameDataManager.loadNumberStats();
        const rec = GameDataManager.getRecommendation(numberStats, translations);
        setRecommendation(rec);

        // 加载增强推荐
        const { gameDataManager } = await import('../../utils/game/data-manager');
        const enhancedRec = await gameDataManager.generateEnhancedRecommendation();
        setEnhancedRecommendation(enhancedRec);

        // 动态加载推荐显示组件
        const { EnhancedRecommendationDisplay } = await import('../EnhancedRecommendationDisplay');
        setRecommendationComponent(() => EnhancedRecommendationDisplay);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      }
    };

    loadRecommendations();
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
      {/* 传统推荐横幅 */}
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

      {/* 增强推荐信息 */}
      {RecommendationComponent && React.createElement(RecommendationComponent, {
        recommendation: enhancedRecommendation,
        currentMode: "number" as const,
        isLoading: !enhancedRecommendation
      })}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="difficulty">{translations.difficulty}</label>
          <DifficultySelector
            value={rangeKey}
            onChange={setRangeKey}
            recommendedRange={recommendation.recommendedRange}
            enhancedRecommendation={enhancedRecommendation}
            currentMode="number"
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
