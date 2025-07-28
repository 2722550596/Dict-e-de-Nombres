/**
 * 8.2增强推荐系统测试脚本
 * 验证新推荐功能，确保与现有系统的兼容性
 */

// 模拟浏览器环境
global.localStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = value; },
  removeItem(key) { delete this.data[key]; },
  clear() { this.data = {}; }
};

global.btoa = (str) => Buffer.from(str).toString('base64');

// 测试数据
const testUserData = {
  level: 5,
  experience: 1250,
  totalSessions: 25,
  todaySessions: 2,
  lastActiveDate: new Date().toDateString(),
  totalQuestions: 150,
  totalCorrect: 120,
  maxStreak: 12,
  stats: {
    averageAccuracy: 0.8,
    bestAccuracy: 0.95,
    totalPlayTime: 3600,
    consecutiveDays: 7,
  },
  preferences: {
    soundEnabled: true,
    celebrationEnabled: true,
    showHints: true,
    language: 'zh',
    volume: 0.7,
  },
  // 新模式统计数据
  timeDictationStats: {
    totalSessions: 8,
    totalCorrect: 45,
    totalQuestions: 60,
    bestAccuracy: 0.9,
    averageAccuracy: 0.75,
    favoriteTimeType: 'year',
    timeTypeStats: {
      year: { correct: 15, total: 20, sessions: 3 },
      month: { correct: 12, total: 15, sessions: 2 },
      day: { correct: 18, total: 25, sessions: 3 }
    },
    lastPlayDate: new Date().toDateString()
  },
  directionDictationStats: {
    totalSessions: 6,
    totalCorrect: 28,
    totalQuestions: 40,
    bestAccuracy: 0.85,
    averageAccuracy: 0.7,
    favoriteDirectionType: 'cardinal',
    directionTypeStats: {
      cardinal: { correct: 18, total: 25, sessions: 4 },
      relative: { correct: 10, total: 15, sessions: 2 }
    },
    lastPlayDate: new Date().toDateString()
  },
  lengthDictationStats: {
    totalSessions: 4,
    totalCorrect: 20,
    totalQuestions: 30,
    bestAccuracy: 0.8,
    averageAccuracy: 0.67,
    favoriteUnit: '米',
    unitStats: {
      '米': { correct: 12, total: 18, sessions: 3 },
      '厘米': { correct: 8, total: 12, sessions: 1 }
    },
    lastPlayDate: new Date().toDateString()
  },
  newModesDataVersion: 1
};

