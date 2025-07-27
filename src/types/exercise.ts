/**
 * 练习相关类型定义
 * 重新导出游戏类型中的练习相关类型，保持向后兼容
 */

// 重新导出核心类型
export type { Exercise, GameMode as ExerciseMode, ExerciseSettings, MathOperator, MathProblem } from './game.types';

// 向后兼容的类型别名
import type { MathOperator, MathProblem } from './game.types';

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

export type LegacyExercise = NumberExercise | MathExercise;

export interface ExerciseSettings {
  mode: ExerciseMode;
  range: [number, number];
  quantity: number;
  // 运算听写特有设置
  maxResult?: number;
  operations?: MathOperator[];
}
