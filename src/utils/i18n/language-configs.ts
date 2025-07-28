/**
 * 语言配置系统
 * 为14种国际语言提供统一的配置数据结构
 */

// 语言配置接口定义
export interface LanguageConfig {
  // 基础信息
  code: string;
  speechLang: string;

  // 数字处理配置
  numberFormat: {
    useNativeFormatting: boolean; // 是否使用浏览器原生格式化
    decimalSeparator: string;     // 小数点符号
    thousandsSeparator: string;   // 千位分隔符
    specialRules?: string[];      // 特殊规则标识
  };

  // 时间格式配置
  timeFormat: {
    dateOrder: 'DMY' | 'MDY' | 'YMD';
    dateSeparator: string;
    useOrdinals: boolean;
    monthFormat: 'name' | 'number' | 'both';
  };

  // 单位偏好配置
  unitPreferences: {
    system: 'metric' | 'imperial' | 'mixed';
    preferredUnits: string[];
    conversionTolerance: number;
  };

  // TTS优化配置
  ttsConfig: {
    rate: number;
    pitch: number;
    volume: number;
    pauseAfterNumbers: boolean;
    numberSpacing: boolean;
  };
}

// 同义词映射接口
export interface SynonymMapping {
  [key: string]: string[];
}

// 方位词汇映射接口
export interface DirectionMapping {
  cardinal: string[];
  relative: string[];
  spatial: string[];
  compounds?: string[];
}

