export type ExerciseMode = 'number' | 'math';

export type MathOperator = '+' | '-' | '×' | '÷';

export interface MathProblem {
  operand1: number;
  operator: MathOperator;
  operand2: number;
  result: number;
  displayText: string; // 用于TTS的文本，如 "cinq plus trois"
}

export interface NumberExercise {
  mode: 'number';
  numbers: number[];
  settings: {
    range: [number, number];
    quantity: number;
  };
}

export interface MathExercise {
  mode: 'math';
  problems: MathProblem[];
  settings: {
    range: [number, number];
    quantity: number;
    maxResult: number;
    operations: MathOperator[];
  };
}

export type Exercise = NumberExercise | MathExercise;

export interface ExerciseSettings {
  mode: ExerciseMode;
  range: [number, number];
  quantity: number;
  // 运算听写特有设置
  maxResult?: number;
  operations?: MathOperator[];
}
