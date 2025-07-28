import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useGameEffects } from '../hooks/useGameEffects';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { useLanguage } from '../hooks/useLanguage';
import { useLongTextNavigation } from '../hooks/useLongTextNavigation';
import { ExerciseSettings, TimeContent } from '../types/game.types';
import { GameDataManager, RewardInfo } from '../utils/gameData';
import { generateTimeContent } from '../utils/timeGeneration';
import { AudioControls } from './AudioControls';
import { ConfirmModal } from './ConfirmModal';
import { LongTextPracticeGrid } from './LongTextPracticeGrid';
import { RestartModal } from './RestartModal';
import { RewardModal } from './RewardModal';

const ITEMS_PER_PAGE = 20; // Smaller page size for long text content

interface TimeDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}

export const TimeDictationPanel: React.FC<TimeDictationPanelProps> = ({ settings, onReset }) => {
  const { translations } = useLanguage();
  const [timeContents, setTimeContents] = useState<TimeContent[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<RewardInfo | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generate time content based on settings
  useEffect(() => {
    const timeTypes = settings.timeTypes || ['year', 'month', 'day'];
    const contents = generateTimeContent(timeTypes, settings.quantity);
    setTimeContents(contents);
  }, [settings]);

  // Prepare audio texts for TTS
  const audioTexts = useMemo(() => {
    return timeContents.map(content => content.displayText);
  }, [timeContents]);

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

  const totalPages = Math.ceil(timeContents.length / ITEMS_PER_PAGE);

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
    items: timeContents,
    currentPage,
    setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalPages
  });

  // Game effects
  const { playInteractionSound: playGameSound } = useGameEffects({
    userAnswers,
    correctAnswers: timeContents.map(content => content.acceptedAnswers[0]), // Use first accepted answer for game effects
    isSubmitted
  });

  // Global audio effects
  const { playInteractionSound } = useGlobalAudioEffects();

  // Reset answers when content changes
  useEffect(() => {
    if (timeContents.length > 0) {
      resetAnswers();
      setIsSubmitted(false);
      setCurrentPage(0);
    }
  }, [timeContents, resetAnswers]);

  // Use the validateAnswer function from the hook

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (audioState === 'playing') {
      stopPlayback();
    }
    playGameSound('submit');
    setIsSubmitted(true);

    // Calculate session results for time dictation
    const sessionResults = timeContents.map((timeContent, index) => ({
      number: index, // Use index as identifier for time dictation
      correct: validateAnswer(index, userAnswers[index] || ''),
      userAnswer: userAnswers[index] || '',
      mode: 'time' as const,
      operator: undefined
    }));

    const reward = GameDataManager.updateSessionResults(sessionResults);
    setRewardInfo(reward);
    setShowRewardModal(true);
  }, [audioState, stopPlayback, playGameSound, timeContents, userAnswers, validateAnswer]);

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
    const timeTypes = settings.timeTypes || ['year', 'month', 'day'];
    const newContents = generateTimeContent(timeTypes, settings.quantity);
    
    setShowRestartModal(false);
    setTimeContents(newContents);
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

  if (timeContents.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="practice-panel">
      <AudioControls
        audioState={audioState}
        playbackSpeed={playbackSpeed}
        playbackInterval={playbackInterval}
        currentPlayingIndex={currentPlayingIndex}
        totalItems={timeContents.length}
        voiceWarning={voiceWarning}
        isSubmitted={isSubmitted}
        onPlayPause={handlePlayPause}
        onReplay={handleReplay}
        onSpeedChange={handleSpeedChange}
        onIntervalChange={handleIntervalChange}
      />

      <LongTextPracticeGrid
        items={timeContents}
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
        title={translations.confirmModal?.returnHomeTitle || 'Confirm Return Home'}
        message={translations.confirmModal?.returnHomeMessage || 'Are you sure you want to return home? Your progress will be lost.'}
        onConfirm={handleConfirmReturnHome}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};