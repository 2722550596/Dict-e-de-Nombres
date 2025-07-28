/**
 * 长度听写功能测试
 * 验证长度内容生成和验证逻辑
 */

import { generateLengthContent, validateLengthAnswer } from './lengthGeneration';
import { LengthContent } from '../types/game.types';

// 模拟 localStorage
const mockLocalStorage = {
  getItem: (key: string) => {
    if (key === 'selectedDictationLanguage') {
      return 'zh'; // 默认中文
    }
    return null;
  },
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

// 替换 localStorage
(global as any).localStorage = mockLocalStorage;

console.log('=== 长度听写功能测试 ===\n');

// 测试 1: 生成长度内容
console.log('1. 测试长度内容生成:');
const units = ['米', '厘米', '毫米'];
const range: [number, number] = [1, 100];
const quantity = 5;

try {
  const lengthContents = generateLengthContent(units, range, quantity);
  
  console.log(`   生成了 ${lengthContents.length} 个长度内容:`);
  lengthContents.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.displayText} (值: ${content.value}, 单位: ${content.unit})`);
    console.log(`      接受的格式: ${content.acceptedFormats.slice(0, 3).join(', ')}...`);
  });
  
  // 验证生成的内容
  if (lengthContents.length === quantity) {
    console.log('   ✓ 生成数量正确');
  } else {
    console.log('   ✗ 生成数量错误');
  }
  
  // 验证每个内容都有必要的属性
  const allValid = lengthContents.every(content => 
    typeof content.value === 'number' &&
    typeof content.unit === 'string' &&
    typeof content.displayText === 'string' &&
    Array.isArray(content.acceptedFormats) &&
    content.acceptedFormats.length > 0
  );
  
  if (allValid) {
    console.log('   ✓ 所有内容格式正确');
  } else {
    console.log('   ✗ 内容格式有误');
  }
  
} catch (error) {
  console.log('   ✗ 生成失败:', error);
}

// 测试 2: 验证答案
console.log('\n2. 测试答案验证:');
try {
  const testContent: LengthContent = {
    value: 5,
    unit: '米',
    displayText: '5米',
    acceptedFormats: ['5米', '5m', '五米']
  };
  
  const testCases = [
    { answer: '5米', expected: true, description: '精确匹配' },
    { answer: '5m', expected: true, description: '英文单位' },
    { answer: '五米', expected: true, description: '中文数字' },
    { answer: '5 米', expected: true, description: '带空格' },
    { answer: '6米', expected: false, description: '错误数值' },
    { answer: '5厘米', expected: false, description: '错误单位' },
    { answer: '', expected: false, description: '空答案' },
    { answer: 'invalid', expected: false, description: '无效答案' }
  ];
  
  testCases.forEach(({ answer, expected, description }) => {
    const result = validateLengthAnswer(testContent, answer);
    const status = result === expected ? '✓' : '✗';
    console.log(`   ${status} ${description}: "${answer}" -> ${result ? '正确' : '错误'}`);
  });
  
} catch (error) {
  console.log('   ✗ 验证测试失败:', error);
}

// 测试 3: 不同单位测试
console.log('\n3. 测试不同单位:');
try {
  const differentUnits = ['公里', '米', '厘米', '毫米'];
  const contents = generateLengthContent(differentUnits, [1, 10], 4);
  
  console.log('   生成的不同单位内容:');
  contents.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.displayText}`);
  });
  
  // 检查是否使用了不同的单位
  const usedUnits = new Set(contents.map(c => c.unit));
  console.log(`   使用了 ${usedUnits.size} 种不同单位: ${Array.from(usedUnits).join(', ')}`);
  
} catch (error) {
  console.log('   ✗ 不同单位测试失败:', error);
}

// 测试 4: 边界值测试
console.log('\n4. 测试边界值:');
try {
  const edgeCases = [
    { range: [0.1, 0.9] as [number, number], description: '小数范围' },
    { range: [1000, 9999] as [number, number], description: '大数范围' },
    { range: [1, 1] as [number, number], description: '单一值' }
  ];
  
  edgeCases.forEach(({ range, description }) => {
    try {
      const contents = generateLengthContent(['米'], range, 2);
      console.log(`   ✓ ${description}: 生成成功`);
      console.log(`     示例: ${contents[0]?.displayText || 'N/A'}`);
    } catch (error) {
      console.log(`   ✗ ${description}: 生成失败`);
    }
  });
  
} catch (error) {
  console.log('   ✗ 边界值测试失败:', error);
}

console.log('\n=== 测试完成 ===');

export {}; // 使文件成为模块
