import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDirectionAudio } from '../hooks/useDirectionAudio';
import { useGameEffects } from '../hooks/useGameEffects';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { useLanguage } from '../hooks/useLanguage';
import { DirectionContent, ExerciseSettings } from '../types/game.types';
import { generateDirectionContent, getAvailableDirections } from '../utils/directionGeneration';
import { GameDataManager, RewardInfo } from '../utils/gameData';
import { ConfirmModal } from './ConfirmModal';
import { DirectionButtonGrid } from './DirectionButtonGrid';
import './DirectionDictationPanel.css';
import { RestartModal } from './RestartModal';
import { RewardModal } from './RewardModal';

// 获取当前听写语言设置
function getCurrentDictationLanguage(): string {
    const saved = localStorage.getItem('selectedDictationLanguage');
    if (saved) {
        // 映射简短代码到完整语言代码
        const languageMap: Record<string, string> = {
            'fr': 'fr-FR',
            'en': 'en-US',
            'de': 'de-DE',
            'es': 'es-ES',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'zh': 'zh-CN',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'ar': 'ar-SA',
            'ru': 'ru-RU',
            'nl': 'nl-NL',
            'sv': 'sv-SE',
            'no': 'no-NO'
        };
        return languageMap[saved] || 'fr-FR';
    }
    return 'fr-FR'; // 默认法语
}

interface DirectionDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}

interface DirectionGameState {
  currentQuestionIndex: number;
  userAnswers: string[];
  correctAnswers: boolean[];
  feedbackState: 'none' | 'correct' | 'incorrect';
  selectedDirection: string | null;
  isCompleted: boolean;
  score: number;
  streak: number;
  maxStreak: number;
}

