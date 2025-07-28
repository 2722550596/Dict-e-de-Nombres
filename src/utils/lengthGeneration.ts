import { LengthContent } from '../types/game.types';

// 获取当前听写语言设置
function getCurrentDictationLanguage(): string {
    const saved = localStorage.getItem('selectedDictationLanguage');
    if (saved) {
        // 映射简短代码到完整语言代码
        const languageMap: Record<string, string> = {
            'fr': 'fr-FR',
            'en': 'en-US',
            'de': 'de-DE',
            'es': 'es-ES',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'zh': 'zh-CN',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'ar': 'ar-SA',
            'ru': 'ru-RU',
            'nl': 'nl-NL',
            'sv': 'sv-SE',
            'no': 'no-NO'
        };
        return languageMap[saved] || 'fr-FR';
    }
    return 'fr-FR'; // 默认法语
}

// 多语言长度单位映射
const lengthUnits: Record<string, Record<string, { name: string; abbreviations: string[]; baseValue: number }>> = {
    'fr-FR': {
        'millimètre': { name: 'millimètre', abbreviations: ['mm', 'millimètre', 'millimètres'], baseValue: 0.001 },
        'centimètre': { name: 'centimètre', abbreviations: ['cm', 'centimètre', 'centimètres'], baseValue: 0.01 },
        'mètre': { name: 'mètre', abbreviations: ['m', 'mètre', 'mètres'], baseValue: 1 },
        'kilomètre': { name: 'kilomètre', abbreviations: ['km', 'kilomètre', 'kilomètres'], baseValue: 1000 },
        'pouce': { name: 'pouce', abbreviations: ['in', 'pouce', 'pouces'], baseValue: 0.0254 },
        'pied': { name: 'pied', abbreviations: ['ft', 'pied', 'pieds'], baseValue: 0.3048 },
        'yard': { name: 'yard', abbreviations: ['yd', 'yard', 'yards'], baseValue: 0.9144 },
        'mile': { name: 'mile', abbreviations: ['mi', 'mile', 'miles'], baseValue: 1609.34 }
    },
    'en-US': {
        'millimeter': { name: 'millimeter', abbreviations: ['mm', 'millimeter', 'millimeters'], baseValue: 0.001 },
        'centimeter': { name: 'centimeter', abbreviations: ['cm', 'centimeter', 'centimeters'], baseValue: 0.01 },
        'meter': { name: 'meter', abbreviations: ['m', 'meter', 'meters'], baseValue: 1 },
        'kilometer': { name: 'kilometer', abbreviations: ['km', 'kilometer', 'kilometers'], baseValue: 1000 },
        'inch': { name: 'inch', abbreviations: ['in', 'inch', 'inches'], baseValue: 0.0254 },
        'foot': { name: 'foot', abbreviations: ['ft', 'foot', 'feet'], baseValue: 0.3048 },
        'yard': { name: 'yard', abbreviations: ['yd', 'yard', 'yards'], baseValue: 0.9144 },
        'mile': { name: 'mile', abbreviations: ['mi', 'mile', 'miles'], baseValue: 1609.34 }
    },
    'de-DE': {
        'Millimeter': { name: 'Millimeter', abbreviations: ['mm', 'Millimeter'], baseValue: 0.001 },
        'Zentimeter': { name: 'Zentimeter', abbreviations: ['cm', 'Zentimeter'], baseValue: 0.01 },
        'Meter': { name: 'Meter', abbreviations: ['m', 'Meter'], baseValue: 1 },
        'Kilometer': { name: 'Kilometer', abbreviations: ['km', 'Kilometer'], baseValue: 1000 }
    },
    'es-ES': {
        'milímetro': { name: 'milímetro', abbreviations: ['mm', 'milímetro', 'milímetros'], baseValue: 0.001 },
        'centímetro': { name: 'centímetro', abbreviations: ['cm', 'centímetro', 'centímetros'], baseValue: 0.01 },
        'metro': { name: 'metro', abbreviations: ['m', 'metro', 'metros'], baseValue: 1 },
        'kilómetro': { name: 'kilómetro', abbreviations: ['km', 'kilómetro', 'kilómetros'], baseValue: 1000 }
    },
    'it-IT': {
        'millimetro': { name: 'millimetro', abbreviations: ['mm', 'millimetro', 'millimetri'], baseValue: 0.001 },
        'centimetro': { name: 'centimetro', abbreviations: ['cm', 'centimetro', 'centimetri'], baseValue: 0.01 },
        'metro': { name: 'metro', abbreviations: ['m', 'metro', 'metri'], baseValue: 1 },
        'chilometro': { name: 'chilometro', abbreviations: ['km', 'chilometro', 'chilometri'], baseValue: 1000 }
    },
    'pt-PT': {
        'milímetro': { name: 'milímetro', abbreviations: ['mm', 'milímetro', 'milímetros'], baseValue: 0.001 },
        'centímetro': { name: 'centímetro', abbreviations: ['cm', 'centímetro', 'centímetros'], baseValue: 0.01 },
        'metro': { name: 'metro', abbreviations: ['m', 'metro', 'metros'], baseValue: 1 },
        'quilómetro': { name: 'quilómetro', abbreviations: ['km', 'quilómetro', 'quilómetros'], baseValue: 1000 }
    },
    'zh-CN': {
        '毫米': { name: '毫米', abbreviations: ['mm', '毫米'], baseValue: 0.001 },
        '厘米': { name: '厘米', abbreviations: ['cm', '厘米'], baseValue: 0.01 },
        '米': { name: '米', abbreviations: ['m', '米'], baseValue: 1 },
        '公里': { name: '公里', abbreviations: ['km', '公里', '千米'], baseValue: 1000 },
        '寸': { name: '寸', abbreviations: ['寸'], baseValue: 0.0333 },
        '尺': { name: '尺', abbreviations: ['尺'], baseValue: 0.333 },
        '丈': { name: '丈', abbreviations: ['丈'], baseValue: 3.33 }
    },
    'ja-JP': {
        'ミリメートル': { name: 'ミリメートル', abbreviations: ['mm', 'ミリメートル'], baseValue: 0.001 },
        'センチメートル': { name: 'センチメートル', abbreviations: ['cm', 'センチメートル'], baseValue: 0.01 },
        'メートル': { name: 'メートル', abbreviations: ['m', 'メートル'], baseValue: 1 },
        'キロメートル': { name: 'キロメートル', abbreviations: ['km', 'キロメートル'], baseValue: 1000 }
    },
    'ko-KR': {
        '밀리미터': { name: '밀리미터', abbreviations: ['mm', '밀리미터'], baseValue: 0.001 },
        '센티미터': { name: '센티미터', abbreviations: ['cm', '센티미터'], baseValue: 0.01 },
        '미터': { name: '미터', abbreviations: ['m', '미터'], baseValue: 1 },
        '킬로미터': { name: '킬로미터', abbreviations: ['km', '킬로미터'], baseValue: 1000 }
    },
    'ar-SA': {
        'مليمتر': { name: 'مليمتر', abbreviations: ['mm', 'مليمتر'], baseValue: 0.001 },
        'سنتيمتر': { name: 'سنتيمتر', abbreviations: ['cm', 'سنتيمتر'], baseValue: 0.01 },
        'متر': { name: 'متر', abbreviations: ['m', 'متر'], baseValue: 1 },
        'كيلومتر': { name: 'كيلومتر', abbreviations: ['km', 'كيلومتر'], baseValue: 1000 }
    },
    'ru-RU': {
        'миллиметр': { name: 'миллиметр', abbreviations: ['мм', 'миллиметр'], baseValue: 0.001 },
        'сантиметр': { name: 'сантиметр', abbreviations: ['см', 'сантиметр'], baseValue: 0.01 },
        'метр': { name: 'метр', abbreviations: ['м', 'метр'], baseValue: 1 },
        'километр': { name: 'километр', abbreviations: ['км', 'километр'], baseValue: 1000 }
    },
    'nl-NL': {
        'millimeter': { name: 'millimeter', abbreviations: ['mm', 'millimeter'], baseValue: 0.001 },
        'centimeter': { name: 'centimeter', abbreviations: ['cm', 'centimeter'], baseValue: 0.01 },
        'meter': { name: 'meter', abbreviations: ['m', 'meter'], baseValue: 1 },
        'kilometer': { name: 'kilometer', abbreviations: ['km', 'kilometer'], baseValue: 1000 }
    },
    'sv-SE': {
        'millimeter': { name: 'millimeter', abbreviations: ['mm', 'millimeter'], baseValue: 0.001 },
        'centimeter': { name: 'centimeter', abbreviations: ['cm', 'centimeter'], baseValue: 0.01 },
        'meter': { name: 'meter', abbreviations: ['m', 'meter'], baseValue: 1 },
        'kilometer': { name: 'kilometer', abbreviations: ['km', 'kilometer'], baseValue: 1000 }
    },
    'no-NO': {
        'millimeter': { name: 'millimeter', abbreviations: ['mm', 'millimeter'], baseValue: 0.001 },
        'centimeter': { name: 'centimeter', abbreviations: ['cm', 'centimeter'], baseValue: 0.01 },
        'meter': { name: 'meter', abbreviations: ['m', 'meter'], baseValue: 1 },
        'kilometer': { name: 'kilometer', abbreviations: ['km', 'kilometer'], baseValue: 1000 }
    }
};

