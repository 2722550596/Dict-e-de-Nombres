import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings } from '../../types/exercise';
import '../NumberDictation/EnhancedRecommendation.css';
import './DirectionSettingsPanel.css';

interface DirectionSettingsPanelProps {
  onStart: (settings: ExerciseSettings) => void;
}

export const DirectionSettingsPanel: React.FC<DirectionSettingsPanelProps> = ({ onStart }) => {
  const { translations } = useLanguage();

  const [quantity, setQuantity] = useState(20);
  const [directionTypes, setDirectionTypes] = useState<('cardinal' | 'relative' | 'spatial')[]>(['cardinal']);
  const [enhancedRecommendation, setEnhancedRecommendation] = useState<any>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // 加载增强推荐
  React.useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoadingRecommendation(true);
      try {
        const { gameDataManager } = await import('../../utils/game/data-manager');
        const enhancedRec = await gameDataManager.generateEnhancedRecommendation();
        setEnhancedRecommendation(enhancedRec);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setIsLoadingRecommendation(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleDirectionTypeChange = (type: 'cardinal' | 'relative' | 'spatial', checked: boolean) => {
    if (checked) {
      setDirectionTypes(prev => [...prev, type]);
    } else {
      setDirectionTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleStart = () => {
    if (directionTypes.length === 0) {
      alert(translations.errors?.selectDirectionType || 'Please select at least one direction type');
      return;
    }

    // Determine difficulty based on selected direction types
    let difficulty = translations.difficulties?.easy || 'Easy'; // Default to easy
    if (directionTypes.length > 1) {
      difficulty = translations.difficulties?.medium || 'Medium'; // Medium if multiple types selected
    }
    if (directionTypes.includes('spatial') && directionTypes.length > 1) {
      difficulty = translations.difficulties?.hard || 'Hard'; // Hard if spatial + others
    }

    const settings: ExerciseSettings = {
      mode: 'direction',
      difficulty,
      range: [0, 0], // Not used for direction mode
      quantity,
      speed: 'normal',
      interval: 1,
      directionTypes
    };

    onStart(settings);
  };

  return (
    <div className="settings-panel">
      {/* 增强推荐信息 */}
      {isLoadingRecommendation && (
        <div className="recommendation-loading">
          正在加载智能推荐...
        </div>
      )}

      {enhancedRecommendation && (
        <div className="enhanced-recommendation">
          <div className="enhanced-recommendation-header">
            <h3>🧭 方位听写智能分析</h3>
          </div>

          {/* 方位模式专门推荐 */}
          {enhancedRecommendation.difficultyRecommendations &&
           enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'direction') && (
            <div className="mode-specific-recommendation">
              {(() => {
                const directionRec = enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'direction');
                return (
                  <div className="primary-recommendation">
                    <div className="recommendation-text">
                      🎯 当前水平: {directionRec.currentLevel === 'beginner' ? '初学者' :
                                   directionRec.currentLevel === 'intermediate' ? '中级' :
                                   directionRec.currentLevel === 'advanced' ? '高级' : '专家'}
                    </div>
                    <div className="recommendation-text">
                      💡 推荐难度: {directionRec.recommendedDifficulty}
                    </div>
                    <div className="recommendation-reason">
                      📝 {directionRec.reason}
                    </div>
                    {directionRec.nextMilestone && (
                      <div className="recommendation-reason">
                        🎯 下一目标: {directionRec.nextMilestone}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 跨模式对比 */}
          {enhancedRecommendation.crossModeAnalysis && (
            <div className="cross-mode-analysis">
              <h4>📊 与其他模式对比</h4>
              <div className="mode-stats">
                <div className="stat-item">
                  <span className="stat-label">🏆 您的最强模式:</span>
                  <span className="stat-value">
                    {enhancedRecommendation.crossModeAnalysis.strongestMode === 'direction' ? '方位听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'time' ? '时间听写' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'length' ? '长度听写' : '数字听写'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">📈 建议加强:</span>
                  <span className="stat-value">
                    {enhancedRecommendation.crossModeAnalysis.weakestMode === 'direction' ? '方位听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'time' ? '时间听写' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'length' ? '长度听写' : '数字听写'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="settings-section">
        <h3>{translations.settings?.directionTypes || 'Direction Types'}</h3>
        <div className="direction-types-selector">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={directionTypes.includes('cardinal')}
              onChange={(e) => handleDirectionTypeChange('cardinal', e.target.checked)}
            />
            <span>{translations.directionTypes?.cardinal || '基本方位 (Cardinal)'}</span>
            <small>{translations.directionTypes?.cardinalDesc || '东南西北等基本方位'}</small>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={directionTypes.includes('relative')}
              onChange={(e) => handleDirectionTypeChange('relative', e.target.checked)}
            />
            <span>{translations.directionTypes?.relative || '相对方位 (Relative)'}</span>
            <small>{translations.directionTypes?.relativeDesc || '左右前后等相对方位'}</small>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={directionTypes.includes('spatial')}
              onChange={(e) => handleDirectionTypeChange('spatial', e.target.checked)}
            />
            <span>{translations.directionTypes?.spatial || '空间方位 (Spatial)'}</span>
            <small>{translations.directionTypes?.spatialDesc || '上下里外等空间方位'}</small>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>{translations.settings?.quantity || 'Quantity'}</h3>
        <div className="quantity-selector">
          <input
            type="range"
            min="5"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="quantity-slider"
          />
          <span className="quantity-display">{quantity} {translations.settings?.questions || 'questions'}</span>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="button button-primary start-button"
        disabled={directionTypes.length === 0}
      >
        {translations.startPractice || 'Start Practice'}
      </button>
    </div>
  );
};