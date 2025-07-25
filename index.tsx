import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './src/components/LanguageProvider';
import { LanguageSelector } from './src/components/LanguageSelector';
import { useLanguage } from './src/hooks/useLanguage';

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
  const { translations } = useLanguage();
  const [rangeKey, setRangeKey] = useState('0-20');
  const [quantity, setQuantity] = useState(20);
  const [customMin, setCustomMin] = useState(0);
  const [customMax, setCustomMax] = useState(9999);

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
          <label htmlFor="difficulty">{translations.difficulty}</label>
          <select id="difficulty" className="select" value={rangeKey} onChange={(e) => setRangeKey(e.target.value)}>
            <option value="0-9">{translations.difficulties["0-9"]}</option>
            <option value="0-20">{translations.difficulties["0-20"]}</option>
            <option value="0-69">{translations.difficulties["0-69"]}</option>
            <option value="70-99">{translations.difficulties["70-99"]}</option>
            <option value="0-99">{translations.difficulties["0-99"]}</option>
            <option value="100-199">{translations.difficulties["100-199"]}</option>
            <option value="100-999">{translations.difficulties["100-999"]}</option>
            <option value="1700-2050">{translations.difficulties["1700-2050"]}</option>
            <option value="tens">{translations.difficulties["tens"]}</option>
            <option value="custom">{translations.difficulties["custom"]}</option>
          </select>
        </div>

        {rangeKey === 'custom' && (
          <div className="form-group">
            <label>{translations.customRange}</label>
            <div className="custom-range-inputs">
              <input type="number" className="input" value={customMin} onChange={(e) => setCustomMin(parseInt(e.target.value, 10) || 0)} min="0" max="9999" />
              <span>à</span>
              <input type="number" className="input" value={customMax} onChange={(e) => setCustomMax(parseInt(e.target.value, 10) || 0)} min="0" max="9999" />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="quantity">{translations.quantity}</label>
          <input id="quantity" type="number" className="input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} min="1" max="200" />
        </div>

        <button type="submit" className="button button-primary start-button">
          {translations.startExercise}
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
  const { translations } = useLanguage();
  const [numbersToGuess, setNumbersToGuess] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [playbackInterval, setPlaybackInterval] = useState(1.0);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);

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
    setCurrentPlayingIndex(0);
    currentSpeechIndex.current = 0;

    checkVoiceSupport();
    checkVoiceSupport();
  }, [settings]);

  const checkVoiceSupport = useCallback(() => {
    if (!window.speechSynthesis) {
      setVoiceWarning(translations.warnings.noSpeechSupport);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(checkVoices, 100);
        return;
      }

      // 始终检查法语语音，不管界面语言是什么
      const frenchVoice = voices.find(v => 
        /fr.*fr/i.test(v.lang) || /french/i.test(v.name) || /fr/i.test(v.lang)
      );

      if (!frenchVoice) {
        setVoiceWarning(translations.warnings.noVoiceFound);
      } else {
        setVoiceWarning(null);
      }
    };

    checkVoices();
  }, [translations]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);


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

  const updatePlaybackState = useCallback((newState: 'idle' | 'playing' | 'paused') => {
    setAudioState(newState);
    isPlayingRef.current = newState === 'playing';
  }, []);

  const getFrenchVoice = useCallback(() => {
    if (!window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    const storageKey = 'selectedFrenchVoice';

    try {
      const savedVoiceData = localStorage.getItem(storageKey);
      if (savedVoiceData) {
        const voiceData = JSON.parse(savedVoiceData);

        const savedVoice = voices.find(voice =>
          voice.voiceURI === voiceData.voiceURI ||
          (voice.name === voiceData.name && voice.lang === voiceData.lang)
        );

        if (savedVoice) {
          console.log('Using saved French voice:', savedVoice.name, savedVoice.lang);
          return savedVoice;
        } else {
          console.warn('Saved voice no longer available, using default French voice');
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error reading saved voice settings:', error);
      localStorage.removeItem(storageKey);
    }

    // 始终查找法语语音，不管界面语言是什么
    const frenchVoicePatterns = [
      /fr.*fr/i,
      /french/i,
      /fr/i
    ];

    for (const pattern of frenchVoicePatterns) {
      const voice = voices.find(v =>
        pattern.test(v.lang) || pattern.test(v.name)
      );
      if (voice) {
        console.log('Found default French voice:', voice.name, voice.lang);
        return voice;
      }
    }

    console.warn('No French voice found, available voices:', voices.map(v => `${v.name} (${v.lang})`));
    return null;
  }, []);

  const playCurrentNumber = useCallback((speed?: number) => {
    const index = currentSpeechIndex.current;
    if (index >= numbersToGuess.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0);
      return;
    }

    setCurrentPlayingIndex(index);

    const number = numbersToGuess[index];
    const utterance = new SpeechSynthesisUtterance(number.toString());

    // 始终使用法语进行TTS，不管界面语言是什么
    utterance.lang = 'fr-FR';

    const frenchVoice = getFrenchVoice();
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    } else {
      console.warn('Warning: No French voice found, default voice may be used');
    }

    utterance.rate = speed !== undefined ? speed : playbackSpeedRef.current;

    utterance.onend = () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }

      if (isPlayingRef.current) {
        if (index + 1 < numbersToGuess.length) {
          currentSpeechIndex.current = index + 1;
          playbackTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              playCurrentNumber();
            }
          }, playbackInterval * 1000);
        } else {
          setCurrentPlayingIndex(numbersToGuess.length);
          updatePlaybackState('idle');
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
          setVoiceWarning(translations.warnings.noVoiceFound);
        }
        updatePlaybackState('idle');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [numbersToGuess, updatePlaybackState, playbackInterval]);

  const startPlayback = useCallback((fromIndex: number = 0) => {
    if (fromIndex >= numbersToGuess.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0);
      return;
    }

    currentSpeechIndex.current = fromIndex;
    setCurrentPlayingIndex(fromIndex);
    updatePlaybackState('playing');
    playCurrentNumber();
  }, [numbersToGuess, updatePlaybackState, playCurrentNumber, playbackInterval]);
  
  const handlePlayPause = () => {
    if (audioState === 'idle') {
      checkVoiceSupport();
    }

    if (audioState === 'playing') {
      updatePlaybackState('paused');
      window.speechSynthesis.cancel();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
    } else {
      if (audioState === 'paused') {
        updatePlaybackState('playing');
        playCurrentNumber();
      } else {
        startPlayback(0);
      }
    }
  };

  const handleReplay = () => {
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

    currentSpeechIndex.current = 0;
    setCurrentPlayingIndex(0);

    setTimeout(() => {
      startPlayback(0);
    }, 10);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);

    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
        speedChangeTimeoutRef.current = null;
      }
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }

      window.speechSynthesis.cancel();

      speedChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playCurrentNumber(newSpeed);
        }
        speedChangeTimeoutRef.current = null;
      }, 50);
    }
  };

  const handleIntervalChange = (newInterval: number) => {
    const validInterval = Math.max(0.1, Math.min(10, newInterval || 1.0));
    setPlaybackInterval(validInterval);

    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
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

      window.speechSynthesis.cancel();

      intervalChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playCurrentNumber();
        }
        intervalChangeTimeoutRef.current = null;
      }, 50);
    }
  };
  
  const getNumberDigits = (num: number): number => {
    return num.toString().length;
  };

  const isInputComplete = (value: string, expectedDigits: number): boolean => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === expectedDigits) {
      return true;
    }
    if (value.endsWith(' ') && trimmedValue.length > 0) {
      return true;
    }
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const currentNumber = numbersToGuess[index];
    const expectedDigits = getNumberDigits(currentNumber);
    const maxLength = Math.max(3, expectedDigits);

    const value = e.target.value.replace(/[^0-9 ]/g, '').slice(0, maxLength);
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);

    if (isInputComplete(value, expectedDigits) && index < numbersToGuess.length - 1) {
      const nextIndex = index + 1;
      const currentPageIndex = Math.floor(index / ITEMS_PER_PAGE);
      const nextPageIndex = Math.floor(nextIndex / ITEMS_PER_PAGE);

      if (nextPageIndex > currentPageIndex && nextPageIndex < totalPages) {
        setCurrentPage(nextPageIndex);
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
        }, 50);
      } else {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && userAnswers[index] === '' && index > 0) {
      const prevIndex = index - 1;
      const currentPageIndex = Math.floor(index / ITEMS_PER_PAGE);
      const prevPageIndex = Math.floor(prevIndex / ITEMS_PER_PAGE);

      if (prevPageIndex < currentPageIndex && prevPageIndex >= 0) {
        setCurrentPage(prevPageIndex);
        setTimeout(() => {
          inputRefs.current[prevIndex]?.focus();
        }, 50);
      } else {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };
  
  const handleSubmit = () => {
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

  const progressPercentage = numbersToGuess.length > 0 ? (currentPlayingIndex / numbersToGuess.length) * 100 : 0;
  const currentPlayingGlobalIndex = currentPlayingIndex;

  return (
    <div className="practice-panel">
      {voiceWarning && (
        <div className="voice-warning" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#856404'
        }}>
          ⚠️ {voiceWarning}
        </div>
      )}
      <div className="audio-controls">
        <button className="button" onClick={handlePlayPause} disabled={isSubmitted}>{audioState === 'playing' ? translations.pause : translations.play}</button>
        <button className="button" onClick={handleReplay} disabled={isSubmitted}>{translations.replay}</button>
        <div className="speed-control">
          <label htmlFor="speed">{translations.speed}</label>
          <select id="speed" className="select" style={{width: 'auto'}} value={playbackSpeed} onChange={e => handleSpeedChange(Number(e.target.value))} disabled={isSubmitted}>
            <option value="0.7">{translations.speeds.slow}</option>
            <option value="1">{translations.speeds.normal}</option>
            <option value="1.3">{translations.speeds.fast}</option>
          </select>
        </div>
        <div className="interval-control">
          <label htmlFor="interval">{translations.interval}</label>
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


        <div className="progress-section">
          <div className="progress-info">
            <span>{translations.progress} {currentPlayingIndex} / {numbersToGuess.length}</span>
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
            <button onClick={onReset} className="button button-primary">{translations.restart}</button>
        ) : (
             <div/> // Placeholder for alignment
        )}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button className="button" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>{translations.previous}</button>
            <span>{translations.page} {currentPage + 1} / {totalPages}</span>
            <button className="button" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1}>{translations.next}</button>
          </div>
        )}
        {!isSubmitted && (
            <button onClick={handleSubmit} className="button button-primary">{translations.submit}</button>
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

    const formatCorrectAnswer = (num: number): string => {
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


const AppContent = () => {
  const { translations } = useLanguage();
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
      <div className="app-header">
        <button
          className="debug-button"
          onClick={() => window.open('./voice-test.html', '_blank')}
          title="Debug Voice Test"
        >
          🔧
        </button>
        <LanguageSelector />
      </div>

      <h1>{translations.appTitle}</h1>
      <p className="app-subtitle">{translations.appSubtitle}</p>
      {view === 'settings' ? (
        <SettingsPanel onStart={handleStartPractice} />
      ) : settings ? (
        <PracticePanel settings={settings} onReset={handleReset} />
      ) : null}
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);