// 数字转文字映射（用于生成文字+单位格式）
const numberToWords: Record<string, Record<number, string>> = {
    'fr-FR': {
        0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
        6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
        11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
        16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt',
        30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante',
        70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix', 100: 'cent'
    },
    'en-US': {
        0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
        6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
        11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
        16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
        30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty',
        70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'hundred'
    },
    'zh-CN': {
        0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
        6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
        11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五',
        16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十',
        30: '三十', 40: '四十', 50: '五十', 60: '六十',
        70: '七十', 80: '八十', 90: '九十', 100: '一百'
    }
};

// 长度范围配置（基于复杂度）
const lengthRangeConfigs: Record<string, { range: [number, number]; units: string[]; complexity: 'basic' | 'intermediate' | 'advanced' }> = {
    'basic-metric': {
        range: [1, 100],
        units: ['厘米', '米'],
        complexity: 'basic'
    },
    'intermediate-metric': {
        range: [0.1, 1000],
        units: ['毫米', '厘米', '米'],
        complexity: 'intermediate'
    },
    'advanced-metric': {
        range: [0.01, 10000],
        units: ['毫米', '厘米', '米', '公里'],
        complexity: 'advanced'
    },
    'basic-imperial': {
        range: [1, 100],
        units: ['inch', 'foot'],
        complexity: 'basic'
    },
    'mixed-units': {
        range: [0.1, 1000],
        units: ['毫米', '厘米', '米', 'inch', 'foot'],
        complexity: 'advanced'
    }
};

