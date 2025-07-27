/**
 * 多语言运算符翻译映射
 * 支持14种国际语言的数学运算符表达
 */

// 支持的语言代码类型
export type SupportedDictationLanguage = 
  | 'fr-FR'  // 法语
  | 'en-US'  // 英语
  | 'de-DE'  // 德语
  | 'es-ES'  // 西班牙语
  | 'it-IT'  // 意大利语
  | 'pt-PT'  // 葡萄牙语
  | 'zh-CN'  // 中文
  | 'ja-JP'  // 日语
  | 'ko-KR'  // 韩语
  | 'ar-SA'  // 阿拉伯语
  | 'ru-RU'  // 俄语
  | 'nl-NL'  // 荷兰语
  | 'sv-SE'  // 瑞典语
  | 'no-NO'; // 挪威语

// 运算符类型
export type MathOperator = '+' | '-' | '×' | '÷';

// 运算符翻译接口
export interface OperatorTranslations {
  '+': string;
  '-': string;
  '×': string;
  '÷': string;
}

// 14种语言的运算符翻译映射
export const OPERATORS_BY_LANGUAGE: Record<SupportedDictationLanguage, OperatorTranslations> = {
  'fr-FR': {
    '+': 'plus',
    '-': 'moins', 
    '×': 'fois',
    '÷': 'divisé par'
  },
  'en-US': {
    '+': 'plus',
    '-': 'minus',
    '×': 'times',
    '÷': 'divided by'
  },
  'de-DE': {
    '+': 'plus',
    '-': 'minus',
    '×': 'mal',
    '÷': 'geteilt durch'
  },
  'es-ES': {
    '+': 'más',
    '-': 'menos',
    '×': 'por',
    '÷': 'dividido por'
  },
  'it-IT': {
    '+': 'più',
    '-': 'meno',
    '×': 'per',
    '÷': 'diviso per'
  },
  'pt-PT': {
    '+': 'mais',
    '-': 'menos',
    '×': 'vezes',
    '÷': 'dividido por'
  },
  'zh-CN': {
    '+': '加',
    '-': '减',
    '×': '乘',
    '÷': '除以'
  },
  'ja-JP': {
    '+': 'たす',
    '-': 'ひく',
    '×': 'かける',
    '÷': 'わる'
  },
  'ko-KR': {
    '+': '더하기',
    '-': '빼기',
    '×': '곱하기',
    '÷': '나누기'
  },
  'ar-SA': {
    '+': 'زائد',
    '-': 'ناقص',
    '×': 'ضرب',
    '÷': 'قسمة على'
  },
  'ru-RU': {
    '+': 'плюс',
    '-': 'минус',
    '×': 'умножить на',
    '÷': 'разделить на'
  },
  'nl-NL': {
    '+': 'plus',
    '-': 'min',
    '×': 'keer',
    '÷': 'gedeeld door'
  },
  'sv-SE': {
    '+': 'plus',
    '-': 'minus',
    '×': 'gånger',
    '÷': 'delat med'
  },
  'no-NO': {
    '+': 'pluss',
    '-': 'minus',
    '×': 'ganger',
    '÷': 'delt på'
  }
};

/**
 * 获取指定语言的运算符翻译
 */
export const getOperatorTranslation = (
  operator: MathOperator, 
  language: SupportedDictationLanguage
): string => {
  const translations = OPERATORS_BY_LANGUAGE[language];
  return translations?.[operator] || operator;
};

/**
 * 创建多语言数学表达式文本
 */
export const createMathExpressionText = (
  operand1: number,
  operator: MathOperator,
  operand2: number,
  language: SupportedDictationLanguage
): string => {
  const operatorText = getOperatorTranslation(operator, language);
  return `${operand1} ${operatorText} ${operand2}`;
};

/**
 * 检查语言是否支持
 */
export const isSupportedDictationLanguage = (language: string): language is SupportedDictationLanguage => {
  return Object.keys(OPERATORS_BY_LANGUAGE).includes(language as SupportedDictationLanguage);
};

/**
 * 获取所有支持的听写语言列表
 */
export const getSupportedDictationLanguages = (): SupportedDictationLanguage[] => {
  return Object.keys(OPERATORS_BY_LANGUAGE) as SupportedDictationLanguage[];
};

/**
 * 语言显示名称映射（用于UI显示）
 */
export const DICTATION_LANGUAGE_NAMES: Record<SupportedDictationLanguage, string> = {
  'fr-FR': 'Français',
  'en-US': 'English',
  'de-DE': 'Deutsch',
  'es-ES': 'Español',
  'it-IT': 'Italiano',
  'pt-PT': 'Português',
  'zh-CN': '中文',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'ar-SA': 'العربية',
  'ru-RU': 'Русский',
  'nl-NL': 'Nederlands',
  'sv-SE': 'Svenska',
  'no-NO': 'Norsk'
};

/**
 * 获取语言的显示名称
 */
export const getDictationLanguageName = (language: SupportedDictationLanguage): string => {
  return DICTATION_LANGUAGE_NAMES[language] || language;
};