// 14种语言的配置数据
export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  'fr-FR': {
    code: 'fr-FR',
    speechLang: 'fr-FR',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: ' ',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '/',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'en-US': {
    code: 'en-US',
    speechLang: 'en-US',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    timeFormat: {
      dateOrder: 'MDY',
      dateSeparator: '/',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'imperial',
      preferredUnits: ['in', 'ft', 'yd'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: false,
      numberSpacing: false,
    },
  },

  'de-DE': {
    code: 'de-DE',
    speechLang: 'de-DE',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '.',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'es-ES': {
    code: 'es-ES',
    speechLang: 'es-ES',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '/',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'it-IT': {
    code: 'it-IT',
    speechLang: 'it-IT',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '/',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'pt-PT': {
    code: 'pt-PT',
    speechLang: 'pt-PT',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '/',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'zh-CN': {
    code: 'zh-CN',
    speechLang: 'zh-CN',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    timeFormat: {
      dateOrder: 'YMD',
      dateSeparator: '-',
      useOrdinals: false,
      monthFormat: 'both',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.8,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: true,
    },
  },

  'ja-JP': {
    code: 'ja-JP',
    speechLang: 'ja-JP',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    timeFormat: {
      dateOrder: 'YMD',
      dateSeparator: '/',
      useOrdinals: false,
      monthFormat: 'both',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.8,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: true,
    },
  },

  'ko-KR': {
    code: 'ko-KR',
    speechLang: 'ko-KR',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    timeFormat: {
      dateOrder: 'YMD',
      dateSeparator: '.',
      useOrdinals: false,
      monthFormat: 'both',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.8,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: true,
    },
  },

  'ar-SA': {
    code: 'ar-SA',
    speechLang: 'ar-SA',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '/',
      useOrdinals: false,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.85,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'ru-RU': {
    code: 'ru-RU',
    speechLang: 'ru-RU',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: ' ',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '.',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'nl-NL': {
    code: 'nl-NL',
    speechLang: 'nl-NL',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '-',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'sv-SE': {
    code: 'sv-SE',
    speechLang: 'sv-SE',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: ' ',
    },
    timeFormat: {
      dateOrder: 'YMD',
      dateSeparator: '-',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },

  'no-NO': {
    code: 'no-NO',
    speechLang: 'no-NO',
    numberFormat: {
      useNativeFormatting: true,
      decimalSeparator: ',',
      thousandsSeparator: ' ',
    },
    timeFormat: {
      dateOrder: 'DMY',
      dateSeparator: '.',
      useOrdinals: true,
      monthFormat: 'name',
    },
    unitPreferences: {
      system: 'metric',
      preferredUnits: ['mm', 'cm', 'm', 'km'],
      conversionTolerance: 0.01,
    },
    ttsConfig: {
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      pauseAfterNumbers: true,
      numberSpacing: false,
    },
  },
};

// 工具函数
export function getLanguageConfig(language: string): LanguageConfig {
  return LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS['fr-FR'];
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CONFIGS);
}

export function isLanguageSupported(language: string): boolean {
  return language in LANGUAGE_CONFIGS;
}

// 同义词映射数据
export const SYNONYM_MAPPINGS: Record<string, SynonymMapping> = {
  'fr-FR': {
    // 方位同义词
    'nord': ['n'],
    'sud': ['s'],
    'est': ['e'],
    'ouest': ['o', 'w'],
    'gauche': ['g'],
    'droite': ['d'],
    'devant': ['avant'],
    'derrière': ['arrière'],
    // 数字同义词
    'zéro': ['0'],
    'un': ['1'],
    'deux': ['2'],
    'trois': ['3'],
    'quatre': ['4'],
    'cinq': ['5'],
    'six': ['6'],
    'sept': ['7'],
    'huit': ['8'],
    'neuf': ['9'],
    'dix': ['10'],
  },

  'en-US': {
    // 方位同义词
    'north': ['n'],
    'south': ['s'],
    'east': ['e'],
    'west': ['w'],
    'left': ['l'],
    'right': ['r'],
    'front': ['forward'],
    'back': ['backward', 'behind'],
    'up': ['above'],
    'down': ['below'],
    // 数字同义词
    'zero': ['0'],
    'one': ['1'],
    'two': ['2'],
    'three': ['3'],
    'four': ['4'],
    'five': ['5'],
    'six': ['6'],
    'seven': ['7'],
    'eight': ['8'],
    'nine': ['9'],
    'ten': ['10'],
  },

  'de-DE': {
    // 方位同义词
    'norden': ['n'],
    'süden': ['s'],
    'osten': ['o'],
    'westen': ['w'],
    'links': ['l'],
    'rechts': ['r'],
    'vorne': ['vor'],
    'hinten': ['hinter'],
    // 数字同义词
    'null': ['0'],
    'eins': ['1'],
    'zwei': ['2'],
    'drei': ['3'],
    'vier': ['4'],
    'fünf': ['5'],
    'sechs': ['6'],
    'sieben': ['7'],
    'acht': ['8'],
    'neun': ['9'],
    'zehn': ['10'],
  },

  'es-ES': {
    // 方位同义词
    'norte': ['n'],
    'sur': ['s'],
    'este': ['e'],
    'oeste': ['o'],
    'izquierda': ['izq'],
    'derecha': ['der'],
    'delante': ['adelante'],
    'detrás': ['atrás'],
    // 数字同义词
    'cero': ['0'],
    'uno': ['1'],
    'dos': ['2'],
    'tres': ['3'],
    'cuatro': ['4'],
    'cinco': ['5'],
    'seis': ['6'],
    'siete': ['7'],
    'ocho': ['8'],
    'nueve': ['9'],
    'diez': ['10'],
  },

  'it-IT': {
    // 方位同义词
    'nord': ['n'],
    'sud': ['s'],
    'est': ['e'],
    'ovest': ['o'],
    'sinistra': ['sin'],
    'destra': ['des'],
    'davanti': ['avanti'],
    'dietro': ['indietro'],
    // 数字同义词
    'zero': ['0'],
    'uno': ['1'],
    'due': ['2'],
    'tre': ['3'],
    'quattro': ['4'],
    'cinque': ['5'],
    'sei': ['6'],
    'sette': ['7'],
    'otto': ['8'],
    'nove': ['9'],
    'dieci': ['10'],
  },

  'pt-PT': {
    // 方位同义词
    'norte': ['n'],
    'sul': ['s'],
    'este': ['e'],
    'oeste': ['o'],
    'esquerda': ['esq'],
    'direita': ['dir'],
    'frente': ['à frente'],
    'atrás': ['trás'],
    // 数字同义词
    'zero': ['0'],
    'um': ['1'],
    'dois': ['2'],
    'três': ['3'],
    'quatro': ['4'],
    'cinco': ['5'],
    'seis': ['6'],
    'sete': ['7'],
    'oito': ['8'],
    'nove': ['9'],
    'dez': ['10'],
  },

  'zh-CN': {
    // 方位同义词
    '北': ['n'],
    '南': ['s'],
    '东': ['e'],
    '西': ['w'],
    '左': ['左边'],
    '右': ['右边'],
    '前': ['前面'],
    '后': ['后面', '後'],
    '上': ['上面'],
    '下': ['下面'],
    '里': ['内', '里面'],
    '外': ['外面'],
    // 数字同义词
    '零': ['0'],
    '一': ['1'],
    '二': ['2'],
    '三': ['3'],
    '四': ['4'],
    '五': ['5'],
    '六': ['6'],
    '七': ['7'],
    '八': ['8'],
    '九': ['9'],
    '十': ['10'],
  },

  'ja-JP': {
    // 方位同义词
    '北': ['きた'],
    '南': ['みなみ'],
    '東': ['ひがし'],
    '西': ['にし'],
    '左': ['ひだり'],
    '右': ['みぎ'],
    '前': ['まえ'],
    '後ろ': ['うしろ'],
    '上': ['うえ'],
    '下': ['した'],
    // 数字同义词
    '零': ['0', 'ゼロ'],
    '一': ['1', 'いち'],
    '二': ['2', 'に'],
    '三': ['3', 'さん'],
    '四': ['4', 'よん', 'し'],
    '五': ['5', 'ご'],
    '六': ['6', 'ろく'],
    '七': ['7', 'なな', 'しち'],
    '八': ['8', 'はち'],
    '九': ['9', 'きゅう', 'く'],
    '十': ['10', 'じゅう'],
  },

  'ko-KR': {
    // 方位同义词
    '북': ['북쪽'],
    '남': ['남쪽'],
    '동': ['동쪽'],
    '서': ['서쪽'],
    '왼쪽': ['좌'],
    '오른쪽': ['우'],
    '앞': ['전'],
    '뒤': ['후'],
    '위': ['상'],
    '아래': ['하'],
    // 数字同义词
    '영': ['0'],
    '일': ['1'],
    '이': ['2'],
    '삼': ['3'],
    '사': ['4'],
    '오': ['5'],
    '육': ['6'],
    '칠': ['7'],
    '팔': ['8'],
    '구': ['9'],
    '십': ['10'],
  },

  'ar-SA': {
    // 方位同义词
    'شمال': ['ش'],
    'جنوب': ['ج'],
    'شرق': ['ش'],
    'غرب': ['غ'],
    'يسار': ['ي'],
    'يمين': ['ي'],
    'أمام': ['أ'],
    'خلف': ['خ'],
    'فوق': ['ف'],
    'تحت': ['ت'],
    // 数字同义词
    'صفر': ['0'],
    'واحد': ['1'],
    'اثنان': ['2'],
    'ثلاثة': ['3'],
    'أربعة': ['4'],
    'خمسة': ['5'],
    'ستة': ['6'],
    'سبعة': ['7'],
    'ثمانية': ['8'],
    'تسعة': ['9'],
    'عشرة': ['10'],
  },

  'ru-RU': {
    // 方位同义词
    'север': ['с'],
    'юг': ['ю'],
    'восток': ['в'],
    'запад': ['з'],
    'лево': ['л'],
    'право': ['п'],
    'перед': ['впереди'],
    'зад': ['сзади'],
    'верх': ['вверх'],
    'низ': ['вниз'],
    // 数字同义词
    'ноль': ['0'],
    'один': ['1'],
    'два': ['2'],
    'три': ['3'],
    'четыре': ['4'],
    'пять': ['5'],
    'шесть': ['6'],
    'семь': ['7'],
    'восемь': ['8'],
    'девять': ['9'],
    'десять': ['10'],
  },

  'nl-NL': {
    // 方位同义词
    'noord': ['n'],
    'zuid': ['z'],
    'oost': ['o'],
    'west': ['w'],
    'links': ['l'],
    'rechts': ['r'],
    'voor': ['vooraan'],
    'achter': ['achteraan'],
    'boven': ['omhoog'],
    'onder': ['omlaag'],
    // 数字同义词
    'nul': ['0'],
    'een': ['1'],
    'twee': ['2'],
    'drie': ['3'],
    'vier': ['4'],
    'vijf': ['5'],
    'zes': ['6'],
    'zeven': ['7'],
    'acht': ['8'],
    'negen': ['9'],
    'tien': ['10'],
  },

  'sv-SE': {
    // 方位同义词
    'norr': ['n'],
    'söder': ['s'],
    'öster': ['ö'],
    'väster': ['v'],
    'vänster': ['v'],
    'höger': ['h'],
    'fram': ['framåt'],
    'bak': ['bakåt'],
    'upp': ['uppåt'],
    'ner': ['neråt'],
    // 数字同义词
    'noll': ['0'],
    'ett': ['1'],
    'två': ['2'],
    'tre': ['3'],
    'fyra': ['4'],
    'fem': ['5'],
    'sex': ['6'],
    'sju': ['7'],
    'åtta': ['8'],
    'nio': ['9'],
    'tio': ['10'],
  },

  'no-NO': {
    // 方位同义词
    'nord': ['n'],
    'sør': ['s'],
    'øst': ['ø'],
    'vest': ['v'],
    'venstre': ['v'],
    'høyre': ['h'],
    'foran': ['fremover'],
    'bak': ['bakover'],
    'opp': ['oppover'],
    'ned': ['nedover'],
    // 数字同义词
    'null': ['0'],
    'en': ['1'],
    'to': ['2'],
    'tre': ['3'],
    'fire': ['4'],
    'fem': ['5'],
    'seks': ['6'],
    'syv': ['7'],
    'åtte': ['8'],
    'ni': ['9'],
    'ti': ['10'],
  },
};

// 获取同义词映射
export function getSynonymMapping(language: string): SynonymMapping {
  return SYNONYM_MAPPINGS[language] || SYNONYM_MAPPINGS['fr-FR'];
}
