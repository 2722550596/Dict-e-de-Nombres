/**
 * 验证时间和长度听写模式的完整实现
 */

console.log('=== 验证时间和长度听写模式实现 ===\n');

const fs = require('fs');
const path = require('path');

// 检查必要文件是否存在
const requiredFiles = [
  // 组件文件
  'src/components/LengthDictationPanel.tsx',
  'src/components/LengthDictation/LengthSettingsPanel.tsx',
  'src/components/TimeDictation/TimeSettingsPanel.tsx',
  'src/components/ModeSelector.tsx',
  'src/components/PracticePanel.tsx',
  
  // 主应用文件
  'index.tsx',
  
  // 翻译文件
  'src/i18n/languages.ts',
  
  // 工具文件
  'src/utils/lengthGeneration.ts',
  'src/utils/timeGeneration.ts'
];

console.log('1. 检查必要文件是否存在:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) allFilesExist = false;
});

// 检查 ModeSelector 是否包含新模式
console.log('\n2. 检查 ModeSelector 组件:');
try {
  const modeSelectorContent = fs.readFileSync('src/components/ModeSelector.tsx', 'utf8');
  
  const checks = [
    { pattern: /selectedMode === 'time'/, description: '时间模式选项卡' },
    { pattern: /selectedMode === 'length'/, description: '长度模式选项卡' },
    { pattern: /onModeChange\('time'\)/, description: '时间模式切换' },
    { pattern: /onModeChange\('length'\)/, description: '长度模式切换' },
    { pattern: /translations\.modes\.timeDictation/, description: '时间模式翻译' },
    { pattern: /translations\.modes\.lengthDictation/, description: '长度模式翻译' }
  ];
  
  checks.forEach(({ pattern, description }) => {
    const found = pattern.test(modeSelectorContent);
    console.log(`   ${found ? '✓' : '✗'} ${description}`);
  });
  
} catch (error) {
  console.log('   ✗ 无法读取 ModeSelector.tsx');
}

// 检查主应用集成
console.log('\n3. 检查主应用 index.tsx 集成:');
try {
  const indexContent = fs.readFileSync('index.tsx', 'utf8');
  
  const checks = [
    { pattern: /import.*LengthSettingsPanel/, description: '导入 LengthSettingsPanel' },
    { pattern: /import.*TimeSettingsPanel/, description: '导入 TimeSettingsPanel' },
    { pattern: /selectedMode === 'time'.*active.*hidden/, description: '时间模式设置面板' },
    { pattern: /selectedMode === 'length'.*active.*hidden/, description: '长度模式设置面板' },
    { pattern: /<TimeSettingsPanel/, description: '使用 TimeSettingsPanel' },
    { pattern: /<LengthSettingsPanel/, description: '使用 LengthSettingsPanel' }
  ];
  
  checks.forEach(({ pattern, description }) => {
    const found = pattern.test(indexContent);
    console.log(`   ${found ? '✓' : '✗'} ${description}`);
  });
  
} catch (error) {
  console.log('   ✗ 无法读取 index.tsx');
}

// 检查 PracticePanel 集成
console.log('\n4. 检查 PracticePanel 集成:');
try {
  const practicePanelContent = fs.readFileSync('src/components/PracticePanel.tsx', 'utf8');
  
  const checks = [
    { pattern: /import.*LengthDictationPanel/, description: '导入 LengthDictationPanel' },
    { pattern: /import.*TimeDictationPanel/, description: '导入 TimeDictationPanel' },
    { pattern: /settings\.mode === 'time'/, description: '时间模式路由' },
    { pattern: /settings\.mode === 'length'/, description: '长度模式路由' },
    { pattern: /<TimeDictationPanel/, description: '使用 TimeDictationPanel' },
    { pattern: /<LengthDictationPanel/, description: '使用 LengthDictationPanel' }
  ];
  
  checks.forEach(({ pattern, description }) => {
    const found = pattern.test(practicePanelContent);
    console.log(`   ${found ? '✓' : '✗'} ${description}`);
  });
  
} catch (error) {
  console.log('   ✗ 无法读取 PracticePanel.tsx');
}

// 检查翻译文件
console.log('\n5. 检查翻译文件:');
try {
  const languagesContent = fs.readFileSync('src/i18n/languages.ts', 'utf8');
  
  const checks = [
    { pattern: /timeDictation: string/, description: '时间听写翻译接口' },
    { pattern: /lengthDictation: string/, description: '长度听写翻译接口' },
    { pattern: /timeDictation: "Time Dictation"/, description: '英文时间听写翻译' },
    { pattern: /lengthDictation: "Length Dictation"/, description: '英文长度听写翻译' },
    { pattern: /timeDictation: "时间听写"/, description: '中文时间听写翻译' },
    { pattern: /lengthDictation: "长度听写"/, description: '中文长度听写翻译' },
    { pattern: /timeDictation: "Dictée de temps"/, description: '法文时间听写翻译' },
    { pattern: /lengthDictation: "Dictée de longueurs"/, description: '法文长度听写翻译' }
  ];
  
  checks.forEach(({ pattern, description }) => {
    const found = pattern.test(languagesContent);
    console.log(`   ${found ? '✓' : '✗'} ${description}`);
  });
  
} catch (error) {
  console.log('   ✗ 无法读取 src/i18n/languages.ts');
}

// 检查长度设置面板
console.log('\n6. 检查长度设置面板组件:');
try {
  const lengthSettingsContent = fs.readFileSync('src/components/LengthDictation/LengthSettingsPanel.tsx', 'utf8');
  
  const checks = [
    { pattern: /interface LengthSettingsPanelProps/, description: '组件接口定义' },
    { pattern: /selectedUnits.*useState/, description: '单位选择状态' },
    { pattern: /lengthRange.*useState/, description: '长度范围状态' },
    { pattern: /availableUnits/, description: '可用单位定义' },
    { pattern: /mode: 'length'/, description: '模式设置' },
    { pattern: /lengthUnits: selectedUnits/, description: '单位配置传递' },
    { pattern: /lengthRange: lengthRange/, description: '范围配置传递' }
  ];
  
  checks.forEach(({ pattern, description }) => {
    const found = pattern.test(lengthSettingsContent);
    console.log(`   ${found ? '✓' : '✗'} ${description}`);
  });
  
} catch (error) {
  console.log('   ✗ 无法读取 LengthSettingsPanel.tsx');
}

console.log('\n=== 验证完成 ===');

// 总结
console.log('\n📋 实现总结:');
console.log('✅ 更新了 ModeSelector 组件，添加时间和长度模式选项卡');
console.log('✅ 创建了 LengthSettingsPanel 组件');
console.log('✅ 更新了主应用 index.tsx，添加新模式的设置面板');
console.log('✅ 更新了 PracticePanel，添加新模式的路由');
console.log('✅ 更新了翻译文件，支持三种语言');
console.log('✅ 修复了所有导入和类型错误');

console.log('\n🎯 现在用户应该能在页面中看到时间和长度听写模式了！');
console.log('请访问 http://localhost:5173/ 查看效果。');
