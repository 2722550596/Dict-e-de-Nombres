# 设计文档

## 概述

本设计文档描述了为数字听写应用添加三种新听写模式（时间听写、方位听写、长度听写）的技术实现方案。设计遵循现有架构模式，确保新功能与现有系统的无缝集成。

## 架构

### 整体架构原则

1. **模式扩展性**：扩展现有的 `GameMode` 类型，从 `'number' | 'math'` 扩展为 `'number' | 'math' | 'time' | 'direction' | 'length'`
2. **组件复用**：复用现有的核心组件（AudioControls、GameHUD、RewardModal等），创建专门的练习页面组件
3. **数据一致性**：保持与现有数据结构的兼容性，扩展相关接口以支持新模式
4. **国际化支持**：为新模式添加完整的多语言支持

### 模式特化设计

- **时间听写**：使用长文本输入界面，支持批量提交
- **方位听写**：使用按钮选择界面，支持即时反馈
- **长度听写**：使用长文本输入界面，支持批量提交

## 组件和接口

### 1. 类型系统扩展

#### 核心类型更新
```typescript
// 扩展游戏模式
export type GameMode = 'number' | 'math' | 'time' | 'direction' | 'length';

// 新增时间相关类型
export interface TimeContent {
  type: 'year' | 'month' | 'day' | 'weekday' | 'fullDate';
  value: string;
  displayText: string;
  acceptedAnswers: string[]; // 支持多种正确答案格式
}

// 新增方位相关类型
export interface DirectionContent {
  type: 'cardinal' | 'relative' | 'spatial'; // 基本方位、相对方位、空间方位
  value: string;
  displayText: string;
  buttonPosition: { x: number; y: number }; // 按钮在界面中的位置
}

// 新增长度相关类型
export interface LengthContent {
  value: number;
  unit: string;
  displayText: string;
  acceptedFormats: string[]; // 支持的输入格式
}

// 扩展练习设置
export interface ExerciseSettings {
  mode: GameMode;
  difficulty: string;
  range: [number, number];
  quantity: number;
  speed: 'slow' | 'normal' | 'fast';
  interval: number;
  
  // 运算模式专用
  operations?: MathOperator[];
  maxResult?: number;
  
  // 时间模式专用
  timeTypes?: ('year' | 'month' | 'day' | 'weekday' | 'fullDate')[];
  
  // 方位模式专用
  directionTypes?: ('cardinal' | 'relative' | 'spatial')[];
  
  // 长度模式专用
  lengthUnits?: string[];
  lengthRange?: [number, number];
}
```

### 2. 新增组件设计

#### TimeDictationPanel 组件
```typescript
interface TimeDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}
```
- 使用长文本输入框布局
- 支持多种时间格式验证
- 批量提交和判断逻辑

#### DirectionDictationPanel 组件
```typescript
interface DirectionDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}
```
- 使用可视化按钮布局
- 即时反馈机制
- 自动播放下一题

#### LengthDictationPanel 组件
```typescript
interface LengthDictationPanelProps {
  settings: ExerciseSettings;
  onReset: () => void;
}
```
- 复用时间听写的长文本布局
- 支持单位换算提示
- 批量提交和判断逻辑

#### LongTextPracticeGrid 组件
```typescript
interface LongTextPracticeGridProps {
  items: (TimeContent | LengthContent)[];
  userAnswers: string[];
  isSubmitted: boolean;
  currentPlayingIndex: number;
  onInputChange: (index: number, value: string) => void;
  onKeyDown: (e: KeyboardEvent, index: number) => void;
}
```
- 专门用于时间和长度听写的长文本输入网格
- 自适应输入框宽度
- 优化的键盘导航

#### DirectionButtonGrid 组件
```typescript
interface DirectionButtonGridProps {
  availableDirections: DirectionContent[];
  currentQuestion: DirectionContent | null;
  onDirectionSelect: (direction: string) => void;
  feedbackState: 'none' | 'correct' | 'incorrect';
}
```
- 可视化方位按钮布局
- 即时反馈显示
- 响应式设计适配不同屏幕

### 3. 数据生成器

#### 时间内容生成器
```typescript
export function generateTimeContent(
  types: ('year' | 'month' | 'day' | 'weekday' | 'fullDate')[],
  quantity: number,
  language: string
): TimeContent[]
```

#### 方位内容生成器
```typescript
export function generateDirectionContent(
  types: ('cardinal' | 'relative' | 'spatial')[],
  quantity: number,
  language: string
): DirectionContent[]
```

#### 长度内容生成器
```typescript
export function generateLengthContent(
  units: string[],
  range: [number, number],
  quantity: number,
  language: string
): LengthContent[]
```

## 数据模型

### 1. 配置扩展

#### 游戏配置更新
```typescript
// 在 game.config.ts 中添加新模式配置
export const NEW_MODE_CONFIGS = {
  time: {
    name: '时间听写',
    experienceMultiplier: 1.3,
    difficulty: 'medium'
  },
  direction: {
    name: '方位听写',
    experienceMultiplier: 1.1,
    difficulty: 'easy'
  },
  length: {
    name: '长度听写',
    experienceMultiplier: 1.4,
    difficulty: 'medium'
  }
} as const;
```

