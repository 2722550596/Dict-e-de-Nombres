import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './DifficultySelector.css';

interface DifficultyOption {
  key: string;
  label: string;
  category: string;
  recommended?: boolean;
}

interface DifficultySelectorProps {
  value: string;
  onChange: (value: string) => void;
  recommendedRange?: string;
  enhancedRecommendation?: any; // 8.2新增：增强推荐信息
  currentMode?: 'number' | 'time' | 'direction' | 'length'; // 8.2新增：当前模式
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  recommendedRange,
  enhancedRecommendation,
  currentMode = 'number'
}) => {
  const { translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 定义所有难度选项
  const allOptions: DifficultyOption[] = [
    // 基础范围
    { key: '0-9', label: translations.difficulties['0-9'], category: 'basic' },
    { key: '0-16', label: translations.difficulties['0-16'], category: 'basic' },
    { key: '0-20', label: translations.difficulties['0-20'], category: 'basic' },
    { key: '0-30', label: translations.difficulties['0-30'], category: 'basic' },

    // 中级范围
    { key: '0-50', label: translations.difficulties['0-50'], category: 'intermediate' },
    { key: '0-69', label: translations.difficulties['0-69'], category: 'intermediate' },
    { key: '20-69', label: translations.difficulties['20-69'], category: 'intermediate' },
    { key: '50-99', label: translations.difficulties['50-99'], category: 'intermediate' },
    
    // 困难范围 (法语特殊规则)
    { key: '70-79', label: translations.difficulties['70-79'], category: 'difficult' },
    { key: '80-89', label: translations.difficulties['80-89'], category: 'difficult' },
    { key: '90-99', label: translations.difficulties['90-99'], category: 'difficult' },
    { key: '70-99', label: translations.difficulties['70-99'], category: 'difficult' },

    // 综合范围
    { key: '0-99', label: translations.difficulties['0-99'], category: 'comprehensive' },
    { key: '0-100', label: translations.difficulties['0-100'], category: 'comprehensive' },
    
    // 百位数
    { key: '100-199', label: translations.difficulties['100-199'], category: 'hundreds' },
    { key: '100-299', label: translations.difficulties['100-299'], category: 'hundreds' },
    { key: '100-500', label: translations.difficulties['100-500'], category: 'hundreds' },
    { key: '100-999', label: translations.difficulties['100-999'], category: 'hundreds' },
    { key: '200-999', label: translations.difficulties['200-999'], category: 'hundreds' },

    // 千位数
    { key: '1000-1999', label: translations.difficulties['1000-1999'], category: 'thousands' },
    { key: '1000-9999', label: translations.difficulties['1000-9999'], category: 'thousands' },
    
    // 特殊范围
    { key: '1700-2050', label: translations.difficulties['1700-2050'], category: 'special' },
    { key: 'tens', label: translations.difficulties.tens, category: 'special' },
    { key: 'custom', label: translations.difficulties.custom, category: 'special' }
  ];

  // 获取增强推荐的难度建议
  const getEnhancedRecommendedDifficulties = (): string[] => {
    if (!enhancedRecommendation || !currentMode) return [];

    const currentModeRec = enhancedRecommendation.difficultyRecommendations?.find(
      (rec: any) => rec.mode === currentMode
    );

    if (!currentModeRec) return [];

    // 根据推荐难度映射到具体的选项键
    const difficultyMapping: { [key: string]: string[] } = {
      'beginner': ['0-9', '0-16', '0-20'],
      'intermediate': ['0-30', '0-50', '20-69'],
      'advanced': ['50-99', '70-99', '0-99'],
      'expert': ['100-199', '100-999', '1000-9999']
    };

    return difficultyMapping[currentModeRec.currentLevel] || [];
  };

  // 添加推荐标记
  const enhancedRecommendedKeys = getEnhancedRecommendedDifficulties();
  const options = allOptions.map(option => ({
    ...option,
    recommended: option.key === recommendedRange || enhancedRecommendedKeys.includes(option.key)
  }));

  // 按类别分组
  const categories = {
    basic: { name: translations.difficultySelector.categories.basic, icon: '🟢' },
    intermediate: { name: translations.difficultySelector.categories.intermediate, icon: '🟡' },
    difficult: { name: translations.difficultySelector.categories.difficult, icon: '🔴' },
    comprehensive: { name: translations.difficultySelector.categories.comprehensive, icon: '🔵' },
    hundreds: { name: translations.difficultySelector.categories.hundreds, icon: '💯' },
    thousands: { name: translations.difficultySelector.categories.thousands, icon: '🔢' },
    special: { name: translations.difficultySelector.categories.special, icon: '⚙️' }
  };

  // 过滤选项
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 按类别分组过滤后的选项
  const groupedOptions = Object.entries(categories).reduce((acc, [categoryKey, categoryInfo]) => {
    const categoryOptions = filteredOptions.filter(option => option.category === categoryKey);
    if (categoryOptions.length > 0) {
      acc[categoryKey] = { ...categoryInfo, options: categoryOptions };
    }
    return acc;
  }, {} as Record<string, any>);

  // 获取当前选中选项的显示文本
  const selectedOption = options.find(option => option.key === value);
  const displayText = selectedOption 
    ? `${selectedOption.label}${selectedOption.recommended ? ' ⭐' : ''}`
    : value;

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 打开时聚焦搜索框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionKey: string) => {
    onChange(optionKey);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="difficulty-selector" ref={dropdownRef}>
      <button
        type="button"
        className={`difficulty-selector-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-text">{displayText}</span>
        <span className={`dropdown-arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
      </button>

      {isOpen && (
        <div className="difficulty-dropdown">
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={translations.difficultySelector.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="options-container">
            {Object.entries(groupedOptions).map(([categoryKey, categoryData]) => (
              <div key={categoryKey} className="option-category">
                <div className="category-header">
                  <span className="category-icon">{categoryData.icon}</span>
                  <span className="category-name">{categoryData.name}</span>
                </div>
                <div className="category-options">
                  {categoryData.options.map((option: DifficultyOption) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`option-item ${option.key === value ? 'selected' : ''} ${option.recommended ? 'recommended' : ''}`}
                      onClick={() => handleSelect(option.key)}
                    >
                      <span className="option-label">{option.label}</span>
                      {option.recommended && <span className="recommend-star">⭐</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultySelector;
