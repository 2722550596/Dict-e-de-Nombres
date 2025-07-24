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

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
