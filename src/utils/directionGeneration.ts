import { DirectionContent } from '../types/game.types';

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

// 多语言基本方位词汇映射（东南西北）
const cardinalDirections: Record<string, { directions: string[], compounds: string[] }> = {
    'fr-FR': {
        directions: ['nord', 'sud', 'est', 'ouest'],
        compounds: ['nord-est', 'nord-ouest', 'sud-est', 'sud-ouest']
    },
    'en-US': {
        directions: ['north', 'south', 'east', 'west'],
        compounds: ['northeast', 'northwest', 'southeast', 'southwest']
    },
    'de-DE': {
        directions: ['Norden', 'Süden', 'Osten', 'Westen'],
        compounds: ['Nordosten', 'Nordwesten', 'Südosten', 'Südwesten']
    },
    'es-ES': {
        directions: ['norte', 'sur', 'este', 'oeste'],
        compounds: ['noreste', 'noroeste', 'sureste', 'suroeste']
    },
    'it-IT': {
        directions: ['nord', 'sud', 'est', 'ovest'],
        compounds: ['nordest', 'nordovest', 'sudest', 'sudovest']
    },
    'pt-PT': {
        directions: ['norte', 'sul', 'leste', 'oeste'],
        compounds: ['nordeste', 'noroeste', 'sudeste', 'sudoeste']
    },
    'zh-CN': {
        directions: ['北', '南', '东', '西'],
        compounds: ['东北', '西北', '东南', '西南']
    },
    'ja-JP': {
        directions: ['北', '南', '東', '西'],
        compounds: ['北東', '北西', '南東', '南西']
    },
    'ko-KR': {
        directions: ['북', '남', '동', '서'],
        compounds: ['북동', '북서', '남동', '남서']
    },
    'ar-SA': {
        directions: ['شمال', 'جنوب', 'شرق', 'غرب'],
        compounds: ['شمال شرق', 'شمال غرب', 'جنوب شرق', 'جنوب غرب']
    },
    'ru-RU': {
        directions: ['север', 'юг', 'восток', 'запад'],
        compounds: ['северо-восток', 'северо-запад', 'юго-восток', 'юго-запад']
    },
    'nl-NL': {
        directions: ['noord', 'zuid', 'oost', 'west'],
        compounds: ['noordoost', 'noordwest', 'zuidoost', 'zuidwest']
    },
    'sv-SE': {
        directions: ['norr', 'söder', 'öster', 'väster'],
        compounds: ['nordost', 'nordväst', 'sydost', 'sydväst']
    },
    'no-NO': {
        directions: ['nord', 'sør', 'øst', 'vest'],
        compounds: ['nordøst', 'nordvest', 'sørøst', 'sørvest']
    }
};

// 多语言相对方位词汇映射（左右前后）
const relativeDirections: Record<string, string[]> = {
    'fr-FR': ['gauche', 'droite', 'devant', 'derrière'],
    'en-US': ['left', 'right', 'front', 'back'],
    'de-DE': ['links', 'rechts', 'vorne', 'hinten'],
    'es-ES': ['izquierda', 'derecha', 'delante', 'detrás'],
    'it-IT': ['sinistra', 'destra', 'davanti', 'dietro'],
    'pt-PT': ['esquerda', 'direita', 'frente', 'atrás'],
    'zh-CN': ['左', '右', '前', '后'],
    'ja-JP': ['左', '右', '前', '後ろ'],
    'ko-KR': ['왼쪽', '오른쪽', '앞', '뒤'],
    'ar-SA': ['يسار', 'يمين', 'أمام', 'خلف'],
    'ru-RU': ['лево', 'право', 'перед', 'зад'],
    'nl-NL': ['links', 'rechts', 'voor', 'achter'],
    'sv-SE': ['vänster', 'höger', 'fram', 'bak'],
    'no-NO': ['venstre', 'høyre', 'foran', 'bak']
};

// 多语言空间方位词汇映射（上下里外）
const spatialDirections: Record<string, string[]> = {
    'fr-FR': ['haut', 'bas', 'dedans', 'dehors'],
    'en-US': ['up', 'down', 'inside', 'outside'],
    'de-DE': ['oben', 'unten', 'innen', 'außen'],
    'es-ES': ['arriba', 'abajo', 'dentro', 'fuera'],
    'it-IT': ['sopra', 'sotto', 'dentro', 'fuori'],
    'pt-PT': ['cima', 'baixo', 'dentro', 'fora'],
    'zh-CN': ['上', '下', '里', '外'],
    'ja-JP': ['上', '下', '中', '外'],
    'ko-KR': ['위', '아래', '안', '밖'],
    'ar-SA': ['فوق', 'تحت', 'داخل', 'خارج'],
    'ru-RU': ['верх', 'низ', 'внутри', 'снаружи'],
    'nl-NL': ['boven', 'onder', 'binnen', 'buiten'],
    'sv-SE': ['upp', 'ner', 'inne', 'ute'],
    'no-NO': ['opp', 'ned', 'inne', 'ute']
};

