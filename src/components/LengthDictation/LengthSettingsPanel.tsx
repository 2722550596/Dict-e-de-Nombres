import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings } from '../../types/game.types';
import { playSound } from '../../utils/audioEffects';
import '../NumberDictation/EnhancedRecommendation.css';
import './LengthSettingsPanel.css';

interface LengthSettingsPanelProps {
  onStart: (settings: ExerciseSettings) => void;
}

export const LengthSettingsPanel: React.FC<LengthSettingsPanelProps> = ({ onStart }) => {
  const { translations } = useLanguage();
  const [quantity, setQuantity] = useState(20);
  const [selectedUnits, setSelectedUnits] = useState<string[]>(['米', '厘米']);
  const [lengthRange, setLengthRange] = useState<[number, number]>([1, 100]);
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

  // 可用的长度单位
  const availableUnits = [
    { value: '米', label: '米 (m)', category: 'metric' },
    { value: '厘米', label: '厘米 (cm)', category: 'metric' },
    { value: '毫米', label: '毫米 (mm)', category: 'metric' },
    { value: '公里', label: '公里 (km)', category: 'metric' },
    { value: '分米', label: '分米 (dm)', category: 'metric' },
    { value: '英尺', label: '英尺 (ft)', category: 'imperial' },
    { value: '英寸', label: '英寸 (in)', category: 'imperial' },
    { value: '码', label: '码 (yd)', category: 'imperial' }
  ];

  const handleUnitChange = (unit: string, checked: boolean) => {
    if (checked) {
      setSelectedUnits(prev => [...prev, unit]);
    } else {
      setSelectedUnits(prev => prev.filter(u => u !== unit));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage('');

    if (selectedUnits.length === 0) {
      setErrorMessage(translations.selectAtLeastOneOperation || 'Please select at least one length unit');
      playSound('error');
      return;
    }

    if (lengthRange[0] >= lengthRange[1]) {
      setErrorMessage('Minimum value must be less than maximum value');
      playSound('error');
      return;
    }

    // Determine difficulty based on selected units
    const metricUnits = selectedUnits.filter(unit =>
      ['米', '厘米', '毫米', '公里', '分米'].includes(unit)
    );
    const imperialUnits = selectedUnits.filter(unit =>
      ['英尺', '英寸', '码'].includes(unit)
    );

    let difficulty = 'Facile'; // Default to easy
    if (metricUnits.length > 0 && imperialUnits.length > 0) {
      difficulty = 'Difficile'; // Hard if mixing metric and imperial
    } else if (selectedUnits.length > 3) {
      difficulty = 'Moyen'; // Medium if more than 3 units selected
    }

    const settings: ExerciseSettings = {
      mode: 'length',
      difficulty,
      range: lengthRange, // Use length range for compatibility
      quantity: Math.max(1, Math.min(200, quantity)),
      speed: 'normal',
      interval: 1,
      lengthUnits: selectedUnits,
      lengthRange: lengthRange
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
            <h3>📏 长度听写智能分析</h3>
          </div>

          {/* 长度模式专门推荐 */}
          {enhancedRecommendation.difficultyRecommendations &&
           enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'length') && (
            <div className="mode-specific-recommendation">
              {(() => {
                const lengthRec = enhancedRecommendation.difficultyRecommendations.find((rec: any) => rec.mode === 'length');
                return (
                  <div className="primary-recommendation">
                    <div className="recommendation-text">
                      🎯 当前水平: {lengthRec.currentLevel === 'beginner' ? '初学者' :
                                   lengthRec.currentLevel === 'intermediate' ? '中级' :
                                   lengthRec.currentLevel === 'advanced' ? '高级' : '专家'}
                    </div>
                    <div className="recommendation-text">
                      💡 推荐难度: {lengthRec.recommendedDifficulty}
                    </div>
                    <div className="recommendation-reason">
                      📝 {lengthRec.reason}
                    </div>
                    {lengthRec.nextMilestone && (
                      <div className="recommendation-reason">
                        🎯 下一目标: {lengthRec.nextMilestone}
                      </div>
                    )}
                    {lengthRec.estimatedTimeToMastery && lengthRec.estimatedTimeToMastery > 0 && (
                      <div className="recommendation-reason">
                        ⏱️ 预计掌握时间: {lengthRec.estimatedTimeToMastery}天
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
                    {enhancedRecommendation.crossModeAnalysis.strongestMode === 'length' ? '长度听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'time' ? '时间听写' :
                     enhancedRecommendation.crossModeAnalysis.strongestMode === 'direction' ? '方位听写' : '数字听写'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">📈 建议加强:</span>
                  <span className="stat-value">
                    {enhancedRecommendation.crossModeAnalysis.weakestMode === 'length' ? '长度听写 (当前)' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'time' ? '时间听写' :
                     enhancedRecommendation.crossModeAnalysis.weakestMode === 'direction' ? '方位听写' : '数字听写'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">⚖️ 整体平衡:</span>
                  <span className="stat-value">{enhancedRecommendation.crossModeAnalysis.balanceScore}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{translations.newModeTexts?.selectLengthUnits || 'Length Units'}</label>
          <div className="operation-checkboxes">
            <div className="unit-category">
              <h4>{translations.newModeDifficulties?.['metric-basic']?.replace(' Units', '') || '公制单位'}</h4>
              {availableUnits.filter(unit => unit.category === 'metric').map(unit => (
                <label key={unit.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(unit.value)}
                    onChange={(e) => handleUnitChange(unit.value, e.target.checked)}
                  />
                  <span>{unit.label}</span>
                </label>
              ))}
            </div>
            <div className="unit-category">
              <h4>{translations.newModeDifficulties?.['imperial-basic']?.replace(' Units', '') || '英制单位'}</h4>
              {availableUnits.filter(unit => unit.category === 'imperial').map(unit => (
                <label key={unit.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(unit.value)}
                    onChange={(e) => handleUnitChange(unit.value, e.target.checked)}
                  />
                  <span>{unit.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>



        <div className="form-group">
          <label>{translations.customRange || '数值范围'}</label>
          <div className="range-inputs">
            <input
              type="number"
              className="input range-input"
              value={lengthRange[0]}
              onChange={(e) => setLengthRange([Number(e.target.value), lengthRange[1]])}
              min="0.1"
              max="9999"
              step="0.1"
              placeholder={translations.customRange || '最小值'}
            />
            <span>{translations.customRange ? 'to' : '到'}</span>
            <input
              type="number"
              className="input range-input"
              value={lengthRange[1]}
              onChange={(e) => setLengthRange([lengthRange[0], Number(e.target.value)])}
              min="0.1"
              max="9999"
              step="0.1"
              placeholder={translations.customRange || '最大值'}
            />
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