#### 难度选项扩展
```typescript
export const TIME_DIFFICULTIES = {
  'years-only': '仅年份',
  'months-only': '仅月份',
  'days-only': '仅日期',
  'weekdays-only': '仅星期',
  'full-dates': '完整日期',
  'mixed-time': '混合时间'
} as const;

export const DIRECTION_DIFFICULTIES = {
  'cardinal-only': '基本方位',
  'relative-only': '相对方位',
  'spatial-only': '空间方位',
  'mixed-directions': '混合方位'
} as const;

export const LENGTH_DIFFICULTIES = {
  'basic-units': '基础单位',
  'metric-system': '公制单位',
  'mixed-units': '混合单位',
  'complex-measurements': '复合度量'
} as const;
```

### 2. 本地存储扩展

#### 用户数据结构更新
```typescript
export interface UserData {
  // 现有字段...
  
  // 新增模式统计
  timeDictationStats: {
    totalSessions: number;
    totalCorrect: number;
    bestAccuracy: number;
    favoriteTimeType: string;
  };
  
  directionDictationStats: {
    totalSessions: number;
    totalCorrect: number;
    bestAccuracy: number;
    favoriteDirectionType: string;
  };
  
  lengthDictationStats: {
    totalSessions: number;
    totalCorrect: number;
    bestAccuracy: number;
    favoriteUnit: string;
  };
}
```

## 错误处理

### 1. 输入验证

#### 时间听写验证
- 支持多种日期格式（2024年1月15日、2024-01-15、一月十五日等）
- 年份范围验证（1900-2100）
- 月份和日期有效性检查
- 星期名称的多语言支持

#### 方位听写验证
- 按钮点击的即时验证
- 复合方位的正确性检查
- 语言特定的方位词汇验证

#### 长度听写验证
- 数值和单位的分离验证
- 单位换算的容错处理
- 小数点格式的多样性支持

### 2. 语音合成错误处理

#### 新模式语音支持
- 时间表达的自然语音合成
- 方位词汇的清晰发音
- 长度单位的标准读音
- 语音合成失败的降级处理

### 3. 用户体验错误处理

#### 界面响应性
- 长文本输入的性能优化
- 按钮布局的响应式适配
- 网络延迟的用户反馈
- 数据保存失败的重试机制

## 测试策略

### 1. 单元测试

#### 数据生成器测试
- 时间内容生成的正确性
- 方位内容的完整性
- 长度内容的有效性
- 多语言支持的一致性

#### 验证逻辑测试
- 多格式答案的正确识别
- 边界情况的处理
- 错误输入的容错性
- 性能基准测试

### 2. 集成测试

#### 组件交互测试
- 模式切换的状态管理
- 音频播放的同步性
- 用户输入的响应性
- 数据持久化的可靠性

#### 跨浏览器测试
- 语音合成的兼容性
- 界面布局的一致性
- 性能表现的稳定性
- 移动端适配的完整性

### 3. 用户体验测试

#### 可用性测试
- 新用户的学习曲线
- 界面操作的直观性
- 反馈机制的有效性
- 多语言切换的流畅性

## 性能考虑

### 1. 内存优化

#### 数据结构优化
- 时间内容的缓存策略
- 方位按钮的懒加载
- 长度单位的预计算
- 用户答案的增量存储

### 2. 渲染优化

#### 组件性能
- 长文本输入的虚拟化
- 按钮网格的批量更新
- 音频播放的异步处理
- 状态更新的防抖处理

### 3. 网络优化

#### 资源加载
- 语音文件的预加载
- 图标资源的压缩
- 字体文件的子集化
- 静态资源的CDN分发

## 国际化支持

### 1. 翻译扩展

#### 新增翻译键
```typescript
export interface Translations {
  // 现有翻译...
  
  modes: {
    numberDictation: string;
    mathDictation: string;
    timeDictation: string;      // 新增
    directionDictation: string; // 新增
    lengthDictation: string;    // 新增
  };
  
  timeTypes: {
    year: string;
    month: string;
    day: string;
    weekday: string;
    fullDate: string;
  };
  
  directionTypes: {
    cardinal: string;
    relative: string;
    spatial: string;
  };
  
  lengthUnits: {
    meter: string;
    centimeter: string;
    millimeter: string;
    kilometer: string;
  };
}
```

### 2. 语言特定处理

#### 时间表达差异
- 中文：2024年1月15日
- 英文：January 15, 2024
- 法文：15 janvier 2024
...其他共14种语言的听写

#### 方位词汇差异
- 不同语言的方位词汇数量
- 文化特定的方位概念
- 复合方位的表达方式

#### 长度单位差异
- 公制与英制单位
- 地区特定的度量习惯
- 单位缩写的标准化
