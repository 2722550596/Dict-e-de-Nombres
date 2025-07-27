/**
 * 格式化工具
 * 提供统一的数据格式化、文本处理和显示工具
 */

import { CONFIG } from '../../../config';

// 格式化选项接口
export interface FormatOptions {
  locale?: string;
  precision?: number;
  currency?: string;
  dateFormat?: 'short' | 'medium' | 'long' | 'full';
  timeFormat?: '12h' | '24h';
}

/**
 * 数字格式化工具
 */
export const numberFormatter = {
  /**
   * 格式化数字为本地化字符串
   */
  format(value: number, options: FormatOptions = {}): string {
    const { locale = 'fr-FR', precision } = options;
    
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
    } catch {
      return value.toString();
    }
  },

  /**
   * 格式化百分比
   */
  formatPercentage(value: number, options: FormatOptions = {}): string {
    const { locale = 'fr-FR', precision = 1 } = options;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
    } catch {
      return `${(value * 100).toFixed(precision)}%`;
    }
  },

  /**
   * 格式化货币
   */
  formatCurrency(value: number, options: FormatOptions = {}): string {
    const { locale = 'fr-FR', currency = 'EUR' } = options;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value);
    } catch {
      return `${value} ${currency}`;
    }
  },

  /**
   * 格式化大数字（K, M, B）
   */
  formatLargeNumber(value: number): string {
    if (value < 1000) return value.toString();
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`;
    return `${(value / 1000000000).toFixed(1)}B`;
  },

  /**
   * 格式化序数（1st, 2nd, 3rd, etc.）
   */
  formatOrdinal(value: number, locale: string = 'fr'): string {
    if (locale === 'fr') {
      return value === 1 ? `${value}er` : `${value}e`;
    }
    
    // 英语序数
    const suffix = ['th', 'st', 'nd', 'rd'];
    const v = value % 100;
    return value + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  },
};

/**
 * 时间格式化工具
 */
export const timeFormatter = {
  /**
   * 格式化日期
   */
  formatDate(date: Date | string, options: FormatOptions = {}): string {
    const { locale = 'fr-FR', dateFormat = 'medium' } = options;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    try {
      const formatOptions: Intl.DateTimeFormatOptions = {};
      
      switch (dateFormat) {
        case 'short':
          formatOptions.dateStyle = 'short';
          break;
        case 'medium':
          formatOptions.dateStyle = 'medium';
          break;
        case 'long':
          formatOptions.dateStyle = 'long';
          break;
        case 'full':
          formatOptions.dateStyle = 'full';
          break;
      }

      return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
    } catch {
      return dateObj.toLocaleDateString();
    }
  },

  /**
   * 格式化时间
   */
  formatTime(date: Date | string, options: FormatOptions = {}): string {
    const { locale = 'fr-FR', timeFormat = '24h' } = options;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }

    try {
      return new Intl.DateTimeFormat(locale, {
        timeStyle: 'short',
        hour12: timeFormat === '12h',
      }).format(dateObj);
    } catch {
      return dateObj.toLocaleTimeString();
    }
  },

  /**
   * 格式化持续时间（秒转为可读格式）
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m`;
  },

  /**
   * 格式化相对时间（多久之前）
   */
  formatRelativeTime(date: Date | string, locale: string = 'fr'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (locale === 'fr') {
      if (diffSeconds < 60) return 'à l\'instant';
      if (diffMinutes < 60) return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      return this.formatDate(dateObj, { locale: 'fr-FR' });
    }

    // 英语版本
    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return this.formatDate(dateObj, { locale: 'en-US' });
  },
};

/**
 * 文本格式化工具
 */
export const textFormatter = {
  /**
   * 首字母大写
   */
  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * 标题格式（每个单词首字母大写）
   */
  titleCase(text: string): string {
    if (!text) return '';
    return text.split(' ').map(word => this.capitalize(word)).join(' ');
  },

  /**
   * 截断文本
   */
  truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  },

  /**
   * 移除HTML标签
   */
  stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  },

  /**
   * 转义HTML字符
   */
  escapeHtml(text: string): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * 生成随机ID
   */
  generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * 格式化电话号码
   */
  formatPhoneNumber(phone: string, format: 'international' | 'national' = 'national'): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (format === 'international' && cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }
    
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }
    
    return phone;
  },
};

/**
 * 游戏特定格式化工具
 */
export const gameFormatter = {
  /**
   * 格式化等级显示
   */
  formatLevel(level: number, locale: string = 'fr'): string {
    if (locale === 'fr') {
      return `Niveau ${level}`;
    }
    return `Level ${level}`;
  },

  /**
   * 格式化经验值
   */
  formatExperience(current: number, total: number): string {
    return `${numberFormatter.formatLargeNumber(current)}/${numberFormatter.formatLargeNumber(total)}`;
  },

  /**
   * 格式化准确率
   */
  formatAccuracy(correct: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (correct / total) * 100;
    return `${Math.round(percentage)}%`;
  },

  /**
   * 格式化连击数
   */
  formatStreak(streak: number, locale: string = 'fr'): string {
    if (locale === 'fr') {
      return `${streak} en série`;
    }
    return `${streak} streak`;
  },

  /**
   * 格式化游戏时间
   */
  formatGameTime(seconds: number): string {
    return timeFormatter.formatDuration(seconds);
  },

  /**
   * 格式化分数
   */
  formatScore(score: number): string {
    return numberFormatter.formatLargeNumber(score);
  },

  /**
   * 格式化排名
   */
  formatRank(rank: number, locale: string = 'fr'): string {
    const ordinal = numberFormatter.formatOrdinal(rank, locale);
    if (locale === 'fr') {
      return `${ordinal} place`;
    }
    return `${ordinal} place`;
  },
};

/**
 * 便捷的格式化函数
 */
export const format = {
  number: numberFormatter.format,
  percentage: numberFormatter.formatPercentage,
  currency: numberFormatter.formatCurrency,
  date: timeFormatter.formatDate,
  time: timeFormatter.formatTime,
  duration: timeFormatter.formatDuration,
  relativeTime: timeFormatter.formatRelativeTime,
  capitalize: textFormatter.capitalize,
  titleCase: textFormatter.titleCase,
  truncate: textFormatter.truncate,
  fileSize: textFormatter.formatFileSize,
  level: gameFormatter.formatLevel,
  experience: gameFormatter.formatExperience,
  accuracy: gameFormatter.formatAccuracy,
  streak: gameFormatter.formatStreak,
  score: gameFormatter.formatScore,
};

export default format;
