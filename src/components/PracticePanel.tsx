import React, { useState, useEffect, useMemo } from 'react';
import { Exercise, ExerciseSettings } from '../types/exercise';
import { useLanguage } from '../hooks/useLanguage';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useInputNavigation } from '../hooks/useInputNavigation';
import { useGameEffects } from '../hooks/useGameEffects';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { AudioControls } from './AudioControls';
import { PracticeGrid } from './PracticeGrid';
import { RestartModal } from './RestartModal';
import { generateNumbers } from '../utils/numberGeneration';
import { generateMathProblems } from '../utils/mathOperations';

const ITEMS_PER_PAGE = 50;

interface PracticePanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}

export const PracticePanel: React.FC<PracticePanelProps> = ({ settings, onReset }) => {
  const { translations } = useLanguage();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showRestartModal, setShowRestartModal] = useState(false);

  // 生成练习内容
  useEffect(() => {
    if (settings.mode === 'number') {
      const numbers = generateNumbers(settings.range, settings.quantity);
      setExercise({
        mode: 'number',
        numbers,
        settings: {
          range: settings.range,
          quantity: settings.quantity
        }
      });
    } else if (settings.mode === 'math') {
      const problems = generateMathProblems(
        settings.operations!,
        settings.range,
        settings.maxResult!,
        settings.quantity
      );
      setExercise({
        mode: 'math',
        problems,
        settings: {
          range: settings.range,
          quantity: settings.quantity,
          maxResult: settings.maxResult!,
          operations: settings.operations!
        }
      });
    }
  }, [settings]);

  // 准备音频播放的文本数组 - 使用useMemo避免无限循环
  const audioTexts = useMemo(() => {
    if (!exercise) return [];

    return exercise.mode === 'number'
      ? exercise.numbers.map(n => n.toString())
      : exercise.problems.map(p => p.displayText);
  }, [exercise]);

  // 准备答案数组
  const correctAnswers = exercise ? (
    exercise.mode === 'number'
      ? exercise.numbers
      : exercise.problems.map(p => p.result)
  ) : [];

  const getMaxLength = (index: number): number => {
    if (!exercise) return 3;
    const answer = correctAnswers[index];
    // 动态调整输入框长度，最少1位，最多根据答案长度
    return Math.max(1, answer.toString().length);
  };

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
      // 播放完成后的处理
    }
  });

  const {
    userAnswers,
    placeholderStates,
    handleInputChange,
    handleKeyDown,
    setInputRef,
    setUserAnswers
  } = useInputNavigation({
    totalItems: correctAnswers.length,
    getMaxLength
  });

  // 游戏化效果
  const { playInteractionSound: playGameSound } = useGameEffects({
    userAnswers,
    correctAnswers,
    isSubmitted
  });

  // 全局音效
  const { playInteractionSound } = useGlobalAudioEffects();

  // 重置答案当练习改变时
  useEffect(() => {
    if (exercise) {
      const newAnswersLength = correctAnswers.length;
      setUserAnswers(Array(newAnswersLength).fill(''));
      setIsSubmitted(false);
      setCurrentPage(0);
    }
  }, [exercise]);

  const handleSubmit = () => {
    if (audioState === 'playing') {
      stopPlayback();
    }
    playGameSound('submit');
    setIsSubmitted(true);
  };

  const handleRestartClick = () => {
    setShowRestartModal(true);
  };

  const handleRetestCurrent = () => {
    // 重测当前题目，只重置答案
    setUserAnswers(Array(correctAnswers.length).fill(''));
    setIsSubmitted(false);
    setCurrentPage(0);
    setShowRestartModal(false);
  };

  const handleNewPractice = () => {
    // 重新生成练习内容
    let newExercise: Exercise;

    if (settings.mode === 'number') {
      const numbers = generateNumbers(settings.range, settings.quantity);
      newExercise = {
        mode: 'number',
        numbers
      };
    } else {
      const problems = generateMathProblems(settings.operations, settings.quantity, settings.maxResult);
      newExercise = {
        mode: 'math',
        problems
      };
    }

    // 先关闭弹窗
    setShowRestartModal(false);

    // 更新练习内容（这会触发useEffect重置其他状态）
    setExercise(newExercise);
  };

  const handleReturnHome = () => {
    onReset();
  };

  if (!exercise) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(correctAnswers.length / ITEMS_PER_PAGE);

  return (
    <div className="practice-panel">
      <AudioControls
        audioState={audioState}
        playbackSpeed={playbackSpeed}
        playbackInterval={playbackInterval}
        currentPlayingIndex={currentPlayingIndex}
        totalItems={correctAnswers.length}
        voiceWarning={voiceWarning}
        isSubmitted={isSubmitted}
        onPlayPause={handlePlayPause}
        onReplay={handleReplay}
        onSpeedChange={handleSpeedChange}
        onIntervalChange={handleIntervalChange}
      />

      <PracticeGrid
        items={correctAnswers}
        userAnswers={userAnswers}
        placeholderStates={placeholderStates}
        playedItems={playedItems}
        isSubmitted={isSubmitted}
        currentPlayingIndex={currentPlayingIndex}
        audioState={audioState}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        getMaxLength={getMaxLength}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        setInputRef={setInputRef}
      />

      <div className="practice-actions">
        {/* 左侧：返回主页按钮 */}
        <button
          onClick={handleReturnHome}
          className="button button-secondary"
        >
          {translations.restartModal.returnHome}
        </button>

        {/* 中间：分页控件 */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="button"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 0}
            >
              {translations.previous}
            </button>
            <span>{translations.page} {currentPage + 1} / {totalPages}</span>
            <button
              className="button"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages - 1}
            >
              {translations.next}
            </button>
          </div>
        )}

        {/* 右侧：提交或重新开始按钮 */}
        {isSubmitted ? (
          <button onClick={handleRestartClick} className="button button-primary">
            {translations.restart}
          </button>
        ) : (
          <button onClick={handleSubmit} className="button button-primary">
            {translations.submit}
          </button>
        )}
      </div>

      <RestartModal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onRetestCurrent={handleRetestCurrent}
        onNewPractice={handleNewPractice}
      />
    </div>
  );
};
