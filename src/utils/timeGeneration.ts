import { TimeContent } from '../types/game.types';

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

// 多语言月份名称映射
const monthNames: Record<string, string[]> = {
    'fr-FR': [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ],
    'en-US': [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    'de-DE': [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    'es-ES': [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],
    'it-IT': [
        'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
        'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ],
    'pt-PT': [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ],
    'zh-CN': [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    'ja-JP': [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    'ko-KR': [
        '일월', '이월', '삼월', '사월', '오월', '유월',
        '칠월', '팔월', '구월', '시월', '십일월', '십이월'
    ],
    'ar-SA': [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    'ru-RU': [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ],
    'nl-NL': [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ],
    'sv-SE': [
        'januari', 'februari', 'mars', 'april', 'maj', 'juni',
        'juli', 'augusti', 'september', 'oktober', 'november', 'december'
    ],
    'no-NO': [
        'januar', 'februar', 'mars', 'april', 'mai', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'desember'
    ]
};

// 多语言星期名称映射
const weekdayNames: Record<string, string[]> = {
    'fr-FR': ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    'en-US': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'de-DE': ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    'es-ES': ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    'it-IT': ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    'pt-PT': ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'],
    'zh-CN': ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    'ja-JP': ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
    'ko-KR': ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
    'ar-SA': ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    'ru-RU': ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
    'nl-NL': ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
    'sv-SE': ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'],
    'no-NO': ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']
};

// 生成年份内容
function generateYearContent(language: string): TimeContent {
    // 生成1900-2100年之间的随机年份
    const year = Math.floor(Math.random() * 201) + 1900;
    const yearStr = year.toString();

    // 根据语言生成不同的表达格式
    const acceptedAnswers: string[] = [yearStr];

    // 添加语言特定的年份格式
    if (language === 'zh-CN') {
        acceptedAnswers.push(`${year}年`);
    } else if (language === 'fr-FR') {
        acceptedAnswers.push(`${year}`);
        // 法语中年份有时会说成 "mille neuf cent..." 等，但这里简化处理
    }

    return {
        type: 'year',
        value: yearStr,
        displayText: yearStr,
        acceptedAnswers
    };
}

// 生成月份内容
function generateMonthContent(language: string): TimeContent {
    const monthIndex = Math.floor(Math.random() * 12);
    const monthNumber = monthIndex + 1;
    const months = monthNames[language] || monthNames['fr-FR'];
    const monthName = months[monthIndex];

    const acceptedAnswers: string[] = [
        monthName,
        monthName.toLowerCase(),
        monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase(),
        monthNumber.toString(),
        monthNumber < 10 ? `0${monthNumber}` : monthNumber.toString()
    ];

    // 添加语言特定格式
    if (language === 'zh-CN') {
        acceptedAnswers.push(`${monthNumber}月`);
    }

    return {
        type: 'month',
        value: monthName,
        displayText: monthName,
        acceptedAnswers: Array.from(new Set(acceptedAnswers)) // 去重
    };
}

// 生成日期内容
function generateDayContent(language: string): TimeContent {
    const day = Math.floor(Math.random() * 31) + 1;
    const dayStr = day.toString();

    const acceptedAnswers: string[] = [
        dayStr,
        day < 10 ? `0${day}` : dayStr
    ];

    // 添加语言特定格式
    if (language === 'zh-CN') {
        acceptedAnswers.push(`${day}日`, `${day}号`);
    } else if (language === 'fr-FR') {
        acceptedAnswers.push(`${day}`, `${day}e`);
        if (day === 1) {
            acceptedAnswers.push('1er', 'premier');
        }
    } else if (language === 'en-US') {
        if (day === 1 || day === 21 || day === 31) {
            acceptedAnswers.push(`${day}st`);
        } else if (day === 2 || day === 22) {
            acceptedAnswers.push(`${day}nd`);
        } else if (day === 3 || day === 23) {
            acceptedAnswers.push(`${day}rd`);
        } else {
            acceptedAnswers.push(`${day}th`);
        }
    }

    return {
        type: 'day',
        value: dayStr,
        displayText: dayStr,
        acceptedAnswers: Array.from(new Set(acceptedAnswers))
    };
}

// 生成星期内容
function generateWeekdayContent(language: string): TimeContent {
    const weekdays = weekdayNames[language] || weekdayNames['fr-FR'];
    const weekdayIndex = Math.floor(Math.random() * 7);
    const weekday = weekdays[weekdayIndex];

    const acceptedAnswers: string[] = [
        weekday,
        weekday.toLowerCase(),
        weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase()
    ];

    // 添加缩写形式
    if (language === 'fr-FR') {
        const abbreviations = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
        acceptedAnswers.push(abbreviations[weekdayIndex]);
    } else if (language === 'en-US') {
        const abbreviations = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        acceptedAnswers.push(abbreviations[weekdayIndex]);
    }

    return {
        type: 'weekday',
        value: weekday,
        displayText: weekday,
        acceptedAnswers: Array.from(new Set(acceptedAnswers))
    };
}

// 生成完整日期内容
function generateFullDateContent(language: string): TimeContent {
    const year = Math.floor(Math.random() * 201) + 1900;
    const monthIndex = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1; // 使用28避免月份天数问题

    const months = monthNames[language] || monthNames['fr-FR'];
    const monthName = months[monthIndex];
    const monthNumber = monthIndex + 1;

    let displayText: string;
    const acceptedAnswers: string[] = [];

    // 根据语言生成不同的日期格式
    switch (language) {
        case 'zh-CN':
            displayText = `${year}年${monthNumber}月${day}日`;
            acceptedAnswers.push(
                displayText,
                `${year}年${monthNumber}月${day}号`,
                `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`,
                `${year}/${monthNumber}/${day}`,
                `${monthNumber}月${day}日`,
                `${monthNumber}月${day}号`
            );
            break;

        case 'en-US':
            displayText = `${monthName} ${day}, ${year}`;
            acceptedAnswers.push(
                displayText,
                `${monthName} ${day} ${year}`,
                `${monthNumber}/${day}/${year}`,
                `${monthNumber}-${day}-${year}`,
                `${day} ${monthName} ${year}`,
                `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`
            );
            break;

        case 'fr-FR':
            displayText = `${day} ${monthName} ${year}`;
            acceptedAnswers.push(
                displayText,
                `${day}/${monthNumber}/${year}`,
                `${day}-${monthNumber}-${year}`,
                `${day} ${monthName.toLowerCase()} ${year}`,
                `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`,
                `le ${day} ${monthName} ${year}`
            );
            break;

        case 'de-DE':
            displayText = `${day}. ${monthName} ${year}`;
            acceptedAnswers.push(
                displayText,
                `${day}.${monthNumber}.${year}`,
                `${day}/${monthNumber}/${year}`,
                `${day} ${monthName} ${year}`,
                `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`
            );
            break;

        default:
            // 默认使用国际标准格式
            displayText = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
            acceptedAnswers.push(
                displayText,
                `${day} ${monthName} ${year}`,
                `${monthName} ${day}, ${year}`,
                `${day}/${monthNumber}/${year}`,
                `${monthNumber}/${day}/${year}`
            );
    }

    return {
        type: 'fullDate',
        value: displayText,
        displayText,
        acceptedAnswers: Array.from(new Set(acceptedAnswers))
    };
}

// 时间内容验证函数 - 使用新的验证引擎
export function validateTimeAnswer(content: TimeContent, userAnswer: string, language?: string): boolean {
    // 导入验证引擎（动态导入以避免循环依赖）
    try {
        const { validationEngine } = require('./i18n/validation-engine');
        const speechLang = language || getCurrentDictationLanguage();

        const result = validationEngine.validateTime(userAnswer, content, speechLang);
        return result.isValid;
    } catch (error) {
        console.warn('Failed to use new validation engine, falling back to legacy validation:', error);

        // 回退到原有的验证逻辑
        if (!userAnswer || !content.acceptedAnswers) {
            return false;
        }

        const normalizedAnswer = userAnswer.trim();

        // 检查是否匹配任何接受的答案格式
        return content.acceptedAnswers.some(accepted =>
            normalizedAnswer.toLowerCase() === accepted.toLowerCase()
        );
    }
}

// 时间内容格式化函数 - 使用新的格式化器
export function formatTimeContent(content: TimeContent, language: string): string {
    try {
        const { contentFormatter } = require('./i18n/content-formatter');
        const formatted = contentFormatter.formatTime(content, language);
        return formatted.ttsText;
    } catch (error) {
        console.warn('Failed to use new content formatter, falling back to legacy formatting:', error);

        // 回退到原有的格式化逻辑
        switch (content.type) {
            case 'year':
                return content.displayText;

            case 'month':
                return content.displayText;

            case 'day':
                // 对于日期，可能需要添加序数词等
                if (language === 'fr-FR' && content.value === '1') {
                    return 'premier';
                }
                return content.displayText;

            case 'weekday':
                return content.displayText;

            case 'fullDate':
                return content.displayText;

            default:
                return content.displayText;
        }
    }
}

// 主要的时间内容生成函数
export function generateTimeContent(
    types: ('year' | 'month' | 'day' | 'weekday' | 'fullDate')[],
    quantity: number,
    language?: string
): TimeContent[] {
    const speechLang = language || getCurrentDictationLanguage();
    const result: TimeContent[] = [];

    // 创建生成器映射
    const generators = {
        year: () => generateYearContent(speechLang),
        month: () => generateMonthContent(speechLang),
        day: () => generateDayContent(speechLang),
        weekday: () => generateWeekdayContent(speechLang),
        fullDate: () => generateFullDateContent(speechLang)
    };

    // 生成指定数量的时间内容
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

// 批量验证时间答案
export function validateTimeAnswers(
    contents: TimeContent[],
    userAnswers: string[],
    language?: string
): boolean[] {
    const speechLang = language || getCurrentDictationLanguage();
    return contents.map((content, index) => {
        const userAnswer = userAnswers[index];
        return validateTimeAnswer(content, userAnswer, speechLang);
    });
}

// 获取时间内容的提示信息
export function getTimeContentHint(content: TimeContent, language: string): string {
    const hintsByLanguage: Record<string, Record<string, string>> = {
        'fr-FR': {
            year: 'Entrez l\'année (ex: 2024)',
            month: 'Entrez le mois (ex: janvier ou 1)',
            day: 'Entrez le jour (ex: 15)',
            weekday: 'Entrez le jour de la semaine (ex: lundi)',
            fullDate: 'Entrez la date complète (ex: 15 janvier 2024)'
        },
        'en-US': {
            year: 'Enter the year (e.g., 2024)',
            month: 'Enter the month (e.g., January or 1)',
            day: 'Enter the day (e.g., 15)',
            weekday: 'Enter the weekday (e.g., Monday)',
            fullDate: 'Enter the full date (e.g., January 15, 2024)'
        },
        'zh-CN': {
            year: '输入年份（如：2024）',
            month: '输入月份（如：一月 或 1）',
            day: '输入日期（如：15）',
            weekday: '输入星期（如：星期一）',
            fullDate: '输入完整日期（如：2024年1月15日）'
        }
    };

    const hints = hintsByLanguage[language] || hintsByLanguage['fr-FR'];
    return hints[content.type] || '';
}

// 导出类型守卫函数
export function isTimeContent(obj: any): obj is TimeContent {
    return obj &&
        typeof obj.type === 'string' &&
        ['year', 'month', 'day', 'weekday', 'fullDate'].includes(obj.type) &&
        typeof obj.value === 'string' &&
        typeof obj.displayText === 'string' &&
        Array.isArray(obj.acceptedAnswers);
}