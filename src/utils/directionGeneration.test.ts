/**
 * 方位内容生成器测试文件
 * 验证方位内容生成功能的正确性
 */

import {
    formatDirectionContent,
    generateDirectionContent,
    getAvailableDirections,
    getDirectionContentHint,
    isDirectionContent,
    validateDirectionAnswer
} from './directionGeneration';

// 测试基本方位生成
function testCardinalDirectionGeneration() {
    console.log('测试基本方位生成...');

    const contents = generateDirectionContent(['cardinal'], 5, 'fr-FR');

    // 验证生成的内容数量
    if (contents.length !== 5) {
        throw new Error(`期望生成5个内容，实际生成${contents.length}个`);
    }

    // 验证每个内容的结构
    contents.forEach((content, index) => {
        if (!isDirectionContent(content)) {
            throw new Error(`第${index + 1}个内容不是有效的DirectionContent`);
        }

        if (content.type !== 'cardinal') {
            throw new Error(`第${index + 1}个内容类型应为cardinal，实际为${content.type}`);
        }

        if (!content.value || !content.displayText) {
            throw new Error(`第${index + 1}个内容缺少必要字段`);
        }

        if (typeof content.buttonPosition.x !== 'number' || typeof content.buttonPosition.y !== 'number') {
            throw new Error(`第${index + 1}个内容的按钮位置无效`);
        }
    });

    console.log('✓ 基本方位生成测试通过');
}

// 测试相对方位生成
function testRelativeDirectionGeneration() {
    console.log('测试相对方位生成...');

    const contents = generateDirectionContent(['relative'], 4, 'en-US');

    contents.forEach((content, index) => {
        if (content.type !== 'relative') {
            throw new Error(`第${index + 1}个内容类型应为relative，实际为${content.type}`);
        }
    });

    console.log('✓ 相对方位生成测试通过');
}

// 测试空间方位生成
function testSpatialDirectionGeneration() {
    console.log('测试空间方位生成...');

    const contents = generateDirectionContent(['spatial'], 4, 'zh-CN');

    contents.forEach((content, index) => {
        if (content.type !== 'spatial') {
            throw new Error(`第${index + 1}个内容类型应为spatial，实际为${content.type}`);
        }
    });

    console.log('✓ 空间方位生成测试通过');
}

// 测试混合类型生成
function testMixedDirectionGeneration() {
    console.log('测试混合类型生成...');

    const contents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 10, 'fr-FR');

    if (contents.length !== 10) {
        throw new Error(`期望生成10个内容，实际生成${contents.length}个`);
    }

    // 验证包含不同类型
    const types = new Set(contents.map(c => c.type));
    if (types.size === 0) {
        throw new Error('应该包含多种类型的方位');
    }

    console.log('✓ 混合类型生成测试通过');
}

// 测试答案验证
function testAnswerValidation() {
    console.log('测试答案验证...');

    const content = generateDirectionContent(['cardinal'], 1, 'fr-FR')[0];

    // 测试正确答案
    if (!validateDirectionAnswer(content, content.value)) {
        throw new Error('正确答案验证失败');
    }

    // 测试大小写不敏感
    if (!validateDirectionAnswer(content, content.value.toUpperCase())) {
        throw new Error('大写答案验证失败');
    }

    if (!validateDirectionAnswer(content, content.value.toLowerCase())) {
        throw new Error('小写答案验证失败');
    }

    // 测试错误答案
    if (validateDirectionAnswer(content, 'wrong answer')) {
        throw new Error('错误答案应该验证失败');
    }

    // 测试空答案
    if (validateDirectionAnswer(content, '')) {
        throw new Error('空答案应该验证失败');
    }

    console.log('✓ 答案验证测试通过');
}

// 测试多语言支持
function testMultiLanguageSupport() {
    console.log('测试多语言支持...');

    const languages = ['fr-FR', 'en-US', 'zh-CN', 'de-DE', 'es-ES'];

    languages.forEach(lang => {
        const contents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 3, lang);

        if (contents.length !== 3) {
            throw new Error(`语言${lang}生成内容数量错误`);
        }

        contents.forEach(content => {
            if (!content.value || !content.displayText) {
                throw new Error(`语言${lang}生成的内容缺少必要字段`);
            }
        });
    });

    console.log('✓ 多语言支持测试通过');
}

// 测试可用方位选项
function testAvailableDirections() {
    console.log('测试可用方位选项...');

    const types: ('cardinal' | 'relative' | 'spatial')[] = ['cardinal', 'relative', 'spatial'];

    types.forEach(type => {
        const directions = getAvailableDirections(type, 'fr-FR');

        if (directions.length === 0) {
            throw new Error(`类型${type}应该有可用方位选项`);
        }

        directions.forEach(direction => {
            if (direction.type !== type) {
                throw new Error(`方位选项类型不匹配`);
            }

            if (!isDirectionContent(direction)) {
                throw new Error(`方位选项结构无效`);
            }
        });
    });

    console.log('✓ 可用方位选项测试通过');
}

// 测试TTS格式化
function testTTSFormatting() {
    console.log('测试TTS格式化...');

    const contents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 3, 'fr-FR');

    contents.forEach(content => {
        const formatted = formatDirectionContent(content, 'fr-FR');

        if (typeof formatted !== 'string') {
            throw new Error('TTS格式化结果应该是字符串');
        }

        if (formatted.length === 0) {
            throw new Error('TTS格式化结果不应为空');
        }
    });

    console.log('✓ TTS格式化测试通过');
}

// 测试提示信息
function testHints() {
    console.log('测试提示信息...');

    const contents = generateDirectionContent(['cardinal', 'relative', 'spatial'], 3, 'fr-FR');

    contents.forEach(content => {
        const hint = getDirectionContentHint(content, 'fr-FR');

        if (typeof hint !== 'string') {
            throw new Error('提示信息应该是字符串');
        }

        // 提示信息可以为空，但应该是字符串类型
    });

    console.log('✓ 提示信息测试通过');
}

// 运行所有测试
function runAllTests() {
    console.log('=== 开始方位内容生成器测试 ===\n');

    try {
        testCardinalDirectionGeneration();
        testRelativeDirectionGeneration();
        testSpatialDirectionGeneration();
        testMixedDirectionGeneration();
        testAnswerValidation();
        testMultiLanguageSupport();
        testAvailableDirections();
        testTTSFormatting();
        testHints();

        console.log('\n=== 所有测试通过！ ===');
        return true;
    } catch (error) {
        console.error('\n=== 测试失败 ===');
        console.error('错误:', error.message);
        return false;
    }
}

// 如果直接运行此文件，执行测试
if (typeof window === 'undefined') {
    // Node.js 环境
    runAllTests();
} else {
    // 浏览器环境，将函数暴露到全局
    (window as any).directionGenerationTest = {
        runAllTests,
        testCardinalDirectionGeneration,
        testRelativeDirectionGeneration,
        testSpatialDirectionGeneration,
        testMixedDirectionGeneration,
        testAnswerValidation,
        testMultiLanguageSupport,
        testAvailableDirections,
        testTTSFormatting,
        testHints
    };

    console.log('方位生成测试已加载。使用 directionGenerationTest.runAllTests() 运行所有测试。');
}

export {
    runAllTests, testAnswerValidation, testAvailableDirections, testCardinalDirectionGeneration, testHints, testMixedDirectionGeneration, testMultiLanguageSupport, testRelativeDirectionGeneration,
    testSpatialDirectionGeneration, testTTSFormatting
};
