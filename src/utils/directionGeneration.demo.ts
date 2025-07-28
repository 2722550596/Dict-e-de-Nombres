/**
 * 方位内容生成器演示文件
 * 展示如何使用方位内容生成功能
 * 
 * 使用方法：
 * import { generateDirectionContent, validateDirectionAnswer, getAvailableDirections } from './directionGeneration';
 */

import {
    formatDirectionContent,
    generateDirectionContent,
    getAvailableDirections,
    getDirectionContentHint,
    validateDirectionAnswer
} from './directionGeneration';

// 演示：生成不同类型的方位内容
function demonstrateDirectionGeneration() {
    console.log('=== 方位内容生成演示 ===\n');

    // 1. 生成基本方位内容
    console.log('1. 生成基本方位内容（东南西北）：');
    const cardinalContents = generateDirectionContent(['cardinal'], 4, 'fr-FR');
    cardinalContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (位置: x=${content.buttonPosition.x}, y=${content.buttonPosition.y})`);
    });

    // 2. 生成相对方位内容
    console.log('\n2. 生成相对方位内容（左右前后）：');
    const relativeContents = generateDirectionContent(['relative'], 4, 'fr-FR');
    relativeContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (位置: x=${content.buttonPosition.x}, y=${content.buttonPosition.y})`);
    });

    // 3. 生成空间方位内容
    console.log('\n3. 生成空间方位内容（上下里外）：');
    const spatialContents = generateDirectionContent(['spatial'], 4, 'fr-FR');
    spatialContents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.displayText} (位置: x=${content.buttonPosition.x}, y=${content.buttonPosition.y})`);
    });

    // 4. 混合类型生成
    console.log('\n4. 混合类型生成：');
    const mixedContents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 6, 'fr-FR');
    mixedContents.forEach((content, index) => {
        console.log(`   ${index + 1}. [${content.type}] ${content.displayText} (位置: x=${content.buttonPosition.x}, y=${content.buttonPosition.y})`);
    });
}

// 演示：答案验证功能
function demonstrateAnswerValidation() {
    console.log('\n=== 答案验证演示 ===\n');

    const testContent = generateDirectionContent(['cardinal'], 1, 'fr-FR')[0];
    console.log(`测试内容: ${testContent.displayText}`);
    console.log(`正确答案: ${testContent.value}`);

    // 测试不同的用户输入
    const testAnswers = [
        testContent.value,           // 完全匹配
        testContent.value.toLowerCase(), // 小写
        testContent.value.toUpperCase(), // 大写
        'wrong answer',              // 错误答案
        ''                          // 空答案
    ];

    testAnswers.forEach((answer, index) => {
        const isCorrect = validateDirectionAnswer(testContent, answer);
        console.log(`   测试 ${index + 1}: "${answer}" -> ${isCorrect ? '✓ 正确' : '✗ 错误'}`);
    });
}

// 演示：多语言支持
function demonstrateMultiLanguageSupport() {
    console.log('\n=== 多语言支持演示 ===\n');

    const languages = [
        { code: 'fr-FR', name: '法语' },
        { code: 'en-US', name: '英语' },
        { code: 'zh-CN', name: '中文' },
        { code: 'de-DE', name: '德语' },
        { code: 'es-ES', name: '西班牙语' }
    ];

    languages.forEach(lang => {
        console.log(`${lang.name} (${lang.code}):`);

        // 生成基本方位示例
        const cardinalContent = generateDirectionContent(['cardinal'], 1, lang.code)[0];
        console.log(`   基本方位: ${cardinalContent.displayText}`);

        // 生成相对方位示例
        const relativeContent = generateDirectionContent(['relative'], 1, lang.code)[0];
        console.log(`   相对方位: ${relativeContent.displayText}`);

        // 生成空间方位示例
        const spatialContent = generateDirectionContent(['spatial'], 1, lang.code)[0];
        console.log(`   空间方位: ${spatialContent.displayText}`);

        console.log('');
    });
}

// 演示：获取可用方位选项
function demonstrateAvailableDirections() {
    console.log('\n=== 可用方位选项演示 ===\n');

    const types: ('cardinal' | 'relative' | 'spatial')[] = ['cardinal', 'relative', 'spatial'];
    const typeNames = {
        cardinal: '基本方位',
        relative: '相对方位',
        spatial: '空间方位'
    };

    types.forEach(type => {
        console.log(`${typeNames[type]}选项 (法语):`);
        const directions = getAvailableDirections(type, 'fr-FR');
        directions.forEach((direction, index) => {
            console.log(`   ${index + 1}. ${direction.displayText} (位置: x=${direction.buttonPosition.x}, y=${direction.buttonPosition.y})`);
        });
        console.log('');
    });
}

// 演示：提示信息功能
function demonstrateHints() {
    console.log('\n=== 提示信息演示 ===\n');

    const testContents = [
        generateDirectionContent(['cardinal'], 1, 'fr-FR')[0],
        generateDirectionContent(['relative'], 1, 'fr-FR')[0],
        generateDirectionContent(['spatial'], 1, 'fr-FR')[0]
    ];

    testContents.forEach((content, index) => {
        const hint = getDirectionContentHint(content, 'fr-FR');
        console.log(`${index + 1}. 类型: ${content.type}, 内容: ${content.displayText}`);
        console.log(`   提示: ${hint}`);
        console.log('');
    });
}

// 演示：TTS格式化功能
function demonstrateTTSFormatting() {
    console.log('\n=== TTS格式化演示 ===\n');

    const testContents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 3, 'fr-FR');

    testContents.forEach((content, index) => {
        const formatted = formatDirectionContent(content, 'fr-FR');
        console.log(`${index + 1}. 原始: ${content.displayText} -> TTS: ${formatted}`);
    });
}

// 运行所有演示
function runAllDemonstrations() {
    demonstrateDirectionGeneration();
    demonstrateAnswerValidation();
    demonstrateMultiLanguageSupport();
    demonstrateAvailableDirections();
    demonstrateHints();
    demonstrateTTSFormatting();
}

// 如果直接运行此文件，执行演示
if (typeof window === 'undefined') {
    // Node.js 环境
    runAllDemonstrations();
} else {
    // 浏览器环境，将函数暴露到全局
    (window as any).directionGenerationDemo = {
        runAllDemonstrations,
        demonstrateDirectionGeneration,
        demonstrateAnswerValidation,
        demonstrateMultiLanguageSupport,
        demonstrateAvailableDirections,
        demonstrateHints,
        demonstrateTTSFormatting
    };

    console.log('方位生成演示已加载。使用 directionGenerationDemo.runAllDemonstrations() 运行所有演示。');
}

export {
    demonstrateAnswerValidation, demonstrateAvailableDirections, demonstrateDirectionGeneration, demonstrateHints, demonstrateMultiLanguageSupport, demonstrateTTSFormatting, runAllDemonstrations
};
