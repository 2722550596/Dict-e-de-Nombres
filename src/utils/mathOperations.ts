import { MathOperator, MathProblem } from '../types/exercise';

// 数字转法语文本的映射
const numberToFrench: { [key: number]: string } = {
  0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
  6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
  11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
  16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt',
  30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante',
  70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix'
};

// 运算符转法语文本
const operatorToFrench: { [key in MathOperator]: string } = {
  '+': 'plus',
  '-': 'moins',
  '×': 'fois',
  '÷': 'divisé par'
};

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

// 多语言数学表达式创建函数
function createMultilingualMathExpression(
  operand1: number,
  operator: MathOperator,
  operand2: number,
  language?: string
): string {
  const speechLang = language || getCurrentDictationLanguage();

  // 对于非法语，使用简化方案：直接传数字给TTS
  if (speechLang !== 'fr-FR') {
    // 运算符翻译映射
    const operatorsByLanguage: Record<string, Record<MathOperator, string>> = {
      'en-US': { '+': 'plus', '-': 'minus', '×': 'times', '÷': 'divided by' },
      'de-DE': { '+': 'plus', '-': 'minus', '×': 'mal', '÷': 'geteilt durch' },
      'es-ES': { '+': 'más', '-': 'menos', '×': 'por', '÷': 'dividido por' },
      'it-IT': { '+': 'più', '-': 'meno', '×': 'per', '÷': 'diviso per' },
      'pt-PT': { '+': 'mais', '-': 'menos', '×': 'vezes', '÷': 'dividido por' },
      'zh-CN': { '+': '加', '-': '减', '×': '乘', '÷': '除以' },
      'ja-JP': { '+': 'たす', '-': 'ひく', '×': 'かける', '÷': 'わる' },
      'ko-KR': { '+': '더하기', '-': '빼기', '×': '곱하기', '÷': '나누기' },
      'ar-SA': { '+': 'زائد', '-': 'ناقص', '×': 'ضرب', '÷': 'قسمة على' },
      'ru-RU': { '+': 'плюс', '-': 'минус', '×': 'умножить на', '÷': 'разделить на' },
      'nl-NL': { '+': 'plus', '-': 'min', '×': 'keer', '÷': 'gedeeld door' },
      'sv-SE': { '+': 'plus', '-': 'minus', '×': 'gånger', '÷': 'delat med' },
      'no-NO': { '+': 'pluss', '-': 'minus', '×': 'ganger', '÷': 'delt på' }
    };

    const operators = operatorsByLanguage[speechLang] || operatorsByLanguage['en-US'];
    const operatorText = operators[operator];
    return `${operand1} ${operatorText} ${operand2}`;
  }

  // 法语使用现有的详细转换
  return `${numberToFrenchText(operand1)} ${operatorToFrench[operator]} ${numberToFrenchText(operand2)}`;
}

export function numberToFrenchText(num: number): string {
  if (num <= 20) {
    return numberToFrench[num] || num.toString();
  }

  if (num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;

    if (ones === 0) {
      return numberToFrench[tens] || num.toString();
    }

    if (tens === 70) {
      return `soixante-${numberToFrench[10 + ones]}`;
    }

    if (tens === 90) {
      return `quatre-vingt-${numberToFrench[10 + ones]}`;
    }

    return `${numberToFrench[tens]}-${numberToFrench[ones]}`;
  }

  // 对于更大的数字，暂时返回数字字符串，让TTS处理
  return num.toString();
}

export function generateAddition(range: [number, number], maxResult: number): MathProblem {
  const [min, max] = range;
  let operand1: number, operand2: number, result: number;

  do {
    operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
    operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
    result = operand1 + operand2;
  } while (result > maxResult);

  const displayText = createMultilingualMathExpression(operand1, '+', operand2);

  return {
    operand1,
    operator: '+',
    operand2,
    result,
    displayText
  };
}

export function generateSubtraction(range: [number, number], maxResult: number): MathProblem {
  const [min, max] = range;
  let operand1: number, operand2: number, result: number;

  do {
    operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
    operand2 = Math.floor(Math.random() * (operand1 - min + 1)) + min;
    result = operand1 - operand2;
  } while (result > maxResult || result < 0);

  const displayText = createMultilingualMathExpression(operand1, '-', operand2);

  return {
    operand1,
    operator: '-',
    operand2,
    result,
    displayText
  };
}

export function generateMultiplication(range: [number, number], maxResult: number): MathProblem {
  const [min, max] = range;
  let operand1: number, operand2: number, result: number;

  do {
    operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
    operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
    result = operand1 * operand2;
  } while (result > maxResult);

  const displayText = createMultilingualMathExpression(operand1, '×', operand2);

  return {
    operand1,
    operator: '×',
    operand2,
    result,
    displayText
  };
}

export function generateDivision(range: [number, number], maxResult: number): MathProblem {
  const [min, max] = range;
  let quotient: number, divisor: number, dividend: number;

  do {
    // 先生成商（结果）
    quotient = Math.floor(Math.random() * maxResult) + 1;
    // 生成除数（避免除以1，至少为2）
    divisor = Math.floor(Math.random() * (max - 2)) + 2;
    // 计算被除数
    dividend = quotient * divisor;
  } while (dividend > max * 2 || dividend < min); // 确保被除数在合理范围内

  const displayText = createMultilingualMathExpression(dividend, '÷', divisor);

  return {
    operand1: dividend,
    operator: '÷',
    operand2: divisor,
    result: quotient,
    displayText
  };
}

export function generateMathProblem(
  operator: MathOperator,
  range: [number, number],
  maxResult: number
): MathProblem {
  switch (operator) {
    case '+':
      return generateAddition(range, maxResult);
    case '-':
      return generateSubtraction(range, maxResult);
    case '×':
      return generateMultiplication(range, maxResult);
    case '÷':
      return generateDivision(range, maxResult);
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

export function generateMathProblems(
  operations: MathOperator[],
  range: [number, number],
  maxResult: number,
  quantity: number
): MathProblem[] {
  const problems: MathProblem[] = [];

  for (let i = 0; i < quantity; i++) {
    // 随机选择一个运算类型
    const randomOperator = operations[Math.floor(Math.random() * operations.length)];
    const problem = generateMathProblem(randomOperator, range, maxResult);
    problems.push(problem);
  }

  return problems;
}