// 按钮位置计算 - 基本方位（3x3网格）
const cardinalButtonPositions: Record<string, { x: number; y: number }> = {
    // 基本方位按钮位置（以3x3网格为基础）
    'nord': { x: 1, y: 0 },     // 上中
    'nord-est': { x: 2, y: 0 }, // 右上
    'est': { x: 2, y: 1 },      // 右中
    'sud-est': { x: 2, y: 2 },  // 右下
    'sud': { x: 1, y: 2 },      // 下中
    'sud-ouest': { x: 0, y: 2 }, // 左下
    'ouest': { x: 0, y: 1 },    // 左中
    'nord-ouest': { x: 0, y: 0 } // 左上
};

// 相对方位按钮位置（2x2网格）
const relativeButtonPositions: Record<string, { x: number; y: number }> = {
    'gauche': { x: 0, y: 1 },   // 左
    'droite': { x: 1, y: 1 },   // 右
    'devant': { x: 1, y: 0 },   // 前
    'derrière': { x: 1, y: 2 }  // 后
};

// 空间方位按钮位置（2x2网格）
const spatialButtonPositions: Record<string, { x: number; y: number }> = {
    'haut': { x: 1, y: 0 },     // 上
    'bas': { x: 1, y: 1 },      // 下
    'dedans': { x: 0, y: 0 },   // 里
    'dehors': { x: 2, y: 0 }    // 外
};

// 生成基本方位内容
function generateCardinalDirectionContent(language: string): DirectionContent {
    const cardinalData = cardinalDirections[language] || cardinalDirections['fr-FR'];
    const allDirections = [...cardinalData.directions, ...cardinalData.compounds];

    // 随机选择一个方位
    const randomIndex = Math.floor(Math.random() * allDirections.length);
    const direction = allDirections[randomIndex];

    // 计算按钮位置（基于法语键作为标准）
    const frenchCardinalData = cardinalDirections['fr-FR'];
    const frenchAllDirections = [...frenchCardinalData.directions, ...frenchCardinalData.compounds];
    const frenchDirection = frenchAllDirections[randomIndex];
    const buttonPosition = cardinalButtonPositions[frenchDirection] || { x: 1, y: 1 };

    return {
        type: 'cardinal',
        value: direction,
        displayText: direction,
        buttonPosition
    };
}

// 生成相对方位内容
function generateRelativeDirectionContent(language: string): DirectionContent {
    const directions = relativeDirections[language] || relativeDirections['fr-FR'];

    // 随机选择一个方位
    const randomIndex = Math.floor(Math.random() * directions.length);
    const direction = directions[randomIndex];

    // 计算按钮位置（基于法语键作为标准）
    const frenchDirections = relativeDirections['fr-FR'];
    const frenchDirection = frenchDirections[randomIndex];
    const buttonPosition = relativeButtonPositions[frenchDirection] || { x: 0, y: 0 };

    return {
        type: 'relative',
        value: direction,
        displayText: direction,
        buttonPosition
    };
}

// 生成空间方位内容
function generateSpatialDirectionContent(language: string): DirectionContent {
    const directions = spatialDirections[language] || spatialDirections['fr-FR'];

    // 随机选择一个方位
    const randomIndex = Math.floor(Math.random() * directions.length);
    const direction = directions[randomIndex];

    // 计算按钮位置（基于法语键作为标准）
    const frenchDirections = spatialDirections['fr-FR'];
    const frenchDirection = frenchDirections[randomIndex];
    const buttonPosition = spatialButtonPositions[frenchDirection] || { x: 0, y: 0 };

    return {
        type: 'spatial',
        value: direction,
        displayText: direction,
        buttonPosition
    };
}

// 方位内容验证函数 - 使用新的验证引擎
export function validateDirectionAnswer(content: DirectionContent, userAnswer: string, language?: string): boolean {
    try {
        const { validationEngine } = require('./i18n/validation-engine');
        const speechLang = language || getCurrentDictationLanguage();

        const result = validationEngine.validateDirection(userAnswer, content.value, speechLang);
        return result.isValid;
    } catch (error) {
        console.warn('Failed to use new validation engine, falling back to legacy validation:', error);

        // 回退到原有的验证逻辑
        if (!userAnswer || !content.value) {
            return false;
        }

        const normalizedAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrect = content.value.toLowerCase();

        // 直接匹配
        if (normalizedAnswer === normalizedCorrect) {
            return true;
        }

        // 检查同义词和变体（可以根据需要扩展）
        const synonyms: Record<string, string[]> = {
            // 法语同义词
            'nord': ['n'],
            'sud': ['s'],
            'est': ['e'],
            'ouest': ['o', 'w'],
            'gauche': ['g'],
            'droite': ['d'],
            'devant': ['avant'],
            'derrière': ['arrière'],

            // 英语同义词
            'north': ['n'],
            'south': ['s'],
            'east': ['e'],
            'west': ['w'],
            'left': ['l'],
            'right': ['r'],
            'front': ['forward'],
            'back': ['backward', 'behind'],

            // 中文同义词
            '前': ['前面'],
            '后': ['后面', '後'],
            '里': ['内', '里面'],
            '外': ['外面']
        };

        const possibleAnswers = synonyms[normalizedCorrect] || [];
        return possibleAnswers.some(synonym =>
            normalizedAnswer === synonym.toLowerCase()
        );
    }
}