// 生成随机长度值
function generateRandomLength(range: [number, number], unit: string, language: string): { value: number; hasDecimal: boolean } {
    const [min, max] = range;
    const unitData = lengthUnits[language]?.[unit];

    if (!unitData) {
        // 如果找不到单位数据，使用默认范围
        const value = Math.random() * (max - min) + min;
        return {
            value: Math.round(value * 100) / 100,
            hasDecimal: value % 1 !== 0
        };
    }

    // 根据单位调整数值范围
    let adjustedMin = min;
    let adjustedMax = max;

    // 对于小单位（毫米），使用较大的数值
    if (unitData.baseValue < 0.01) {
        adjustedMin = Math.max(min, 1);
        adjustedMax = Math.min(max, 1000);
    }
    // 对于大单位（公里），使用较小的数值
    else if (unitData.baseValue > 100) {
        adjustedMin = Math.max(min, 0.1);
        adjustedMax = Math.min(max, 100);
    }

    const value = Math.random() * (adjustedMax - adjustedMin) + adjustedMin;

    // 根据单位决定是否使用小数
    const shouldUseDecimal = Math.random() < 0.3 && unitData.baseValue >= 0.01;
    const finalValue = shouldUseDecimal ?
        Math.round(value * 100) / 100 :
        Math.round(value);

    return {
        value: finalValue,
        hasDecimal: shouldUseDecimal
    };
}

