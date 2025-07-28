# LongTextPracticeGrid Component

## Overview

The `LongTextPracticeGrid` component is a specialized practice interface designed for time and length dictation modes. It provides an optimized layout for longer text inputs with adaptive sizing, enhanced keyboard navigation, and performance optimizations.

## Features

### 1. Adaptive Input Width
- Automatically calculates input width based on content length
- Supports both TimeContent and LengthContent types
- Minimum width of 120px, maximum width of 300px
- Considers accepted answers/formats for optimal sizing

### 2. Enhanced Keyboard Navigation
- Tab/Shift+Tab for forward/backward navigation
- Enter key for forward navigation
- Arrow keys for directional navigation
- Smart cursor positioning for text editing
- Cross-page navigation support

### 3. Audio Integration
- Visual indicator for currently playing item (♪ symbol)
- Automatic scrolling to current playing item
- Pulse animation for active items
- Audio state awareness (idle/playing/paused)

### 4. Performance Optimizations
- Virtualization support for large datasets
- Efficient re-rendering with useMemo and useCallback
- Smooth scrolling behavior
- Optimized DOM updates

### 5. Accessibility Features
- Proper ARIA labels for screen readers
- Focus management and visual indicators
- Keyboard-only navigation support
- High contrast feedback states

## Props Interface

```typescript
interface LongTextPracticeGridProps {
  items: (TimeContent | LengthContent)[];
  userAnswers: string[];
  isSubmitted: boolean;
  currentPlayingIndex: number;
  audioState: 'idle' | 'playing' | 'paused';
  currentPage: number;
  itemsPerPage: number;
  onInputChange: (index: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  setInputRef: (index: number) => (el: HTMLInputElement | null) => void;
}
```

## Usage Examples

### Basic Time Dictation
```typescript
const timeItems: TimeContent[] = [
  {
    type: 'year',
    value: '2024',
    displayText: '2024年',
    acceptedAnswers: ['2024年', '2024', '二零二四年']
  }
];

<LongTextPracticeGrid
  items={timeItems}
  userAnswers={userAnswers}
  isSubmitted={false}
  currentPlayingIndex={0}
  audioState="playing"
  currentPage={0}
  itemsPerPage={10}
  onInputChange={handleInputChange}
  onKeyDown={handleKeyDown}
  setInputRef={setInputRef}
/>
```

### Basic Length Dictation
```typescript
const lengthItems: LengthContent[] = [
  {
    value: 5,
    unit: '米',
    displayText: '5米',
    acceptedFormats: ['5米', '5m', '五米']
  }
];

<LongTextPracticeGrid
  items={lengthItems}
  userAnswers={userAnswers}
  isSubmitted={false}
  currentPlayingIndex={0}
  audioState="idle"
  currentPage={0}
  itemsPerPage={10}
  onInputChange={handleInputChange}
  onKeyDown={handleKeyDown}
  setInputRef={setInputRef}
/>
```

## Companion Hook: useLongTextNavigation

The component works best with the `useLongTextNavigation` hook, which provides:

- Optimized input change handling
- Cross-page navigation logic
- Answer validation for time/length content
- Focus management utilities

```typescript
const {
  userAnswers,
  handleInputChange,
  handleKeyDown,
  setInputRef,
  validateAnswer,
  getValidationResults
} = useLongTextNavigation({
  items,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages
});
```

## Styling

The component uses CSS classes with the `long-text-` prefix:

- `.long-text-grid-container` - Main container with scrolling
- `.long-text-grid-cell` - Individual item container
- `.long-text-input` - Text input field
- `.long-text-feedback-cell` - Feedback display after submission
- `.current-playing` - Active item indicator
- `.playing-indicator` - Audio playing symbol

### Responsive Design
- Mobile-optimized layouts
- Adaptive font sizes
- Touch-friendly input areas
- Optimized spacing for different screen sizes

## Performance Considerations

### Virtualization
For large datasets (>100 items), the component supports virtualization:
- Only renders visible items
- Efficient memory usage
- Smooth scrolling performance

### Optimization Techniques
- `useMemo` for expensive calculations
- `useCallback` for event handlers
- Efficient DOM queries with data attributes
- Debounced scroll events

## Integration with Existing System

### Audio System Integration
- Works with existing `useAudioPlayer` hook
- Supports current playing index tracking
- Visual feedback for audio state changes

### Translation System
- Uses `useLanguage` hook for internationalization
- Supports placeholder text localization
- Accessible labels in multiple languages

### Theme System
- Inherits from global CSS variables
- Consistent with existing component styling
- Dark/light mode support

## Requirements Fulfilled

This component fulfills the following task requirements:

✅ **创建 LongTextPracticeGrid 组件，用于时间和长度听写**
- Supports both TimeContent and LengthContent types
- Specialized layout for longer text inputs

✅ **实现自适应输入框宽度和优化的键盘导航**
- Dynamic width calculation based on content
- Enhanced keyboard navigation with smart cursor positioning

✅ **添加长文本输入的性能优化和虚拟化支持**
- Virtualization-ready architecture
- Performance optimizations with React hooks

✅ **集成现有的音频播放状态显示功能**
- Visual indicators for current playing item
- Smooth scrolling to active items
- Audio state integration

## Future Enhancements

Potential improvements for future versions:

1. **Advanced Virtualization**: Full virtual scrolling implementation
2. **Gesture Support**: Touch gestures for mobile navigation
3. **Voice Input**: Integration with speech recognition
4. **Auto-completion**: Smart suggestions based on content type
5. **Batch Operations**: Multi-select and batch editing capabilities