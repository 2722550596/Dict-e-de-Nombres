/**
 * UI相关类型定义
 * 统一管理界面组件、主题、响应式等UI相关的类型
 */

import { ReactNode } from 'react';

// ==================== 基础UI类型 ====================
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type ButtonSize = 'small' | 'medium' | 'large';
export type InputType = 'text' | 'number' | 'email' | 'password' | 'search';
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

// ==================== 组件通用属性 ====================
export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  'data-testid'?: string;
}

// ==================== 按钮组件属性 ====================
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  fullWidth?: boolean;
}

// ==================== 输入框组件属性 ====================
export interface InputProps extends BaseComponentProps {
  type?: InputType;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// ==================== 模态框组件属性 ====================
export interface ModalProps extends BaseComponentProps {
  show: boolean;
  size?: ModalSize;
  centered?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  fade?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onClose?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
}

// ==================== 下拉选择组件属性 ====================
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
}

// ==================== 进度条组件属性 ====================
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  min?: number;
  variant?: ButtonVariant;
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

// ==================== 提示框组件属性 ====================
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  arrow?: boolean;
}

// ==================== 标签页组件属性 ====================
export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  onTabClose?: (key: string) => void;
  type?: 'line' | 'card' | 'editable-card';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// ==================== 主题相关类型 ====================
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  borderRadius: string;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// ==================== 响应式类型 ====================
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// ==================== 布局类型 ====================
export interface GridProps extends BaseComponentProps {
  container?: boolean;
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

// ==================== 动画类型 ====================
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'shake';

// ==================== 表单类型 ====================
export interface FormField {
  name: string;
  label: string;
  type: InputType;
  required?: boolean;
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

// ==================== 通知类型 ====================
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

// ==================== 加载状态类型 ====================
export interface LoadingState {
  loading: boolean;
  error?: string | null;
  data?: any;
}

// ==================== 分页类型 ====================
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

// ==================== 类型守卫 ====================
export const isButtonVariant = (value: string): value is ButtonVariant => {
  const variants: ButtonVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  return variants.includes(value as ButtonVariant);
};

export const isModalSize = (value: string): value is ModalSize => {
  const sizes: ModalSize[] = ['small', 'medium', 'large', 'fullscreen'];
  return sizes.includes(value as ModalSize);
};

// ==================== 工具类型 ====================
export type ComponentWithChildren<P = {}> = React.FC<P & { children?: ReactNode }>;
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// ==================== 默认值 ====================
export const createDefaultTheme = (): Theme => ({
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    light: '#f8fafc',
    dark: '#1e293b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#cbd5e1',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
  borderRadius: '0.375rem',
  fontFamily: "'Inter', sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
});
