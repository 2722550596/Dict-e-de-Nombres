/**
 * 8.2前端集成效果测试脚本
 * 验证所有前端组件的增强推荐功能，确保用户能够看到完整的推荐信息
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 开始8.2前端集成效果测试...\n');

// 测试结果统计
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// 测试函数
function test(description, condition, isWarning = false) {
  if (condition) {
    console.log(`✅ ${description}`);
    testResults.passed++;
  } else {
    if (isWarning) {
      console.log(`⚠️  ${description}`);
      testResults.warnings++;
    } else {
      console.log(`❌ ${description}`);
      testResults.failed++;
    }
  }
}

// 检查文件内容
function checkFileContent(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    test(`${description}: 文件不存在`, false);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let allFound = true;
  
  patterns.forEach(({ pattern, name, required = true }) => {
    const found = pattern.test(content);
    if (required) {
      test(`${description} - ${name}`, found);
      if (!found) allFound = false;
    } else {
      test(`${description} - ${name}`, found, true);
    }
  });
  
  return allFound;
}

console.log('📱 1. 测试数字听写面板增强推荐集成');
checkFileContent('src/components/NumberDictation/NumberSettingsPanel.tsx', [
  { pattern: /enhancedRecommendation/, name: '增强推荐状态管理' },
  { pattern: /generateEnhancedRecommendation/, name: '增强推荐方法调用' },
  { pattern: /EnhancedRecommendationDisplay|RecommendationComponent/, name: '推荐显示组件使用' },
  { pattern: /currentMode.*number/, name: '数字模式标识' },
  { pattern: /enhancedRecommendation.*enhancedRecommendation/, name: '推荐信息传递给难度选择器' }
], '数字听写面板');

console.log('\n🕐 2. 测试时间听写面板增强推荐集成');
checkFileContent('src/components/TimeDictation/TimeSettingsPanel.tsx', [
  { pattern: /enhancedRecommendation/, name: '增强推荐状态管理' },
  { pattern: /generateEnhancedRecommendation/, name: '增强推荐方法调用' },
  { pattern: /isLoadingRecommendation/, name: '加载状态管理' },
  { pattern: /时间听写智能分析/, name: '时间模式专门分析显示' },
  { pattern: /mode.*===.*time/, name: '时间模式推荐过滤' }
], '时间听写面板');

console.log('\n🧭 3. 测试方位听写面板增强推荐集成');
checkFileContent('src/components/DirectionDictation/DirectionSettingsPanel.tsx', [
  { pattern: /enhancedRecommendation/, name: '增强推荐状态管理' },
  { pattern: /generateEnhancedRecommendation/, name: '增强推荐方法调用' },
  { pattern: /isLoadingRecommendation/, name: '加载状态管理' },
  { pattern: /方位听写智能分析/, name: '方位模式专门分析显示' },
  { pattern: /mode.*===.*direction/, name: '方位模式推荐过滤' }
], '方位听写面板');

console.log('\n📏 4. 测试长度听写面板增强推荐集成');
checkFileContent('src/components/LengthDictation/LengthSettingsPanel.tsx', [
  { pattern: /enhancedRecommendation/, name: '增强推荐状态管理' },
  { pattern: /generateEnhancedRecommendation/, name: '增强推荐方法调用' },
  { pattern: /isLoadingRecommendation/, name: '加载状态管理' },
  { pattern: /长度听写智能分析/, name: '长度模式专门分析显示' },
  { pattern: /mode.*===.*length/, name: '长度模式推荐过滤' }
], '长度听写面板');

console.log('\n🎯 5. 测试增强推荐显示组件');
checkFileContent('src/components/EnhancedRecommendationDisplay.tsx', [
  { pattern: /interface EnhancedRecommendationDisplayProps/, name: '组件接口定义' },
  { pattern: /currentMode.*number.*time.*direction.*length/, name: '多模式支持' },
  { pattern: /MODE_ICONS/, name: '模式图标定义' },
  { pattern: /MODE_NAMES/, name: '模式名称定义' },
  { pattern: /LEVEL_NAMES/, name: '难度级别名称定义' },
  { pattern: /crossModeAnalysis/, name: '跨模式分析显示' },
  { pattern: /difficultyRecommendations/, name: '难度推荐显示' },
  { pattern: /practiceAnalysis/, name: '练习分析显示' },
  { pattern: /suggestions/, name: '学习建议显示' }
], '增强推荐显示组件');

console.log('\n⭐ 6. 测试难度选择器推荐标记集成');
checkFileContent('src/components/DifficultySelector.tsx', [
  { pattern: /enhancedRecommendation\?:/, name: '增强推荐参数接口' },
  { pattern: /currentMode\?:/, name: '当前模式参数接口' },
  { pattern: /getEnhancedRecommendedDifficulties/, name: '增强推荐难度获取函数' },
  { pattern: /difficultyRecommendations/, name: '难度推荐数据处理' },
  { pattern: /difficultyMapping/, name: '难度映射逻辑' },
  { pattern: /enhancedRecommendedKeys/, name: '增强推荐键值处理' },
  { pattern: /recommend-star/, name: '推荐星标显示' }
], '难度选择器');

console.log('\n🎨 7. 测试CSS样式文件');
checkFileContent('src/components/NumberDictation/EnhancedRecommendation.css', [
  { pattern: /\.enhanced-recommendation/, name: '增强推荐容器样式' },
  { pattern: /\.cross-mode-analysis/, name: '跨模式分析样式' },
  { pattern: /\.practice-suggestions/, name: '练习建议样式' },
  { pattern: /\.practice-analysis/, name: '练习分析样式' },
  { pattern: /\.stat-item/, name: '统计项样式' },
  { pattern: /\.suggestion-group/, name: '建议组样式' },
  { pattern: /\.recommendation-loading/, name: '加载状态样式' },
  { pattern: /@keyframes/, name: '动画效果' },
  { pattern: /@media.*max-width/, name: '响应式设计' }
], 'CSS样式文件');

console.log('\n🔗 8. 测试组件间的数据流');

// 检查数字听写面板是否正确传递数据给难度选择器
const numberPanelContent = fs.existsSync('src/components/NumberDictation/NumberSettingsPanel.tsx') 
  ? fs.readFileSync('src/components/NumberDictation/NumberSettingsPanel.tsx', 'utf8') : '';

test('数字听写面板传递增强推荐给难度选择器', 
  /enhancedRecommendation=\{enhancedRecommendation\}/.test(numberPanelContent));

test('数字听写面板设置正确的当前模式', 
  /currentMode="number"/.test(numberPanelContent));

// 检查CSS导入
test('时间听写面板导入增强推荐CSS', 
  fs.existsSync('src/components/TimeDictation/TimeSettingsPanel.tsx') &&
  fs.readFileSync('src/components/TimeDictation/TimeSettingsPanel.tsx', 'utf8').includes('EnhancedRecommendation.css'));

test('方位听写面板导入增强推荐CSS', 
  fs.existsSync('src/components/DirectionDictation/DirectionSettingsPanel.tsx') &&
  fs.readFileSync('src/components/DirectionDictation/DirectionSettingsPanel.tsx', 'utf8').includes('EnhancedRecommendation.css'));

test('长度听写面板导入增强推荐CSS', 
  fs.existsSync('src/components/LengthDictation/LengthSettingsPanel.tsx') &&
  fs.readFileSync('src/components/LengthDictation/LengthSettingsPanel.tsx', 'utf8').includes('EnhancedRecommendation.css'));

console.log('\n🚀 9. 测试动态导入和错误处理');

// 检查是否有适当的错误处理
const componentsWithErrorHandling = [
  'src/components/NumberDictation/NumberSettingsPanel.tsx',
  'src/components/TimeDictation/TimeSettingsPanel.tsx',
  'src/components/DirectionDictation/DirectionSettingsPanel.tsx',
  'src/components/LengthDictation/LengthSettingsPanel.tsx'
];

componentsWithErrorHandling.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    test(`${fileName} 包含错误处理`, /catch.*error/.test(content));
    test(`${fileName} 包含动态导入`, /import.*utils\/game\/data-manager/.test(content));
    test(`${fileName} 包含加载状态管理`, /setIsLoadingRecommendation|isLoadingRecommendation/.test(content), true);
  }
});

console.log('\n📊 10. 测试用户体验功能');

// 检查加载状态显示
test('增强推荐显示组件包含加载状态', 
  fs.existsSync('src/components/EnhancedRecommendationDisplay.tsx') &&
  fs.readFileSync('src/components/EnhancedRecommendationDisplay.tsx', 'utf8').includes('正在加载智能推荐'));

// 检查数据质量指示器
test('增强推荐显示组件包含数据质量指示器', 
  fs.existsSync('src/components/EnhancedRecommendationDisplay.tsx') &&
  fs.readFileSync('src/components/EnhancedRecommendationDisplay.tsx', 'utf8').includes('data-quality-indicator'));

// 检查响应式设计
test('CSS包含响应式设计', 
  fs.existsSync('src/components/NumberDictation/EnhancedRecommendation.css') &&
  fs.readFileSync('src/components/NumberDictation/EnhancedRecommendation.css', 'utf8').includes('@media (max-width: 768px)'));

console.log('\n📈 测试结果统计:');
console.log(`✅ 通过: ${testResults.passed}`);
console.log(`❌ 失败: ${testResults.failed}`);
console.log(`⚠️  警告: ${testResults.warnings}`);
console.log(`📊 总计: ${testResults.passed + testResults.failed + testResults.warnings}`);

const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
console.log(`🎯 成功率: ${successRate.toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 所有关键测试都通过了！');
  console.log('✨ 8.2增强推荐系统前端集成完成！');
  console.log('\n💡 用户现在可以看到:');
  console.log('   - 🎯 智能学习分析');
  console.log('   - 📊 跨模式表现对比');
  console.log('   - 💡 个性化学习建议');
  console.log('   - 📈 练习习惯分析');
  console.log('   - ⭐ 智能难度推荐标记');
  console.log('   - 🎨 美观的用户界面');
} else {
  console.log('\n⚠️  发现一些问题需要修复');
  console.log('请检查失败的测试项目并进行相应修复');
}

console.log('\n📝 下一步建议:');
console.log('1. 在浏览器中测试各个听写模式');
console.log('2. 验证推荐信息是否正确显示');
console.log('3. 检查推荐标记是否出现在难度选择器中');
console.log('4. 测试不同用户数据下的推荐效果');
console.log('5. 验证响应式设计在移动设备上的表现');
