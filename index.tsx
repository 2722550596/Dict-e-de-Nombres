import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const ITEMS_PER_PAGE = 50;

// --- Utility Functions ---

function generateNumbers(range: [number, number], quantity: number): number[] {
  const [min, max] = range;
  const fullRange = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const result: number[] = [];

  while (result.length < quantity) {
    const shuffledCycle = [...fullRange].sort(() => Math.random() - 0.5);
    const remainingNeeded = quantity - result.length;
    result.push(...shuffledCycle.slice(0, remainingNeeded));
  }
  return result;
}

// --- Components ---

interface Settings {
  range: [number, number];
  quantity: number;
}

interface SettingsPanelProps {
  onStart: (settings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onStart }) => {
  const [rangeKey, setRangeKey] = useState('0-20');
  const [quantity, setQuantity] = useState(20);
  const [customMin, setCustomMin] = useState(0);
  const [customMax, setCustomMax] = useState(999);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let range: [number, number];
    if (rangeKey === 'custom') {
      range = [Math.max(0, customMin), Math.min(999, customMax)];
    } else if (rangeKey === 'tens') {
      range = [10, 90]; // Special case handled in generation
    } else {
      const [min, max] = rangeKey.split('-').map(Number);
      range = [min, max];
    }

    let finalQuantity = Math.max(1, Math.min(200, quantity));

    if (rangeKey === 'tens') {
      const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const result: number[] = [];
       while (result.length < finalQuantity) {
        const shuffledCycle = [...tens].sort(() => Math.random() - 0.5);
        const remainingNeeded = finalQuantity - result.length;
        result.push(...shuffledCycle.slice(0, remainingNeeded));
      }
      // Trick: use a special range key and pass numbers directly
      onStart({ range: [-1, -1], quantity: finalQuantity, numbers: result } as any);

    } else {
      onStart({ range, quantity: finalQuantity });
    }
  };

  return (
    <div className="settings-panel">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulté (Plage de nombres)</label>
          <select id="difficulty" className="select" value={rangeKey} onChange={(e) => setRangeKey(e.target.value)}>
            <option value="0-9">0-9</option>
            <option value="0-20">0-20</option>
            <option value="0-69">0-69</option>
            <option value="70-99">70-99</option>
            <option value="0-99">0-99</option>
            <option value="100-199">100-199 (Centaines)</option>
            <option value="100-999">100-999 (Tous les centaines)</option>
            <option value="tens">Nombres ronds (10, 20...90)</option>
            <option value="custom">Personnalisée...</option>
          </select>
        </div>

        {rangeKey === 'custom' && (
          <div className="form-group">
            <label>Plage personnalisée</label>
            <div className="custom-range-inputs">
              <input type="number" className="input" value={customMin} onChange={(e) => setCustomMin(parseInt(e.target.value, 10) || 0)} min="0" max="999" />
              <span>à</span>
              <input type="number" className="input" value={customMax} onChange={(e) => setCustomMax(parseInt(e.target.value, 10) || 0)} min="0" max="999" />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="quantity">Quantité</label>
          <input id="quantity" type="number" className="input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} min="1" max="200" />
        </div>

        <button type="submit" className="button button-primary start-button">
          Commencer l'exercice
        </button>
      </form>
    </div>
  );
};


interface PracticePanelProps {
  settings: Settings & { numbers?: number[] };
  onReset: () => void;
}

const PracticePanel: React.FC<PracticePanelProps> = ({ settings, onReset }) => {
  const [numbersToGuess, setNumbersToGuess] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [playbackInterval, setPlaybackInterval] = useState(1.0); // 新增：播放间隔时间（秒）
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0); // 新增：当前播放索引的state

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSpeechIndex = useRef(0);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const playbackSpeedRef = useRef(1);
  const speedChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generated = settings.numbers || generateNumbers(settings.range, settings.quantity);
    setNumbersToGuess(generated);
    setUserAnswers(Array(generated.length).fill(''));
    inputRefs.current = Array(generated.length).fill(null);
    setCurrentPlayingIndex(0); // 重置播放索引
    currentSpeechIndex.current = 0; // 重置ref
  }, [settings]);

  // 同步播放速度到 ref
  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  // 清理函数：组件卸载时停止播放和清理定时器
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      window.speechSynthesis.cancel();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
      }
      if (intervalChangeTimeoutRef.current) {
        clearTimeout(intervalChangeTimeoutRef.current);
      }
    };
  }, []);

  // 统一的状态更新函数
  const updatePlaybackState = useCallback((newState: 'idle' | 'playing' | 'paused') => {
    setAudioState(newState);
    isPlayingRef.current = newState === 'playing';
  }, []);

  // 播放当前索引的数字
  const playCurrentNumber = useCallback((speed?: number) => {
    const index = currentSpeechIndex.current;
    if (index >= numbersToGuess.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0); // 重置播放索引
      return;
    }

    // 更新当前播放索引的state，触发UI重新渲染
    setCurrentPlayingIndex(index);

    const number = numbersToGuess[index];
    const utterance = new SpeechSynthesisUtterance(number.toString());
    utterance.lang = 'fr-FR';
    utterance.rate = speed !== undefined ? speed : playbackSpeedRef.current;

    utterance.onend = () => {
      // 清除之前的定时器
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }

      // 只有在仍在播放状态时才继续下一个数字
      if (isPlayingRef.current) {
        if (index + 1 < numbersToGuess.length) {
          // 准备播放下一个数字
          currentSpeechIndex.current = index + 1;
          playbackTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              playCurrentNumber();
            }
          }, playbackInterval * 1000); // 转换为毫秒
        } else {
          // 播放完成 - 显示100%进度并保持
          setCurrentPlayingIndex(numbersToGuess.length); // 显示100%进度
          updatePlaybackState('idle');
          // 不自动重置，保持100%状态，等待用户点击重播
        }
      }
    };

    utterance.onerror = (event) => {
      // 只有在真正的错误时才重置状态，忽略因为 cancel() 导致的错误
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        updatePlaybackState('idle');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [numbersToGuess, updatePlaybackState, playbackInterval]);

  // 开始播放序列的函数
  const startPlayback = useCallback((fromIndex: number = 0) => {
    if (fromIndex >= numbersToGuess.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0);
      return;
    }

    currentSpeechIndex.current = fromIndex;
    setCurrentPlayingIndex(fromIndex); // 同步更新state
    updatePlaybackState('playing');
    playCurrentNumber();
  }, [numbersToGuess, updatePlaybackState, playCurrentNumber, playbackInterval]);
  
  const handlePlayPause = () => {
    if (audioState === 'playing') {
      // 暂停播放
      updatePlaybackState('paused');
      window.speechSynthesis.cancel(); // 停止当前语音
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
    } else {
      // 开始或恢复播放
      if (audioState === 'paused') {
        // 从当前位置恢复播放
        updatePlaybackState('playing');
        playCurrentNumber();
      } else {
        // 从头开始播放
        startPlayback(0);
      }
    }
  };

  const handleReplay = () => {
    // 停止当前播放
    window.speechSynthesis.cancel();
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if (speedChangeTimeoutRef.current) {
      clearTimeout(speedChangeTimeoutRef.current);
      speedChangeTimeoutRef.current = null;
    }
    if (intervalChangeTimeoutRef.current) {
      clearTimeout(intervalChangeTimeoutRef.current);
      intervalChangeTimeoutRef.current = null;
    }

    // 重置进度到开始位置
    currentSpeechIndex.current = 0;
    setCurrentPlayingIndex(0);

    // 使用 setTimeout 确保状态更新后再开始播放
    setTimeout(() => {
      startPlayback(0);
    }, 10);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);

    // 如果正在播放，需要应用新速度
    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
      // 清除所有定时器，防止竞态条件
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
        speedChangeTimeoutRef.current = null;
      }
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }

      // 停止当前播放
      window.speechSynthesis.cancel();

      // 保持播放状态，使用新速度重新播放当前数字
      speedChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          // 重新播放当前数字，让用户立即听到速度变化
          playCurrentNumber(newSpeed);
        }
        speedChangeTimeoutRef.current = null;
      }, 50);
    }
  };

  const handleIntervalChange = (newInterval: number) => {
    const validInterval = Math.max(0.1, Math.min(10, newInterval || 1.0));
    setPlaybackInterval(validInterval);

    // 如果正在播放，需要应用新间隔
    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
      // 清除所有定时器，防止竞态条件
      if (intervalChangeTimeoutRef.current) {
        clearTimeout(intervalChangeTimeoutRef.current);
        intervalChangeTimeoutRef.current = null;
      }
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
        speedChangeTimeoutRef.current = null;
      }

      // 停止当前播放
      window.speechSynthesis.cancel();

      // 保持播放状态，使用新间隔重新播放当前数字
      intervalChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          // 重新播放当前数字，新间隔将在下一个数字时生效
          playCurrentNumber();
        }
        intervalChangeTimeoutRef.current = null;
      }, 50);
    }
  };
  
  // 获取数字的位数
  const getNumberDigits = (num: number): number => {
    return num.toString().length;
  };

  // 判断输入是否完整（达到预期位数或用户明确表示完成）
  const isInputComplete = (value: string, expectedDigits: number): boolean => {
    const trimmedValue = value.trim();
    // 如果输入长度达到预期位数，认为完成
    if (trimmedValue.length === expectedDigits) {
      return true;
    }
    // 如果输入以空格结尾，认为用户表示完成（适用于个位数）
    if (value.endsWith(' ') && trimmedValue.length > 0) {
      return true;
    }
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const currentNumber = numbersToGuess[index];
    const expectedDigits = getNumberDigits(currentNumber);
    const maxLength = Math.max(3, expectedDigits); // 最少3位，支持百位数

    // 只允许数字和空格，限制最大长度
    const value = e.target.value.replace(/[^0-9 ]/g, '').slice(0, maxLength);
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);

    // 智能自动跳转：当输入完整时跳转到下一个输入框
    if (isInputComplete(value, expectedDigits) && index < numbersToGuess.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && userAnswers[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleSubmit = () => {
    // 提交时自动暂停音频
    if (audioState === 'playing') {
      updatePlaybackState('paused');
      window.speechSynthesis.cancel();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
    }
    setIsSubmitted(true);
  };

  const totalPages = Math.ceil(numbersToGuess.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = numbersToGuess.slice(startIndex, endIndex);

  // 计算进度
  const progressPercentage = numbersToGuess.length > 0 ? (currentPlayingIndex / numbersToGuess.length) * 100 : 0;
  const currentPlayingGlobalIndex = currentPlayingIndex;

  return (
    <div className="practice-panel">
      <div className="audio-controls">
        <button className="button" onClick={handlePlayPause} disabled={isSubmitted}>{audioState === 'playing' ? 'Pause' : 'Lecture'}</button>
        <button className="button" onClick={handleReplay} disabled={isSubmitted}>Répéter</button>
        <div className="speed-control">
          <label htmlFor="speed">Vitesse:</label>
          <select id="speed" className="select" style={{width: 'auto'}} value={playbackSpeed} onChange={e => handleSpeedChange(Number(e.target.value))} disabled={isSubmitted}>
            <option value="0.7">Lente</option>
            <option value="1">Normale</option>
            <option value="1.3">Rapide</option>
          </select>
        </div>
        <div className="interval-control">
          <label htmlFor="interval">Intervalle:</label>
          <input
            id="interval"
            type="number"
            className="input"
            style={{width: '80px'}}
            value={playbackInterval}
            onChange={e => handleIntervalChange(Number(e.target.value))}
            step="0.1"
            min="0.1"
            max="10"
            disabled={isSubmitted}
          />
          <span>s</span>
        </div>

        {/* 进度指示器 */}
        <div className="progress-section">
          <div className="progress-info">
            <span>Progression: {currentPlayingIndex} / {numbersToGuess.length}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid-container">
        {currentItems.map((number, i) => {
          const globalIndex = startIndex + i;
          const isCurrentPlaying = globalIndex === currentPlayingGlobalIndex && audioState === 'playing';
          return (
            <div key={globalIndex} className={`grid-cell ${isCurrentPlaying ? 'current-playing' : ''}`}>
              {isSubmitted ? (
                 <FeedbackCell userAnswer={userAnswers[globalIndex]} correctAnswer={number} />
              ) : (
                <input
                  ref={el => { inputRefs.current[globalIndex] = el; }}
                  type="text"
                  className="input"
                  value={userAnswers[globalIndex]}
                  onChange={(e) => handleInputChange(e, globalIndex)}
                  onKeyDown={(e) => handleKeyDown(e, globalIndex)}
                  maxLength={Math.max(3, getNumberDigits(numbersToGuess[globalIndex]))}
                  aria-label={`Réponse pour le numéro ${globalIndex + 1}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="practice-actions">
        {isSubmitted ? (
            <button onClick={onReset} className="button button-primary">Recommencer</button>
        ) : (
             <div/> // Placeholder for alignment
        )}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button className="button" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>Précédent</button>
            <span>Page {currentPage + 1} / {totalPages}</span>
            <button className="button" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1}>Suivant</button>
          </div>
        )}
        {!isSubmitted && (
            <button onClick={handleSubmit} className="button button-primary">Soumettre</button>
        )}
      </div>
    </div>
  );
};

interface FeedbackCellProps {
    userAnswer: string;
    correctAnswer: number;
}

const FeedbackCell: React.FC<FeedbackCellProps> = ({ userAnswer, correctAnswer }) => {
    const normalizedUserAnswer = userAnswer.trim();
    const isCorrect = parseInt(normalizedUserAnswer, 10) === correctAnswer;
    const isEmpty = normalizedUserAnswer === '';

    const className = `feedback-cell ${isCorrect ? 'correct' : 'incorrect'}`;

    // 根据数字位数智能格式化显示
    const formatCorrectAnswer = (num: number): string => {
        // 错误答案显示时，所有数字都直接显示，不添加前导零
        return num.toString();
    };

    return (
        <div className={className}>
            {isCorrect ? (
                <span>{userAnswer}</span>
            ) : (
                <div className="feedback-content">
                    {!isEmpty && <span className="user-answer-wrong">{userAnswer}</span>}
                    <span className="correct-answer">{formatCorrectAnswer(correctAnswer)}</span>
                </div>
            )}
        </div>
    );
};


const App = () => {
  const [view, setView] = useState<'settings' | 'practice'>('settings');
  const [settings, setSettings] = useState<Settings | null>(null);

  const handleStartPractice = (newSettings: Settings) => {
    setSettings(newSettings);
    setView('practice');
  };

  const handleReset = () => {
    setSettings(null);
    setView('settings');
  };

  return (
    <div className="app-container">
      <h1>Dictée de Nombres</h1>
      <p className="app-subtitle">Améliorez votre compréhension des nombres en français</p>
      {view === 'settings' ? (
        <SettingsPanel onStart={handleStartPractice} />
      ) : settings ? (
        <PracticePanel settings={settings} onReset={handleReset} />
      ) : null}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);