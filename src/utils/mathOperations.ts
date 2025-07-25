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
  
  const displayText = `${numberToFrenchText(operand1)} plus ${numberToFrenchText(operand2)}`;
  
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
  
  const displayText = `${numberToFrenchText(operand1)} moins ${numberToFrenchText(operand2)}`;
  
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
  
  const displayText = `${numberToFrenchText(operand1)} fois ${numberToFrenchText(operand2)}`;
  
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
  
  const displayText = `${numberToFrenchText(dividend)} divisé par ${numberToFrenchText(divisor)}`;
  
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
