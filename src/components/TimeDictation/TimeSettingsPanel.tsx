import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings } from '../../types/game.types';
import { playSound } from '../../utils/audioEffects';
import '../NumberDictation/EnhancedRecommendation.css';

interface TimeSettingsPanelProps {
  onStart: (settings: ExerciseSettings) => void;
}

export const TimeSettingsPanel: React.FC<TimeSettingsPanelProps> = ({ onStart }) => {
  const { translations } = useLanguage();
  const [quantity, setQuantity] = useState(20);
  const [selectedTimeTypes, setSelectedTimeTypes] = useState<('year' | 'month' | 'day' | 'weekday' | 'fullDate')[]>(['year']);
  const [errorMessage, setErrorMessage] = useState<string>('');
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

  const handleTimeTypeChange = (timeType: 'year' | 'month' | 'day' | 'weekday' | 'fullDate', checked: boolean) => {
    if (checked) {
      setSelectedTimeTypes(prev => [...prev, timeType]);
    } else {
      setSelectedTimeTypes(prev => prev.filter(type => type !== timeType));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage('');

    if (selectedTimeTypes.length === 0) {
      setErrorMessage(translations.selectAtLeastOneOperation || 'Please select at least one time type');
      playSound('error');
      return;
    }

    // Determine difficulty based on selected time types
    let difficulty = 'Facile'; // Default to easy
    if (selectedTimeTypes.includes('fullDate')) {
      difficulty = 'Difficile'; // Hard if full dates are included
    } else if (selectedTimeTypes.length > 2) {
      difficulty = 'Moyen'; // Medium if more than 2 types selected
    }

    const settings: ExerciseSettings = {
      mode: 'time',
      difficulty,
      range: [0, 100], // Not directly applicable for time dictation
      quantity: Math.max(1, Math.min(200, quantity)),
      speed: 'normal',
      interval: 1,
      timeTypes: selectedTimeTypes
    };

    onStart(settings);
  };

  // Time type translations - fallback to English if not available
  const getTimeTypeLabel = (type: string): string => {
    const timeTypeLabels: Record<string, string> = {
      year: translations.timeTypes?.year || 'Year',
      month: translations.timeTypes?.month || 'Month', 
      day: translations.timeTypes?.day || 'Day',
      weekday: translations.timeTypes?.weekday || 'Weekday',
      fullDate: translations.timeTypes?.fullDate || 'Full Date'
    };
    return timeTypeLabels[type] || type;
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
            <h3>🕐 时间听写智能分析</h3>
          </div>

          {/* 时间模式专门推荐 */}
          {enhancedRecommendation.difficultyRecommendations &&
           enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'time') && (
            <div className="mode-specific-recommendation">
              {(() => {
                const timeRec = enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'time');
                return (
                  <div className="primary-recommendation">
                    <div className="recommendation-text">
                      🎯 当前水平: {timeRec.currentLevel === 'beginner' ? '初学者' :
                                   timeRec.currentLevel === 'intermediate' ? '中级' :
                                   timeRec.currentLevel === 'advanced' ? '高级' : '专家'}
                    </div>
                    <div className="recommendation-text">
                      💡 推荐难度: {timeRec.recommendedDifficulty}
                    </div>
                    <div className="recommendation-reason">
                      📝 {timeRec.reason}
                    </div>
                    {timeRec.nextMilestone && (
                      <div className="recommendation-reason">
                        🎯 下一目标: {timeRec.nextMilestone}
                      </div>
                    )}
                    <div className="recommendation-confidence">
                      📊 推荐置信度: {timeRec.confidenceScore}%
                    </div>
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
                    {enhancedRecommendation.crossModeAnalysis.strongestMode === 'time' ? '时间听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'direction' ? '方位听写' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'length' ? '长度听写' : '数字听写'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">📈 建议加强:</span>
                  <span className="stat-value">
                    {enhancedRecommendation.crossModeAnalysis.weakestMode === 'time' ? '时间听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'direction' ? '方位听写' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'length' ? '长度听写' : '数字听写'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 练习建议 */}
          {enhancedRecommendation.suggestions && enhancedRecommendation.suggestions.immediate.length > 0 && (
            <div className="practice-suggestions">
              <h4>💡 时间听写练习建议</h4>
              <div className="suggestion-group">
                <h5>🚀 立即行动</h5>
                <ul>
                  {enhancedRecommendation.suggestions.immediate.slice(0, 3).map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{translations.operationTypes || 'Time Types'}</label>
          <div className="operation-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimeTypes.includes('year')}
                onChange={(e) => handleTimeTypeChange('year', e.target.checked)}
              />
              <span>{getTimeTypeLabel('year')}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimeTypes.includes('month')}
                onChange={(e) => handleTimeTypeChange('month', e.target.checked)}
              />
              <span>{getTimeTypeLabel('month')}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimeTypes.includes('day')}
                onChange={(e) => handleTimeTypeChange('day', e.target.checked)}
              />
              <span>{getTimeTypeLabel('day')}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimeTypes.includes('weekday')}
                onChange={(e) => handleTimeTypeChange('weekday', e.target.checked)}
              />
              <span>{getTimeTypeLabel('weekday')}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimeTypes.includes('fullDate')}
                onChange={(e) => handleTimeTypeChange('fullDate', e.target.checked)}
              />
              <span>{getTimeTypeLabel('fullDate')}</span>
            </label>
          </div>
        </div>



        <div className="form-group">
          <label htmlFor="quantity">{translations.quantity || 'Quantity'}</label>
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

        {errorMessage && (
          <div className="error-message" style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {errorMessage}
          </div>
        )}

        <button type="submit" className="button button-primary start-button">
          {translations.startExercise || 'Start Exercise'}
        </button>
      </form>
    </div>
  );
};