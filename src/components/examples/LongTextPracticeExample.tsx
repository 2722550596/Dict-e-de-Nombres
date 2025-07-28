import React, { useState } from 'react';
import { useLongTextNavigation } from '../../hooks/useLongTextNavigation';
import { LengthContent, TimeContent } from '../../types/game.types';
import { LongTextPracticeGrid } from '../LongTextPracticeGrid';

// Example time content for demonstration
const exampleTimeContent: TimeContent[] = [
  {
    type: 'year',
    value: '2024',
    displayText: '2024年',
    acceptedAnswers: ['2024年', '2024', '二零二四年']
  },
  {
    type: 'month',
    value: '1',
    displayText: '1月',
    acceptedAnswers: ['1月', '一月', 'January']
  },
  {
    type: 'fullDate',
    value: '2024-01-15',
    displayText: '2024年1月15日',
    acceptedAnswers: ['2024年1月15日', '2024-01-15', '二零二四年一月十五日']
  }
];

// Example length content for demonstration
const exampleLengthContent: LengthContent[] = [
  {
    value: 5,
    unit: '米',
    displayText: '5米',
    acceptedFormats: ['5米', '5m', '五米']
  },
  {
    value: 2.5,
    unit: '公里',
    displayText: '2.5公里',
    acceptedFormats: ['2.5公里', '2.5km', '二点五公里']
  }
];

export const LongTextPracticeExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [contentType, setContentType] = useState<'time' | 'length'>('time');
  
  const items = contentType === 'time' ? exampleTimeContent : exampleLengthContent;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const {
    userAnswers,
    handleInputChange,
    handleKeyDown,
    setInputRef,
    resetAnswers,
    getValidationResults
  } = useLongTextNavigation({
    items,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
    const results = getValidationResults();
    console.log('Validation results:', results);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    resetAnswers();
    setCurrentPage(0);
  };

  const simulateAudioPlay = () => {
    setAudioState('playing');
    setCurrentPlayingIndex(0);
    
    // Simulate playing through items
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= items.length) {
        setAudioState('idle');
        setCurrentPlayingIndex(-1);
        clearInterval(interval);
      } else {
        setCurrentPlayingIndex(index);
      }
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Long Text Practice Grid Example</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>
          Content Type:
          <select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value as 'time' | 'length')}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="time">Time Content</option>
            <option value="length">Length Content</option>
          </select>
        </label>
        
        <button onClick={simulateAudioPlay} disabled={audioState === 'playing'}>
          {audioState === 'playing' ? 'Playing...' : 'Simulate Audio Play'}
        </button>
      </div>

      <LongTextPracticeGrid
        items={items}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        currentPlayingIndex={currentPlayingIndex}
        audioState={audioState}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        setInputRef={setInputRef}
      />

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>Page {currentPage + 1} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
        
        {isSubmitted ? (
          <button onClick={handleReset}>Reset</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>

      {isSubmitted && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
          <h3>Results:</h3>
          <pre>{JSON.stringify(getValidationResults(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};