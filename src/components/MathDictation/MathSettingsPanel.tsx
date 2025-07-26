import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ExerciseSettings, MathOperator } from '../../types/exercise';
import { playSound } from '../../utils/audioEffects';

interface MathSettingsPanelProps {
  onStart: (settings: ExerciseSettings) => void;
}

export const MathSettingsPanel: React.FC<MathSettingsPanelProps> = ({ onStart }) => {
  const { translations } = useLanguage();
  const [rangeKey, setRangeKey] = useState('0-20');
  const [quantity, setQuantity] = useState(20);
  const [maxResult, setMaxResult] = useState(100);
  const [customMin, setCustomMin] = useState(0);
  const [customMax, setCustomMax] = useState(9999);
  const [selectedOperations, setSelectedOperations] = useState<MathOperator[]>(['+']);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleOperationChange = (operation: MathOperator, checked: boolean) => {
    if (checked) {
      setSelectedOperations(prev => [...prev, operation]);
    } else {
      setSelectedOperations(prev => prev.filter(op => op !== operation));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 清除之前的错误消息
    setErrorMessage('');

    if (selectedOperations.length === 0) {
      setErrorMessage(translations.selectAtLeastOneOperation);
      playSound('error'); // 播放错误音效
      return;
    }

    let range: [number, number];
    
    if (rangeKey === 'custom') {
      range = [Math.max(0, customMin), Math.min(9999, customMax)];
    } else if (rangeKey === 'tens') {
      range = [10, 90];
    } else {
      const [min, max] = rangeKey.split('-').map(Number);
      range = [min, max];
    }

    const settings: ExerciseSettings = {
      mode: 'math',
      range,
      quantity: Math.max(1, Math.min(200, quantity)),
      maxResult: Math.max(1, maxResult),
      operations: selectedOperations
    };

    onStart(settings);
  };

  return (
    <div className="settings-panel">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{translations.operationTypes}</label>
          <div className="operation-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedOperations.includes('+')}
                onChange={(e) => handleOperationChange('+', e.target.checked)}
              />
              <span>{translations.operations.addition}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedOperations.includes('-')}
                onChange={(e) => handleOperationChange('-', e.target.checked)}
              />
              <span>{translations.operations.subtraction}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedOperations.includes('×')}
                onChange={(e) => handleOperationChange('×', e.target.checked)}
              />
              <span>{translations.operations.multiplication}</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedOperations.includes('÷')}
                onChange={(e) => handleOperationChange('÷', e.target.checked)}
              />
              <span>{translations.operations.division}</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">{translations.difficulty}</label>
          <select 
            id="difficulty" 
            className="select" 
            value={rangeKey} 
            onChange={(e) => setRangeKey(e.target.value)}
          >
            <option value="0-9">{translations.difficulties["0-9"]}</option>
            <option value="0-20">{translations.difficulties["0-20"]}</option>
            <option value="0-69">{translations.difficulties["0-69"]}</option>
            <option value="70-99">{translations.difficulties["70-99"]}</option>
            <option value="0-99">{translations.difficulties["0-99"]}</option>
            <option value="100-199">{translations.difficulties["100-199"]}</option>
            <option value="100-999">{translations.difficulties["100-999"]}</option>
            <option value="1700-2050">{translations.difficulties["1700-2050"]}</option>
            <option value="tens">{translations.difficulties.tens}</option>
            <option value="custom">{translations.difficulties.custom}</option>
          </select>
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
          <label htmlFor="maxResult">{translations.maxResult}</label>
          <input 
            id="maxResult" 
            type="number" 
            className="input" 
            value={maxResult} 
            onChange={(e) => setMaxResult(parseInt(e.target.value, 10) || 1)} 
            min="1" 
            max="10000" 
          />
        </div>

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
          {translations.startExercise}
        </button>
      </form>
    </div>
  );
};