// 数字转文字（简化版，支持基本数字）
function numberToText(num: number, language: string): string {
    const words = numberToWords[language];
    if (!words) return num.toString();

    if (num <= 20 || words[num]) {
        return words[num] || num.toString();
    }

    // 处理21-99的数字
    if (num < 100) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;

        if (language === 'fr-FR') {
            if (tens === 70) {
                return ones === 0 ? 'soixante-dix' : `soixante-${words[10 + ones]}`;
            } else if (tens === 80) {
                return ones === 0 ? 'quatre-vingts' : `quatre-vingt-${words[ones]}`;
            } else if (tens === 90) {
                return ones === 0 ? 'quatre-vingt-dix' : `quatre-vingt-${words[10 + ones]}`;
            } else {
                return ones === 0 ? words[tens] : `${words[tens]}-${words[ones]}`;
            }
        } else if (language === 'en-US') {
            return ones === 0 ? words[tens] : `${words[tens]}-${words[ones]}`;
        } else if (language === 'zh-CN') {
            if (tens === 10) {
                return ones === 0 ? '十' : `十${words[ones]}`;
            } else {
                return ones === 0 ? words[tens] : `${words[tens]}${words[ones]}`;
            }
        }
    }

    // 对于更大的数字，返回数字形式
    return num.toString();
}

// 生成长度表达的多种格式
function generateLengthFormats(value: number, unit: string, language: string): string[] {
    const formats: string[] = [];
    const unitData = lengthUnits[language]?.[unit];

    if (!unitData) {
        formats.push(`${value} ${unit}`);
        return formats;
    }

    // 基本格式：数字 + 单位
    formats.push(`${value} ${unit}`);
    formats.push(`${value}${unit}`);

    // 添加缩写格式
    unitData.abbreviations.forEach(abbr => {
        formats.push(`${value} ${abbr}`);
        formats.push(`${value}${abbr}`);
    });

    // 文字 + 单位格式（仅对较小的整数）
    if (value <= 100 && value % 1 === 0) {
        const textNumber = numberToText(value, language);
        if (textNumber !== value.toString()) {
            formats.push(`${textNumber} ${unit}`);
            unitData.abbreviations.forEach(abbr => {
                formats.push(`${textNumber} ${abbr}`);
            });
        }
    }

    // 小数格式变体
    if (value % 1 !== 0) {
        const integerPart = Math.floor(value);
        const decimalPart = Math.round((value - integerPart) * 100);

        if (language === 'zh-CN') {
            // 中文小数表达：三点五米
            formats.push(`${numberToText(integerPart, language)}点${numberToText(decimalPart, language)}${unit}`);
        } else if (language === 'fr-FR') {
            // 法语小数表达：trois virgule cinq mètres
            formats.push(`${numberToText(integerPart, language)} virgule ${numberToText(decimalPart, language)} ${unit}`);
        } else if (language === 'en-US') {
            // 英语小数表达：three point five meters
            formats.push(`${numberToText(integerPart, language)} point ${numberToText(decimalPart, language)} ${unit}`);
        }
    }

    return Array.from(new Set(formats)); // 去重
}

// 单位换算验证
function validateUnitConversion(userValue: number, userUnit: string, correctValue: number, correctUnit: string, language: string): boolean {
    const userUnitData = lengthUnits[language]?.[userUnit];
    const correctUnitData = lengthUnits[language]?.[correctUnit];

    if (!userUnitData || !correctUnitData) {
        return false;
    }

    // 转换为基本单位（米）进行比较
    const userInMeters = userValue * userUnitData.baseValue;
    const correctInMeters = correctValue * correctUnitData.baseValue;

    // 允许5%的误差
    const tolerance = 0.05;
    const difference = Math.abs(userInMeters - correctInMeters) / correctInMeters;

    return difference <= tolerance;
}

