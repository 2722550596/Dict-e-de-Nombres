# Dictée de Nombres

A French number dictation web application designed to help learners improve their French number listening comprehension and reaction speed through batch dictation exercises.

## Features

- **Multiple Difficulty Levels**: Practice with different number ranges (0-9, 0-20, 0-69, 70-99, 0-99, hundreds, tens only, or custom ranges)
- **Audio Controls**: Play/pause, replay, and adjustable playback speed (slow, normal, fast)
- **Customizable Intervals**: Adjust the time between numbers (0.1s to 10s) in real-time
- **Progress Tracking**: Visual progress bar and current number highlighting
- **Instant Feedback**: Color-coded results showing correct/incorrect answers
- **Responsive Design**: Works on both desktop and mobile devices
- **French Speech Synthesis**: Uses browser's built-in French text-to-speech

## How to Use

1. **Settings**: Choose your difficulty level and number of questions (up to 200)
2. **Practice**: Listen to French numbers and type your answers in the grid
3. **Submit**: Get instant feedback with correct answers highlighted
4. **Review**: See your results and start a new session

## Technical Features

- Built with React 19 and TypeScript
- Vite for fast development and building
- CSS Grid layout with responsive design
- Web Speech API for French pronunciation
- Real-time progress indicators
- Automatic audio pause on submission
- SVG icons using Lucide React for consistent cross-platform display

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/2722550596/Dict-e-de-Nombres.git
   cd Dict-e-de-Nombres
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment

The project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

## Browser Compatibility

This application requires:
- A modern browser with Web Speech API support
- French language pack installed for text-to-speech
- JavaScript enabled

## UI/UX Guidelines

### Icon Usage Policy

This project follows a **no-emoji policy** for user-facing interfaces to ensure consistent visual experience across all platforms and devices.

#### ✅ **Use SVG Icons Instead of Emoji**

- **Preferred**: SVG icons from [Lucide React](https://lucide.dev/) library
- **Reason**: Consistent appearance across all operating systems and browsers
- **Examples**:
  - Use `<AlertTriangle />` instead of ⚠️
  - Use `<PartyPopper />` instead of 🎉
  - Use custom SVG flag components instead of 🇫🇷 🇺🇸 🇨🇳

#### ❌ **Avoid Emoji in Production Code**

- **User Interface Elements**: Buttons, labels, notifications, status indicators
- **Functional Icons**: Navigation, warnings, success messages
- **Country/Language Indicators**: Use SVG flag icons instead of emoji flags

#### 🔶 **Emoji Acceptable in Limited Cases**

- **Development/Debug Files**: Test files, console logs, development documentation
- **Internal Documentation**: Comments in code, development notes
- **Non-User-Facing Content**: Build scripts, internal tools

#### **Benefits of SVG Over Emoji**

1. **Cross-Platform Consistency**: Same appearance on Windows, macOS, Linux, iOS, Android
2. **Accessibility**: Better screen reader support with proper `aria-label` attributes
3. **Customization**: Can be styled with CSS (color, size, animations)
4. **Performance**: Smaller file sizes and better caching
5. **Professional Appearance**: More suitable for business applications

#### **Implementation Examples**

```tsx
// ❌ Don't use emoji
<button>🎉 Celebrate</button>
<div>⚠️ Warning message</div>

// ✅ Use SVG icons
import { PartyPopper, AlertTriangle } from 'lucide-react';
<button><PartyPopper size={16} /> Celebrate</button>
<div><AlertTriangle size={16} /> Warning message</div>
```

## Contributing

Feel free to submit issues and enhancement requests!

When contributing, please follow the UI/UX guidelines above, especially regarding icon usage.

## License

This project is open source and available under the [MIT License](LICENSE).