// 测试函数
async function runTests() {
  console.log('🧪 开始8.2增强推荐系统测试...\n');

  try {
    // 测试1: 模式分析功能
    console.log('📊 测试1: 新模式统计分析');
    await testModeAnalysis();

    // 测试2: 跨模式分析功能
    console.log('\n🔄 测试2: 跨模式学习进度分析');
    await testCrossModeAnalysis();

    // 测试3: 难度推荐功能
    console.log('\n🎯 测试3: 个性化难度推荐');
    await testDifficultyRecommendation();

    // 测试4: 练习分析功能
    console.log('\n📈 测试4: 练习频率和效果分析');
    await testPracticeAnalysis();

    // 测试5: 增强推荐引擎
    console.log('\n🚀 测试5: 增强推荐引擎集成');
    await testEnhancedRecommendationEngine();

    // 测试6: 数据管理器集成
    console.log('\n🔧 测试6: 数据管理器集成');
    await testDataManagerIntegration();

    console.log('\n✅ 所有测试完成！');

  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 测试模式分析
async function testModeAnalysis() {
  const { analyzeAllNewModes, analyzeTimeMode, analyzeDirectionMode, analyzeLengthMode } = 
    require('./src/utils/recommendation/mode-analysis.ts');

  // 测试单个模式分析
  const timeAnalysis = analyzeTimeMode(testUserData);
  console.log('  ✓ 时间模式分析:', {
    mode: timeAnalysis.mode,
    accuracy: Math.round(timeAnalysis.accuracy * 100) + '%',
    sessions: timeAnalysis.totalSessions,
    trend: timeAnalysis.improvementTrend
  });

  const directionAnalysis = analyzeDirectionMode(testUserData);
  console.log('  ✓ 方位模式分析:', {
    mode: directionAnalysis.mode,
    accuracy: Math.round(directionAnalysis.accuracy * 100) + '%',
    sessions: directionAnalysis.totalSessions,
    trend: directionAnalysis.improvementTrend
  });

  const lengthAnalysis = analyzeLengthMode(testUserData);
  console.log('  ✓ 长度模式分析:', {
    mode: lengthAnalysis.mode,
    accuracy: Math.round(lengthAnalysis.accuracy * 100) + '%',
    sessions: lengthAnalysis.totalSessions,
    trend: lengthAnalysis.improvementTrend
  });

  // 测试综合分析
  const allAnalyses = analyzeAllNewModes(testUserData);
  console.log('  ✓ 综合模式分析完成，包含', Object.keys(allAnalyses).length, '个模式');
}

// 测试跨模式分析
async function testCrossModeAnalysis() {
  const { performCrossModeAnalysis, identifyLearningPatterns } = 
    require('./src/utils/recommendation/cross-mode-analysis.ts');

  const crossModeAnalysis = performCrossModeAnalysis(testUserData);
  console.log('  ✓ 跨模式分析结果:', {
    strongestMode: crossModeAnalysis.strongestMode,
    weakestMode: crossModeAnalysis.weakestMode,
    overallProgress: crossModeAnalysis.overallProgress,
    balanceScore: crossModeAnalysis.balanceScore,
    diversityScore: crossModeAnalysis.diversityScore
  });

  const learningPatterns = identifyLearningPatterns(testUserData);
  console.log('  ✓ 学习模式识别:', {
    learningStyle: learningPatterns.learningStyle,
    consistencyLevel: learningPatterns.consistencyLevel,
    challengePreference: learningPatterns.challengePreference,
    preferredModes: learningPatterns.preferredModes
  });
}

// 测试难度推荐
async function testDifficultyRecommendation() {
  const { generateDifficultyRecommendations } = 
    require('./src/utils/recommendation/difficulty-recommendation.ts');

  const recommendations = generateDifficultyRecommendations(testUserData);
  console.log('  ✓ 难度推荐生成:', recommendations.length, '个模式');
  
  recommendations.forEach(rec => {
    console.log(`    - ${rec.mode}: ${rec.currentLevel} → ${rec.recommendedDifficulty} (置信度: ${rec.confidenceScore}%)`);
  });
}

// 测试练习分析
async function testPracticeAnalysis() {
  const { analyzePracticePatterns, analyzePracticeEffectiveness } = 
    require('./src/utils/recommendation/practice-analysis.ts');

  const practiceAnalysis = analyzePracticePatterns(testUserData);
  console.log('  ✓ 练习模式分析:', {
    dailyAverage: practiceAnalysis.dailyAverageMinutes + '分钟',
    weeklyFrequency: practiceAnalysis.weeklyFrequency + '次',
    consistency: practiceAnalysis.consistencyScore + '%',
    effectiveness: practiceAnalysis.effectivenessScore + '%'
  });

  const effectiveness = analyzePracticeEffectiveness(testUserData);
  console.log('  ✓ 练习效果分析:', {
    trend: effectiveness.overallTrend,
    strengths: effectiveness.strengthAreas.length,
    improvements: effectiveness.improvementAreas.length,
    recommendations: effectiveness.recommendations.length
  });
}

// 测试增强推荐引擎
async function testEnhancedRecommendationEngine() {
  const { generateEnhancedRecommendation, generateUserDataHash } = 
    require('./src/utils/recommendation/enhanced-recommendation-engine.ts');

  const hash = generateUserDataHash(testUserData);
  console.log('  ✓ 用户数据哈希生成:', hash);

  const enhancedRecommendation = await generateEnhancedRecommendation(testUserData);
  console.log('  ✓ 增强推荐生成:', {
    version: enhancedRecommendation.recommendationVersion,
    dataQuality: enhancedRecommendation.dataQuality,
    primaryText: enhancedRecommendation.primaryRecommendation.text.substring(0, 50) + '...',
    suggestionsCount: {
      immediate: enhancedRecommendation.suggestions.immediate.length,
      shortTerm: enhancedRecommendation.suggestions.shortTerm.length,
      longTerm: enhancedRecommendation.suggestions.longTerm.length
    }
  });
}

// 测试数据管理器集成
async function testDataManagerIntegration() {
  // 模拟存储数据
  localStorage.setItem('userData', JSON.stringify(testUserData));
  localStorage.setItem('numberStats', JSON.stringify({}));

  const { gameDataManager } = require('./src/utils/game/data-manager.ts');

  // 测试传统推荐
  const traditionalRec = await gameDataManager.generateRecommendation();
  console.log('  ✓ 传统推荐功能:', traditionalRec.text.substring(0, 30) + '...');

  // 测试增强推荐
  const enhancedRec = await gameDataManager.generateEnhancedRecommendation();
  console.log('  ✓ 增强推荐集成:', {
    version: enhancedRec.recommendationVersion,
    dataQuality: enhancedRec.dataQuality,
    modesAnalyzed: enhancedRec.crossModeAnalysis.modePerformances.length
  });

  console.log('  ✓ 数据管理器集成测试完成');
}

// 运行测试
runTests().catch(console.error);
