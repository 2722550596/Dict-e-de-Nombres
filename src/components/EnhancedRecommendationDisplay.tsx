/**
 * 增强推荐显示组件 (8.2新增)
 * 统一显示跨模式分析、难度推荐、练习分析等增强推荐信息
 */

import React from 'react';
import './NumberDictation/EnhancedRecommendation.css';

interface EnhancedRecommendationDisplayProps {
  recommendation: any;
  currentMode: 'number' | 'time' | 'direction' | 'length';
  isLoading?: boolean;
}

const MODE_ICONS = {
  number: '🔢',
  time: '🕐',
  direction: '🧭',
  length: '📏'
};

const MODE_NAMES = {
  number: '数字听写',
  time: '时间听写',
  direction: '方位听写',
  length: '长度听写'
};

const LEVEL_NAMES = {
  beginner: '初学者',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家'
};

export const EnhancedRecommendationDisplay: React.FC<EnhancedRecommendationDisplayProps> = ({
  recommendation,
  currentMode,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="recommendation-loading">
        正在加载智能推荐...
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const getModeDisplayName = (mode: string): string => {
    return MODE_NAMES[mode as keyof typeof MODE_NAMES] || mode;
  };

  const getCurrentModeRecommendation = () => {
    return recommendation.difficultyRecommendations?.find((rec: any) => rec.mode === currentMode);
  };

  const currentModeRec = getCurrentModeRecommendation();

  return (
    <div className="enhanced-recommendation">
      <div className="enhanced-recommendation-header">
        <h3>{MODE_ICONS[currentMode]} {MODE_NAMES[currentMode]}智能分析</h3>
        {recommendation.dataQuality && (
          <span className={`data-quality-indicator data-quality-${recommendation.dataQuality}`}>
            数据质量: {recommendation.dataQuality === 'excellent' ? '优秀' :
                      recommendation.dataQuality === 'good' ? '良好' :
                      recommendation.dataQuality === 'limited' ? '有限' : '不足'}
          </span>
        )}
      </div>
      
      {/* 当前模式专门推荐 */}
      {currentModeRec && (
        <div className="mode-specific-recommendation">
          <div className="primary-recommendation">
            <div className="recommendation-text">
              🎯 当前水平: {LEVEL_NAMES[currentModeRec.currentLevel as keyof typeof LEVEL_NAMES] || currentModeRec.currentLevel}
            </div>
            <div className="recommendation-text">
              💡 推荐难度: {currentModeRec.recommendedDifficulty}
            </div>
            <div className="recommendation-reason">
              📝 {currentModeRec.reason}
            </div>
            {currentModeRec.nextMilestone && (
              <div className="recommendation-reason">
                🎯 下一目标: {currentModeRec.nextMilestone}
              </div>
            )}
            {currentModeRec.confidenceScore && (
              <div className="recommendation-confidence">
                📊 推荐置信度: {currentModeRec.confidenceScore}%
              </div>
            )}
            {currentModeRec.estimatedTimeToMastery && currentModeRec.estimatedTimeToMastery > 0 && (
              <div className="recommendation-reason">
                ⏱️ 预计掌握时间: {currentModeRec.estimatedTimeToMastery}天
              </div>
            )}
          </div>
        </div>
      )}

      {/* 跨模式分析 */}
      {recommendation.crossModeAnalysis && (
        <div className="cross-mode-analysis">
          <h4>📊 跨模式表现分析</h4>
          <div className="mode-stats">
            <div className="stat-item">
              <span className="stat-label">🏆 最强模式:</span>
              <span className="stat-value">
                {getModeDisplayName(recommendation.crossModeAnalysis.strongestMode)}
                {recommendation.crossModeAnalysis.strongestMode === currentMode ? ' (当前)' : ''}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📈 需要加强:</span>
              <span className="stat-value">
                {getModeDisplayName(recommendation.crossModeAnalysis.weakestMode)}
                {recommendation.crossModeAnalysis.weakestMode === currentMode ? ' (当前)' : ''}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">⚖️ 平衡分数:</span>
              <span className="stat-value">{recommendation.crossModeAnalysis.balanceScore}/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🎨 多样性:</span>
              <span className="stat-value">{recommendation.crossModeAnalysis.diversityScore}/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📊 整体进度:</span>
              <span className="stat-value">
                {recommendation.crossModeAnalysis.overallProgress === 'excellent' ? '优秀' :
                 recommendation.crossModeAnalysis.overallProgress === 'good' ? '良好' :
                 recommendation.crossModeAnalysis.overallProgress === 'average' ? '一般' : '需要改进'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 练习建议 */}
      {recommendation.suggestions && (
        <div className="practice-suggestions">
          <h4>💡 学习建议</h4>
          
          {recommendation.suggestions.immediate && recommendation.suggestions.immediate.length > 0 && (
            <div className="suggestion-group">
              <h5>🚀 立即行动</h5>
              <ul>
                {recommendation.suggestions.immediate.slice(0, 3).map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.suggestions.shortTerm && recommendation.suggestions.shortTerm.length > 0 && (
            <div className="suggestion-group">
              <h5>📅 短期目标 (1-7天)</h5>
              <ul>
                {recommendation.suggestions.shortTerm.slice(0, 2).map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.suggestions.longTerm && recommendation.suggestions.longTerm.length > 0 && (
            <div className="suggestion-group">
              <h5>🎯 长期目标 (1-4周)</h5>
              <ul>
                {recommendation.suggestions.longTerm.slice(0, 2).map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 练习分析 */}
      {recommendation.practiceAnalysis && (
        <div className="practice-analysis">
          <h4>📈 练习分析</h4>
          <div className="analysis-stats">
            <div className="stat-item">
              <span className="stat-label">📅 日均练习:</span>
              <span className="stat-value">{recommendation.practiceAnalysis.dailyAverageMinutes}分钟</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📊 周频率:</span>
              <span className="stat-value">{recommendation.practiceAnalysis.weeklyFrequency}次</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🎯 一致性:</span>
              <span className="stat-value">{recommendation.practiceAnalysis.consistencyScore}/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">💪 效果:</span>
              <span className="stat-value">{recommendation.practiceAnalysis.effectivenessScore}/100</span>
            </div>
          </div>
          <div className="practice-recommendations">
            <p><strong>📋 建议频率:</strong> {recommendation.practiceAnalysis.recommendedFrequency}</p>
            <p><strong>⏰ 建议时长:</strong> {recommendation.practiceAnalysis.recommendedDuration}</p>
            {recommendation.practiceAnalysis.optimalPracticeTime && (
              <p><strong>🌟 最佳时间:</strong> {recommendation.practiceAnalysis.optimalPracticeTime}</p>
            )}
            {recommendation.practiceAnalysis.bestPerformanceTimeOfDay && (
              <p><strong>⭐ 最佳时段:</strong> {
                recommendation.practiceAnalysis.bestPerformanceTimeOfDay === 'morning' ? '上午' :
                recommendation.practiceAnalysis.bestPerformanceTimeOfDay === 'afternoon' ? '下午' :
                recommendation.practiceAnalysis.bestPerformanceTimeOfDay === 'evening' ? '晚上' : '深夜'
              }</p>
            )}
          </div>
        </div>
      )}

      {/* 生成时间和版本信息 */}
      {recommendation.generatedAt && (
        <div className="recommendation-meta">
          <small>
            📅 生成时间: {new Date(recommendation.generatedAt).toLocaleString('zh-CN')}
            {recommendation.recommendationVersion && (
              <span> | 版本: {recommendation.recommendationVersion}</span>
            )}
          </small>
        </div>
      )}
    </div>
  );
};