// 解析用户输入的长度表达
function parseLengthInput(input: string, language: string): { value: number; unit: string } | null {
    const trimmedInput = input.trim();

    // 尝试匹配数字和单位的各种组合
    const patterns = [
        /^(\d+(?:\.\d+)?)\s*(.+)$/, // 数字 + 空格 + 单位
        /^(\d+(?:\.\d+)?)(.+)$/,    // 数字 + 单位（无空格）
    ];

    for (const pattern of patterns) {
        const match = trimmedInput.match(pattern);
        if (match) {
            const value = parseFloat(match[1]);
            const unitStr = match[2].trim();

            // 查找匹配的单位
            const units = lengthUnits[language] || {};
            for (const [unitKey, unitData] of Object.entries(units)) {
                if (unitData.abbreviations.some(abbr =>
                    abbr.toLowerCase() === unitStr.toLowerCase()
                )) {
                    return { value, unit: unitKey };
                }
            }
        }
    }

    return null;
}

// 长度内容验证函数 - 使用新的验证引擎
export function validateLengthAnswer(content: LengthContent, userAnswer: string, language?: string): boolean {
    try {
        const { validationEngine } = require('./i18n/validation-engine');
        const speechLang = language || getCurrentDictationLanguage();

        const result = validationEngine.validateLength(userAnswer, content, speechLang);
        return result.isValid;
    } catch (error) {
        console.warn('Failed to use new validation engine, falling back to legacy validation:', error);

        // 回退到原有的验证逻辑
        if (!userAnswer || !content.acceptedFormats) {
            return false;
        }

        const normalizedAnswer = userAnswer.trim().toLowerCase();

        // 直接匹配接受的格式
        const directMatch = content.acceptedFormats.some(format =>
            normalizedAnswer === format.toLowerCase()
        );

        if (directMatch) {
            return true;
        }

        // 尝试解析用户输入进行单位换算验证
        const speechLang = language || getCurrentDictationLanguage();
        const parsedInput = parseLengthInput(userAnswer, speechLang);

        if (parsedInput) {
            // 只有当单位相同且数值相同时才认为正确，或者进行单位换算验证
            if (parsedInput.unit === content.unit) {
                return Math.abs(parsedInput.value - content.value) < 0.001;
            } else {
                return validateUnitConversion(
                    parsedInput.value,
                    parsedInput.unit,
                    content.value,
                    content.unit,
                    speechLang
                );
            }
        }

        return false;
    }
}

// 长度内容格式化函数（用于TTS） - 使用新的格式化器
export function formatLengthContent(content: LengthContent, language: string): string {
    try {
        const { contentFormatter } = require('./i18n/content-formatter');
        const formatted = contentFormatter.formatLength(content, language);
        return formatted.ttsText;
    } catch (error) {
        console.warn('Failed to use new content formatter, falling back to legacy formatting:', error);

        // 回退到原有的格式化逻辑
        return content.displayText;
    }
}

// 主要的长度内容生成函数
export function generateLengthContent(
    units: string[],
    range: [number, number],
    quantity: number,
    language?: string
): LengthContent[] {
    const speechLang = language || getCurrentDictationLanguage();
    const result: LengthContent[] = [];
    const availableUnits = lengthUnits[speechLang] || lengthUnits['fr-FR'];

    // 过滤有效的单位
    const validUnits = units.filter(unit => availableUnits[unit]);
    if (validUnits.length === 0) {
        // 如果没有有效单位，使用默认单位
        const defaultUnits = Object.keys(availableUnits).slice(0, 3);
        validUnits.push(...defaultUnits);
    }

    // 生成指定数量的长度内容
    for (let i = 0; i < quantity; i++) {
        // 随机选择一个单位
        const randomUnit = validUnits[Math.floor(Math.random() * validUnits.length)];
        const { value, hasDecimal } = generateRandomLength(range, randomUnit, speechLang);

        // 生成显示文本
        let displayText: string;
        if (speechLang === 'zh-CN') {
            displayText = hasDecimal ?
                `${value}${randomUnit}` :
                `${value}${randomUnit}`;
        } else {
            displayText = `${value} ${randomUnit}`;
        }

        // 生成接受的答案格式
        const acceptedFormats = generateLengthFormats(value, randomUnit, speechLang);

        const lengthContent: LengthContent = {
            value,
            unit: randomUnit,
            displayText,
            acceptedFormats
        };

        result.push(lengthContent);
    }

    return result;
}

