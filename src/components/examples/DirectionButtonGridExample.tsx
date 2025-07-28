import React, { useState } from 'react';
import { DirectionContent } from '../../types/game.types';
import { DirectionButtonGrid } from '../DirectionButtonGrid';

export const DirectionButtonGridExample: React.FC = () => {
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Sample direction data for different types
  const cardinalDirections: DirectionContent[] = [
    { type: 'cardinal', value: '北', displayText: '北', buttonPosition: { x: 1, y: 0 } },
    { type: 'cardinal', value: '东北', displayText: '东北', buttonPosition: { x: 2, y: 0 } },
    { type: 'cardinal', value: '东', displayText: '东', buttonPosition: { x: 2, y: 1 } },
    { type: 'cardinal', value: '东南', displayText: '东南', buttonPosition: { x: 2, y: 2 } },
    { type: 'cardinal', value: '南', displayText: '南', buttonPosition: { x: 1, y: 2 } },
    { type: 'cardinal', value: '西南', displayText: '西南', buttonPosition: { x: 0, y: 2 } },
    { type: 'cardinal', value: '西', displayText: '西', buttonPosition: { x: 0, y: 1 } },
    { type: 'cardinal', value: '西北', displayText: '西北', buttonPosition: { x: 0, y: 0 } },
  ];

  const relativeDirections: DirectionContent[] = [
    { type: 'relative', value: '前', displayText: '前', buttonPosition: { x: 1, y: 0 } },
    { type: 'relative', value: '右前', displayText: '右前', buttonPosition: { x: 2, y: 0 } },
    { type: 'relative', value: '右', displayText: '右', buttonPosition: { x: 2, y: 1 } },
    { type: 'relative', value: '右后', displayText: '右后', buttonPosition: { x: 2, y: 2 } },
    { type: 'relative', value: '后', displayText: '后', buttonPosition: { x: 1, y: 2 } },
    { type: 'relative', value: '左后', displayText: '左后', buttonPosition: { x: 0, y: 2 } },
    { type: 'relative', value: '左', displayText: '左', buttonPosition: { x: 0, y: 1 } },
    { type: 'relative', value: '左前', displayText: '左前', buttonPosition: { x: 0, y: 0 } },
  ];

  const spatialDirections: DirectionContent[] = [
    { type: 'spatial', value: '上', displayText: '上', buttonPosition: { x: 1, y: 0 } },
    { type: 'spatial', value: '右上', displayText: '右上', buttonPosition: { x: 2, y: 0 } },
    { type: 'spatial', value: '外', displayText: '外', buttonPosition: { x: 2, y: 1 } },
    { type: 'spatial', value: '右下', displayText: '右下', buttonPosition: { x: 2, y: 2 } },
    { type: 'spatial', value: '下', displayText: '下', buttonPosition: { x: 1, y: 2 } },
    { type: 'spatial', value: '左下', displayText: '左下', buttonPosition: { x: 0, y: 2 } },
    { type: 'spatial', value: '里', displayText: '里', buttonPosition: { x: 0, y: 1 } },
    { type: 'spatial', value: '左上', displayText: '左上', buttonPosition: { x: 0, y: 0 } },
  ];

  const allDirectionSets = [
    { name: '基本方位', directions: cardinalDirections },
    { name: '相对方位', directions: relativeDirections },
    { name: '空间方位', directions: spatialDirections }
  ];

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const currentSet = allDirectionSets[currentSetIndex];
  const currentQuestion = currentSet.directions[currentQuestionIndex];

  // Simulate correct answer (for demo purposes, let's say the first direction is always correct)
  const correctAnswer = currentSet.directions[0].value;

  const handleDirectionSelect = (direction: string) => {
    setSelectedDirection(direction);
    
    // Simulate feedback
    if (direction === correctAnswer) {
      setFeedbackState('correct');
    } else {
      setFeedbackState('incorrect');
    }

    // Auto-reset after 2 seconds
    setTimeout(() => {
      setFeedbackState('none');
      setSelectedDirection('');
      // Move to next question
      setCurrentQuestionIndex((prev) => (prev + 1) % currentSet.directions.length);
    }, 2000);
  };

  const switchDirectionSet = (index: number) => {
    setCurrentSetIndex(index);
    setCurrentQuestionIndex(0);
    setFeedbackState('none');
    setSelectedDirection('');
  };

  const resetDemo = () => {
    setFeedbackState('none');
    setSelectedDirection('');
    setCurrentQuestionIndex(0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        DirectionButtonGrid 组件演示
      </h2>
      
      {/* Direction Set Selector */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3>选择方位类型：</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          {allDirectionSets.map((set, index) => (
            <button
              key={index}
              onClick={() => switchDirectionSet(index)}
              style={{
                padding: '0.5rem 1rem',
                border: currentSetIndex === index ? '2px solid #3b82f6' : '1px solid #ccc',
                borderRadius: '0.5rem',
                background: currentSetIndex === index ? '#3b82f6' : 'white',
                color: currentSetIndex === index ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: currentSetIndex === index ? 'bold' : 'normal'
              }}
            >
              {set.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question Info */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          <strong>当前题目：</strong>请选择 "{correctAnswer}"
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          题目 {currentQuestionIndex + 1} / {currentSet.directions.length}
        </p>
      </div>

      {/* Direction Button Grid */}
      <DirectionButtonGrid
        availableDirections={currentSet.directions}
        currentQuestion={currentQuestion}
        onDirectionSelect={handleDirectionSelect}
        feedbackState={feedbackState}
        selectedDirection={selectedDirection}
        correctDirection={correctAnswer}
      />

      {/* Controls */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={resetDemo}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          重置演示
        </button>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
        <h4>功能说明：</h4>
        <ul style={{ marginTop: '1rem', lineHeight: '1.6' }}>
          <li><strong>响应式按钮布局：</strong>按钮根据方位类型自动排列在3x3网格中</li>
          <li><strong>视觉提示：</strong>悬停效果、点击反馈和状态指示</li>
          <li><strong>即时反馈：</strong>点击后立即显示正确/错误状态</li>
          <li><strong>动态位置计算：</strong>根据方位值自动计算按钮位置</li>
          <li><strong>多种方位类型：</strong>支持基本方位、相对方位、空间方位</li>
          <li><strong>无障碍支持：</strong>包含适当的ARIA标签和键盘导航</li>
        </ul>
      </div>
    </div>
  );
};