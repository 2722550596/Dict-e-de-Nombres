import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useGameEffects } from '../hooks/useGameEffects';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { useLongTextNavigation } from '../hooks/useLongTextNavigation';
import { useLanguage } from '../hooks/useLanguage';
import { ExerciseSettings, LengthContent } from '../types/game.types';
import { GameDataManager, RewardInfo } from '../utils/gameData';
import { generateLengthContent, validateLengthAnswer } from '../utils/lengthGeneration';
import { AudioControls } from './AudioControls';
import { ConfirmModal } from './ConfirmModal';
import { LongTextPracticeGrid } from './LongTextPracticeGrid';
import { RestartModal } from './RestartModal';
import { RewardModal } from './RewardModal';

const ITEMS_PER_PAGE = 20; // Smaller page size for long text content

interface LengthDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}

export const LengthDictationPanel: React.FC<LengthDictationPanelProps> = ({ settings, onReset }) => {
  const { translations } = useLanguage();
  const [lengthContents, setLengthContents] = useState<LengthContent[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<RewardInfo | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generate length content based on settings
  useEffect(() => {
    const lengthUnits = settings.lengthUnits || ['米', '厘米', '毫米'];
    const lengthRange = settings.lengthRange || [1, 100];
    const contents = generateLengthContent(lengthUnits, lengthRange, settings.quantity);
    setLengthContents(contents);
  }, [settings]);

  // Prepare audio texts for TTS
  const audioTexts = useMemo(() => {
    return lengthContents.map(content => content.displayText);
  }, [lengthContents]);

  // Audio player hook
  const {
    audioState,
    currentPlayingIndex,
    playbackSpeed,
    playbackInterval,
    voiceWarning,
    playedItems,
    handlePlayPause,
    handleReplay,
    handleSpeedChange,
    handleIntervalChange,
    stopPlayback
  } = useAudioPlayer({
    items: audioTexts,
    onPlaybackComplete: () => {
      // Handle playback completion if needed
    }
  });

  const totalPages = Math.ceil(lengthContents.length / ITEMS_PER_PAGE);

  // Long text navigation hook
  const {
    userAnswers,
    handleInputChange,
    handleKeyDown,
    setInputRef,
    setUserAnswers,
    validateAnswer,
    resetAnswers
  } = useLongTextNavigation({
    items: lengthContents,
    currentPage,
    setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalPages
  });

  // Game effects
  const { playInteractionSound: playGameSound } = useGameEffects({
    userAnswers,
    correctAnswers: lengthContents.map(content => content.acceptedFormats[0]), // Use first accepted format for game effects
    isSubmitted
  });

  // Global audio effects
  const { playInteractionSound } = useGlobalAudioEffects();

  // Reset answers when exercise changes
  useEffect(() => {
    if (lengthContents.length > 0) {
      setUserAnswers(Array(lengthContents.length).fill(''));
      setIsSubmitted(false);
      setCurrentPage(0);
    }
  }, [lengthContents, setUserAnswers]);

  // Handle submit with length-specific validation
  const handleSubmit = useCallback(() => {
    if (audioState === 'playing') {
      stopPlayback();
    }
    playGameSound('submit');
    setIsSubmitted(true);

    // Calculate rewards with length-specific validation
    if (lengthContents.length > 0) {
      const sessionResults = lengthContents.map((content, index) => {
        const userAnswer = userAnswers[index] || '';
        const isCorrect = validateLengthAnswer(content, userAnswer);
        
        return {
          number: content.value,
          correct: isCorrect,
          userAnswer,
          mode: 'length' as const,
          unit: content.unit
        };
      });

      const reward = GameDataManager.updateSessionResults(sessionResults);
      setRewardInfo(reward);
      setShowRewardModal(true);
    }
  }, [audioState, stopPlayback, playGameSound, lengthContents, userAnswers]);

  // Handle restart button click
  const handleRestartClick = useCallback(() => {
    setShowRestartModal(true);
  }, []);

  // Handle retest current content
  const handleRetestCurrent = useCallback(() => {
    resetAnswers();
    setIsSubmitted(false);
    setCurrentPage(0);
    setShowRestartModal(false);
  }, [resetAnswers]);

  // Handle new practice generation
  const handleNewPractice = useCallback(() => {
    const lengthUnits = settings.lengthUnits || ['米', '厘米', '毫米'];
    const lengthRange = settings.lengthRange || [1, 100];
    const newContents = generateLengthContent(lengthUnits, lengthRange, settings.quantity);
    
    setShowRestartModal(false);
    setLengthContents(newContents);
  }, [settings]);

  // Handle return to home
  const handleReturnHomeClick = useCallback(() => {
    if (isSubmitted) {
      onReset();
    } else {
      setShowConfirmModal(true);
    }
  }, [isSubmitted, onReset]);

  // Confirm return to home
  const handleConfirmReturnHome = useCallback(() => {
    setShowConfirmModal(false);
    onReset();
  }, [onReset]);

  return (
    <div className="practice-panel">
      <AudioControls
        audioState={audioState}
        playbackSpeed={playbackSpeed}
        playbackInterval={playbackInterval}
        currentPlayingIndex={currentPlayingIndex}
        totalItems={lengthContents.length}
        voiceWarning={voiceWarning}
        isSubmitted={isSubmitted}
        onPlayPause={handlePlayPause}
        onReplay={handleReplay}
        onSpeedChange={handleSpeedChange}
        onIntervalChange={handleIntervalChange}
      />

      <LongTextPracticeGrid
        items={lengthContents}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        currentPlayingIndex={currentPlayingIndex}
        audioState={audioState}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        setInputRef={setInputRef}
      />

      <div className="practice-actions">
        {/* Left: Return home button */}
        <button
          onClick={handleReturnHomeClick}
          className="button button-secondary"
        >
          {translations.restartModal?.returnHome || 'Return Home'}
        </button>

        {/* Center: Pagination controls */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="button"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 0}
            >
              {translations.previous || 'Previous'}
            </button>
            <span>{translations.page || 'Page'} {currentPage + 1} / {totalPages}</span>
            <button
              className="button"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages - 1}
            >
              {translations.next || 'Next'}
            </button>
          </div>
        )}

        {/* Right: Submit or restart button */}
        {isSubmitted ? (
          <button onClick={handleRestartClick} className="button button-primary">
            {translations.restart || 'Restart'}
          </button>
        ) : (
          <button onClick={handleSubmit} className="button button-primary">
            {translations.submit || 'Submit'}
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
        title={translations.confirmModal?.returnHomeTitle || 'Return Home'}
        message={translations.confirmModal?.returnHomeMessage || 'Are you sure you want to return home? Your progress will be lost.'}
        onConfirm={handleConfirmReturnHome}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