// 批量验证长度答案
export function validateLengthAnswers(
    contents: LengthContent[],
    userAnswers: string[],
    language?: string
): boolean[] {
    const speechLang = language || getCurrentDictationLanguage();
    return contents.map((content, index) => {
        const userAnswer = userAnswers[index];
        return validateLengthAnswer(content, userAnswer, speechLang);
    });
}

// 获取长度内容的提示信息
export function getLengthContentHint(content: LengthContent, language: string): string {
    const hintsByLanguage: Record<string, string> = {
        'fr-FR': `Entrez la longueur (ex: ${content.value} ${content.unit})`,
        'en-US': `Enter the length (e.g., ${content.value} ${content.unit})`,
        'zh-CN': `输入长度（如：${content.value}${content.unit}）`,
        'de-DE': `Geben Sie die Länge ein (z.B. ${content.value} ${content.unit})`,
        'es-ES': `Ingrese la longitud (ej: ${content.value} ${content.unit})`,
        'it-IT': `Inserisci la lunghezza (es: ${content.value} ${content.unit})`,
        'pt-PT': `Digite o comprimento (ex: ${content.value} ${content.unit})`,
        'ja-JP': `長さを入力してください（例：${content.value} ${content.unit}）`,
        'ko-KR': `길이를 입력하세요 (예: ${content.value} ${content.unit})`,
        'ar-SA': `أدخل الطول (مثال: ${content.value} ${content.unit})`,
        'ru-RU': `Введите длину (например: ${content.value} ${content.unit})`,
        'nl-NL': `Voer de lengte in (bijv: ${content.value} ${content.unit})`,
        'sv-SE': `Ange längden (t.ex: ${content.value} ${content.unit})`,
        'no-NO': `Skriv inn lengden (f.eks: ${content.value} ${content.unit})`
    };

    return hintsByLanguage[language] || hintsByLanguage['fr-FR'];
}

// 获取可用的长度单位列表
export function getAvailableLengthUnits(language: string): string[] {
    const units = lengthUnits[language] || lengthUnits['fr-FR'];
    return Object.keys(units);
}

// 获取长度范围配置
export function getLengthRangeConfig(configName: string): { range: [number, number]; units: string[]; complexity: 'basic' | 'intermediate' | 'advanced' } {
    return lengthRangeConfigs[configName] || lengthRangeConfigs['basic-metric'];
}

// 获取所有可用的长度范围配置
export function getAvailableLengthRangeConfigs(): Record<string, { range: [number, number]; units: string[]; complexity: 'basic' | 'intermediate' | 'advanced' }> {
    return lengthRangeConfigs;
}

// 单位换算工具函数
export function convertLength(value: number, fromUnit: string, toUnit: string, language: string): number | null {
    const units = lengthUnits[language] || lengthUnits['fr-FR'];
    const fromUnitData = units[fromUnit];
    const toUnitData = units[toUnit];

    if (!fromUnitData || !toUnitData) {
        return null;
    }

    // 转换为基本单位（米），然后转换为目标单位
    const valueInMeters = value * fromUnitData.baseValue;
    const convertedValue = valueInMeters / toUnitData.baseValue;

    return Math.round(convertedValue * 1000) / 1000; // 保留3位小数
}

// 导出类型守卫函数
export function isLengthContent(obj: any): obj is LengthContent {
    return obj &&
        typeof obj.value === 'number' &&
        typeof obj.unit === 'string' &&
        typeof obj.displayText === 'string' &&
        Array.isArray(obj.acceptedFormats);
}