// 方位内容格式化函数（用于TTS） - 使用新的格式化器
export function formatDirectionContent(content: DirectionContent, language: string): string {
    try {
        const { contentFormatter } = require('./i18n/content-formatter');
        const formatted = contentFormatter.formatDirection(content, language);
        return formatted.ttsText;
    } catch (error) {
        console.warn('Failed to use new content formatter, falling back to legacy formatting:', error);

        // 回退到原有的格式化逻辑
        return content.displayText;
    }
}

// 主要的方位内容生成函数
export function generateDirectionContent(
    types: ('cardinal' | 'relative' | 'spatial')[],
    quantity: number,
    language?: string
): DirectionContent[] {
    const speechLang = language || getCurrentDictationLanguage();
    const result: DirectionContent[] = [];

    // 创建生成器映射
    const generators = {
        cardinal: () => generateCardinalDirectionContent(speechLang),
        relative: () => generateRelativeDirectionContent(speechLang),
        spatial: () => generateSpatialDirectionContent(speechLang)
    };

    // 生成指定数量的方位内容
    for (let i = 0; i < quantity; i++) {
        // 随机选择一个类型
        const randomType = types[Math.floor(Math.random() * types.length)];
        const generator = generators[randomType];

        if (generator) {
            const content = generator();
            result.push(content);
        }
    }

    return result;
}

// 批量验证方位答案
export function validateDirectionAnswers(
    contents: DirectionContent[],
    userAnswers: string[],
    language?: string
): boolean[] {
    const speechLang = language || getCurrentDictationLanguage();
    return contents.map((content, index) => {
        const userAnswer = userAnswers[index];
        return validateDirectionAnswer(content, userAnswer, speechLang);
    });
}

// 获取方位内容的提示信息
export function getDirectionContentHint(content: DirectionContent, language: string): string {
    const hintsByLanguage: Record<string, Record<string, string>> = {
        'fr-FR': {
            cardinal: 'Cliquez sur la direction cardinale (nord, sud, est, ouest)',
            relative: 'Cliquez sur la direction relative (gauche, droite, devant, derrière)',
            spatial: 'Cliquez sur la direction spatiale (haut, bas, dedans, dehors)'
        },
        'en-US': {
            cardinal: 'Click on the cardinal direction (north, south, east, west)',
            relative: 'Click on the relative direction (left, right, front, back)',
            spatial: 'Click on the spatial direction (up, down, inside, outside)'
        },
        'zh-CN': {
            cardinal: '点击基本方位（北、南、东、西）',
            relative: '点击相对方位（左、右、前、后）',
            spatial: '点击空间方位（上、下、里、外）'
        }
    };

    const hints = hintsByLanguage[language] || hintsByLanguage['fr-FR'];
    return hints[content.type] || '';
}

// 获取指定类型的所有可用方位选项（用于按钮生成）
export function getAvailableDirections(
    type: 'cardinal' | 'relative' | 'spatial',
    language: string
): DirectionContent[] {
    const speechLang = language || getCurrentDictationLanguage();

    switch (type) {
        case 'cardinal': {
            const cardinalData = cardinalDirections[speechLang] || cardinalDirections['fr-FR'];
            const allDirections = [...cardinalData.directions, ...cardinalData.compounds];
            const frenchCardinalData = cardinalDirections['fr-FR'];
            const frenchAllDirections = [...frenchCardinalData.directions, ...frenchCardinalData.compounds];

            return allDirections.map((direction, index) => ({
                type: 'cardinal' as const,
                value: direction,
                displayText: direction,
                buttonPosition: cardinalButtonPositions[frenchAllDirections[index]] || { x: 1, y: 1 }
            }));
        }

        case 'relative': {
            const directions = relativeDirections[speechLang] || relativeDirections['fr-FR'];
            const frenchDirections = relativeDirections['fr-FR'];

            return directions.map((direction, index) => ({
                type: 'relative' as const,
                value: direction,
                displayText: direction,
                buttonPosition: relativeButtonPositions[frenchDirections[index]] || { x: 0, y: 0 }
            }));
        }

        case 'spatial': {
            const directions = spatialDirections[speechLang] || spatialDirections['fr-FR'];
            const frenchDirections = spatialDirections['fr-FR'];

            return directions.map((direction, index) => ({
                type: 'spatial' as const,
                value: direction,
                displayText: direction,
                buttonPosition: spatialButtonPositions[frenchDirections[index]] || { x: 0, y: 0 }
            }));
        }

        default:
            return [];
    }
}

// 导出类型守卫函数
export function isDirectionContent(obj: any): obj is DirectionContent {
    return obj &&
        typeof obj.type === 'string' &&
        ['cardinal', 'relative', 'spatial'].includes(obj.type) &&
        typeof obj.value === 'string' &&
        typeof obj.displayText === 'string' &&
        obj.buttonPosition &&
        typeof obj.buttonPosition.x === 'number' &&
        typeof obj.buttonPosition.y === 'number';
}