export const DirectionDictationPanel: React.FC<DirectionDictationPanelProps> = ({
  settings,
  onReset
}) => {
  const { translations } = useLanguage();

  // Direction content state
  const [directionContents, setDirectionContents] = useState<DirectionContent[]>([]);
  const [availableDirections, setAvailableDirections] = useState<DirectionContent[]>([]);

  // Game state
  const [gameState, setGameState] = useState<DirectionGameState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    correctAnswers: [],
    feedbackState: 'none',
    selectedDirection: null,
    isCompleted: false,
    score: 0,
    streak: 0,
    maxStreak: 0
  });

  // Modal states
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<RewardInfo | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-play timer
  const [autoPlayTimer, setAutoPlayTimer] = useState<NodeJS.Timeout | null>(null);

  // Generate direction content based on settings
  useEffect(() => {
    const directionTypes = settings.directionTypes || ['cardinal'];
    const contents = generateDirectionContent(directionTypes, settings.quantity);
    setDirectionContents(contents);

    // Generate all available directions for the selected types
    const allAvailable: DirectionContent[] = [];
    directionTypes.forEach(type => {
      const typeDirections = getAvailableDirections(type, getCurrentDictationLanguage());
      allAvailable.push(...typeDirections);
    });
    setAvailableDirections(allAvailable);

    // Reset game state
    setGameState({
      currentQuestionIndex: 0,
      userAnswers: new Array(settings.quantity).fill(''),
      correctAnswers: new Array(settings.quantity).fill(false),
      feedbackState: 'none',
      selectedDirection: null,
      isCompleted: false,
      score: 0,
      streak: 0,
      maxStreak: 0
    });
  }, [settings]);

  // Get current question text for audio
  const currentQuestionText = useMemo(() => {
    if (gameState.currentQuestionIndex < directionContents.length) {
      return directionContents[gameState.currentQuestionIndex]?.displayText || null;
    }
    return null;
  }, [directionContents, gameState.currentQuestionIndex]);

  // Direction-specific audio hook
  const {
    audioState,
    playCurrentText,
    replayCurrentText,
    stopPlayback
  } = useDirectionAudio({
    currentText: currentQuestionText,
    onPlaybackComplete: () => {
      // Audio playback completed, user can now answer
    }
  });

  // Game effects
  const { playInteractionSound: playGameSound } = useGameEffects({
    userAnswers: gameState.userAnswers,
    correctAnswers: directionContents.map(content => content.value),
    isSubmitted: gameState.isCompleted
  });

  // Global audio effects
  const { playInteractionSound } = useGlobalAudioEffects();

  // Get current question
  const currentQuestion = useMemo(() => {
    if (gameState.currentQuestionIndex < directionContents.length) {
      return directionContents[gameState.currentQuestionIndex];
    }
    return null;
  }, [directionContents, gameState.currentQuestionIndex]);

  // Handle direction selection with instant feedback
  const handleDirectionSelect = useCallback((selectedValue: string) => {
    if (gameState.feedbackState !== 'none' || gameState.isCompleted) {
      return;
    }

    const currentIndex = gameState.currentQuestionIndex;
    const correctAnswer = directionContents[currentIndex]?.value;
    const isCorrect = selectedValue === correctAnswer;

    // Update game state with selection and feedback
    setGameState(prev => {
      const newUserAnswers = [...prev.userAnswers];
      const newCorrectAnswers = [...prev.correctAnswers];

      newUserAnswers[currentIndex] = selectedValue;
      newCorrectAnswers[currentIndex] = isCorrect;

      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newScore = prev.score + (isCorrect ? 1 : 0);

      return {
        ...prev,
        userAnswers: newUserAnswers,
        correctAnswers: newCorrectAnswers,
        feedbackState: isCorrect ? 'correct' : 'incorrect',
        selectedDirection: selectedValue,
        score: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak
      };
    });

    // Play feedback sound
    playGameSound(isCorrect ? 'correct' : 'incorrect');

    // Auto-advance to next question after feedback delay
    const timer = setTimeout(() => {
      setGameState(prev => {
        const nextIndex = prev.currentQuestionIndex + 1;

        if (nextIndex >= directionContents.length) {
          // Game completed
          handleGameComplete(prev);
          return {
            ...prev,
            isCompleted: true,
            feedbackState: 'none',
            selectedDirection: null
          };
        } else {
          // Move to next question
          return {
            ...prev,
            currentQuestionIndex: nextIndex,
            feedbackState: 'none',
            selectedDirection: null
          };
        }
      });

      // Next question will auto-play via useDirectionAudio hook
    }, 1500); // 1.5 second feedback delay

    setAutoPlayTimer(timer);
  }, [gameState.feedbackState, gameState.isCompleted, gameState.currentQuestionIndex, directionContents, playGameSound]);

  // Handle game completion
  const handleGameComplete = useCallback((finalState: DirectionGameState) => {
    // Calculate session results for direction dictation
    const sessionResults = directionContents.map((content, index) => ({
      number: index, // Use index as identifier
      correct: finalState.correctAnswers[index],
      userAnswer: finalState.userAnswers[index] || '',
      mode: 'direction' as const,
      operator: undefined
    }));

    const reward = GameDataManager.updateSessionResults(sessionResults);
    setRewardInfo(reward);
    setShowRewardModal(true);
  }, [directionContents]);

  // Handle restart button click
  const handleRestartClick = useCallback(() => {
    setShowRestartModal(true);
  }, []);

  // Handle retest current content
  const handleRetestCurrent = useCallback(() => {
    // Reset game state but keep same content
    setGameState({
      currentQuestionIndex: 0,
      userAnswers: new Array(settings.quantity).fill(''),
      correctAnswers: new Array(settings.quantity).fill(false),
      feedbackState: 'none',
      selectedDirection: null,
      isCompleted: false,
      score: 0,
      streak: 0,
      maxStreak: 0
    });

    setShowRestartModal(false);

    // Clear any pending timers
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer);
      setAutoPlayTimer(null);
    }
  }, [settings.quantity, autoPlayTimer]);

  // Handle new practice generation
  const handleNewPractice = useCallback(() => {
    const directionTypes = settings.directionTypes || ['cardinal'];
    const newContents = generateDirectionContent(directionTypes, settings.quantity);

    setShowRestartModal(false);
    setDirectionContents(newContents);

    // Clear any pending timers
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer);
      setAutoPlayTimer(null);
    }
  }, [settings, autoPlayTimer]);

  // Handle return to home
  const handleReturnHomeClick = useCallback(() => {
    if (gameState.isCompleted) {
      onReset();
    } else {
      setShowConfirmModal(true);
    }
  }, [gameState.isCompleted, onReset]);

  // Confirm return to home
  const handleConfirmReturnHome = useCallback(() => {
    setShowConfirmModal(false);
    onReset();
  }, [onReset]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
      }
    };
  }, [autoPlayTimer]);

  // Auto-play is now handled by useDirectionAudio hook

  if (directionContents.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="practice-panel">
      {/* Simplified audio controls for direction dictation */}
      <div className="direction-audio-controls">
        <button
          onClick={playCurrentText}
          disabled={audioState.isPlaying || !audioState.canPlay}
          className="button button-primary"
        >
          {audioState.isPlaying ?
            (translations.play || 'Playing...') :
            (translations.newModeTexts?.playCurrentQuestion || 'Play Current Question')
          }
        </button>
        <button
          onClick={replayCurrentText}
          disabled={audioState.isPlaying || !audioState.canPlay}
          className="button button-secondary"
        >
          {translations.newModeTexts?.replayQuestion || translations.replay || 'Replay'}
        </button>
        {audioState.voiceWarning && (
          <div className="voice-warning">
            {audioState.voiceWarning}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="direction-progress">
        <div className="progress-info">
          <span>
            {translations.progress || 'Progress'}: {gameState.currentQuestionIndex + (gameState.isCompleted ? 0 : 1)} / {directionContents.length}
          </span>
          <span>
            {translations.hud?.accuracy || 'Accuracy'}: {directionContents.length > 0 ? Math.round((gameState.score / Math.max(gameState.currentQuestionIndex + (gameState.isCompleted ? 0 : 1), 1)) * 100) : 0}%
          </span>
          <span>
            {translations.hud?.maxStreak || 'Max Streak'}: {gameState.maxStreak}
          </span>
        </div>
      </div>

      {/* Direction type selection info */}
      <div className="direction-types-info">
        <h3>{translations.newModeTexts?.selectedTypes || 'Selected Types'}:</h3>
        <div className="direction-type-badges">
          {(settings.directionTypes || ['cardinal']).map(type => (
            <span key={type} className="direction-type-badge">
              {type === 'cardinal' && (translations.directionTypes?.cardinal || 'Cardinal Directions')}
              {type === 'relative' && (translations.directionTypes?.relative || 'Relative Directions')}
              {type === 'spatial' && (translations.directionTypes?.spatial || 'Spatial Directions')}
            </span>
          ))}
        </div>
      </div>

      <DirectionButtonGrid
        availableDirections={availableDirections}
        currentQuestion={currentQuestion}
        onDirectionSelect={handleDirectionSelect}
        feedbackState={gameState.feedbackState}
        selectedDirection={gameState.selectedDirection || undefined}
        correctDirection={currentQuestion?.value}
      />

      <div className="practice-actions">
        {/* Left: Return home button */}
        <button
          onClick={handleReturnHomeClick}
          className="button button-secondary"
        >
          {translations.restartModal?.returnHome || 'Return Home'}
        </button>

        {/* Center: Current question info */}
        <div className="current-question-display">
          {!gameState.isCompleted && currentQuestion && (
            <div className="question-info">
              <span className="question-number">
                {translations.newModeTexts?.question || 'Question'} {gameState.currentQuestionIndex + 1}
              </span>
              <button
                className="replay-current-button"
                onClick={replayCurrentText}
                disabled={audioState.isPlaying}
              >
                🔊 {translations.replay || 'Replay'}
              </button>
            </div>
          )}
          {gameState.isCompleted && (
            <div className="completion-info">
              <span>{translations.newModeTexts?.completed || 'Completed'}! {translations.newModeTexts?.score || 'Score'}: {gameState.score}/{directionContents.length}</span>
            </div>
          )}
        </div>

        {/* Right: Restart button */}
        {gameState.isCompleted && (
          <button onClick={handleRestartClick} className="button button-primary">
            {translations.restart || 'Restart'}
          </button>
        )}
      </div>

      <RestartModal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onRetestCurrent={handleRetestCurrent}
        onNewPractice={handleNewPractice}
      />

      {rewardInfo && (
        <RewardModal
          reward={rewardInfo}
          show={showRewardModal}
          onClose={() => setShowRewardModal(false)}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title={translations.confirmModal?.returnHomeTitle || 'Confirm Return Home'}
        message={translations.confirmModal?.returnHomeMessage || 'Are you sure you want to return home? Your progress will be lost.'}
        onConfirm={handleConfirmReturnHome}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};