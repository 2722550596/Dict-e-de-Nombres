/**
 * 时间内容生成器演示文件
 * 展示如何使用时间听写内容生成功能
 * 
 * 使用方法：
 * import { generateTimeContent, validateTimeAnswer, formatTimeContent } from './timeGeneration';
 */

import { formatTimeContent, generateTimeContent, getTimeContentHint, validateTimeAnswer } from './timeGeneration';

// 演示：生成不同类型的时间内容
export function demoTimeGeneration() {
    console.log('=== 时间内容生成器演示 ===\n');

    // 1. 生成年份内容
    console.log('1. 生成年份内容：');
    const yearContents = generateTimeContent(['year'], 3, 'fr-FR');
    yearContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (接受答案: ${content.acceptedAnswers.join(', ')})`);
    });

    // 2. 生成月份内容
    console.log('\n2. 生成月份内容：');
    const monthContents = generateTimeContent(['month'], 3, 'fr-FR');
    monthContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (接受答案: ${content.acceptedAnswers.join(', ')})`);
    });

    // 3. 生成星期内容
    console.log('\n3. 生成星期内容：');
    const weekdayContents = generateTimeContent(['weekday'], 3, 'fr-FR');
    weekdayContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (接受答案: ${content.acceptedAnswers.join(', ')})`);
    });

    // 4. 生成完整日期内容
    console.log('\n4. 生成完整日期内容：');
    const fullDateContents = generateTimeContent(['fullDate'], 2, 'fr-FR');
    fullDateContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText}`);
        console.log(`      接受答案: ${content.acceptedAnswers.slice(0, 3).join(', ')}...`);
    });

    // 5. 混合类型生成
    console.log('\n5. 混合类型生成：');
    const mixedContents = generateTimeContent(['year', 'month', 'day', 'weekday'], 5, 'fr-FR');
    mixedContents.forEach((content, index) => {
        console.log(`   ${index + 1}. [${content.type}] ${content.displayText}`);
    });
}

// 演示：答案验证功能
export function demoAnswerValidation() {
    console.log('\n=== 答案验证演示 ===\n');

    const testContent = generateTimeContent(['month'], 1, 'fr-FR')[0];
    console.log(`测试内容: ${testContent.displayText}`);
    console.log(`接受的答案: ${testContent.acceptedAnswers.join(', ')}`);

    // 测试不同的用户输入
    const testAnswers = [
        testContent.acceptedAnswers[0], // 正确答案
        testContent.acceptedAnswers[0].toUpperCase(), // 大写
        ` ${testContent.acceptedAnswers[0]} `, // 带空格
        'wrong answer' // 错误答案
    ];

    testAnswers.forEach((answer, index) => {
        const isValid = validateTimeAnswer(testContent, answer);
        console.log(`   测试 ${index + 1}: "${answer}" -> ${isValid ? '✓ 正确' : '✗ 错误'}`);
    });
}

// 演示：多语言支持
export function demoMultiLanguageSupport() {
    console.log('\n=== 多语言支持演示 ===\n');

    const languages = [
        { code: 'fr-FR', name: '法语' },
        { code: 'en-US', name: '英语' },
        { code: 'zh-CN', name: '中文' },
        { code: 'de-DE', name: '德语' }
    ];

    languages.forEach(lang => {
        console.log(`${lang.name} (${lang.code}):`);

        // 生成月份示例
        const monthContent = generateTimeContent(['month'], 1, lang.code)[0];
        console.log(`   月份: ${monthContent.displayText}`);

        // 生成星期示例
        const weekdayContent = generateTimeContent(['weekday'], 1, lang.code)[0];
        console.log(`   星期: ${weekdayContent.displayText}`);

        // 显示提示信息
        const hint = getTimeContentHint(monthContent, lang.code);
        console.log(`   提示: ${hint}\n`);
    });
}

// 演示：格式化功能
export function demoFormatting() {
    console.log('\n=== 格式化功能演示 ===\n');

    // 测试法语中的特殊格式化（第一天）
    const dayContent1 = {
        type: 'day' as const,
        value: '1',
        displayText: '1',
        acceptedAnswers: ['1', '1er', 'premier']
    };

    const dayContent15 = {
        type: 'day' as const,
        value: '15',
        displayText: '15',
        acceptedAnswers: ['15']
    };

    console.log('法语日期格式化:');
    console.log(`   第1天: ${formatTimeContent(dayContent1, 'fr-FR')}`);
    console.log(`   第15天: ${formatTimeContent(dayContent15, 'fr-FR')}`);

    // 测试年份格式化
    const yearContent = {
        type: 'year' as const,
        value: '2024',
        displayText: '2024',
        acceptedAnswers: ['2024']
    };

    console.log(`   年份: ${formatTimeContent(yearContent, 'fr-FR')}`);
}

// 运行所有演示
export function runAllDemos() {
    demoTimeGeneration();
    demoAnswerValidation();
    demoMultiLanguageSupport();
    demoFormatting();

    console.log('\n=== 演示完成 ===');
    console.log('时间内容生成器已准备就绪，可以集成到应用中！');
}

// 如果直接运行此文件，执行演示
if (typeof window === 'undefined') {
    // Node.js 环境
    runAllDemos();
}