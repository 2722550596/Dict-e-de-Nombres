import React from 'react';

interface FlagIconProps {
  className?: string;
  size?: number;
}

// 法国国旗 SVG
export const FrenchFlag: React.FC<FlagIconProps> = ({ className = '', size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 18" 
    className={className}
    role="img"
    aria-label="French flag"
  >
    <rect width="8" height="18" fill="#002654" />
    <rect x="8" width="8" height="18" fill="#FFFFFF" />
    <rect x="16" width="8" height="18" fill="#CE1126" />
  </svg>
);

// 美国国旗 SVG (简化版)
export const AmericanFlag: React.FC<FlagIconProps> = ({ className = '', size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 18" 
    className={className}
    role="img"
    aria-label="American flag"
  >
    <rect width="24" height="18" fill="#B22234" />
    <rect y="1" width="24" height="1" fill="#FFFFFF" />
    <rect y="3" width="24" height="1" fill="#FFFFFF" />
    <rect y="5" width="24" height="1" fill="#FFFFFF" />
    <rect y="7" width="24" height="1" fill="#FFFFFF" />
    <rect y="9" width="24" height="1" fill="#FFFFFF" />
    <rect y="11" width="24" height="1" fill="#FFFFFF" />
    <rect y="13" width="24" height="1" fill="#FFFFFF" />
    <rect y="15" width="24" height="1" fill="#FFFFFF" />
    <rect y="17" width="24" height="1" fill="#FFFFFF" />
    <rect width="10" height="9" fill="#3C3B6E" />
    {/* 简化的星星 */}
    <circle cx="2" cy="2" r="0.5" fill="#FFFFFF" />
    <circle cx="4" cy="2" r="0.5" fill="#FFFFFF" />
    <circle cx="6" cy="2" r="0.5" fill="#FFFFFF" />
    <circle cx="8" cy="2" r="0.5" fill="#FFFFFF" />
    <circle cx="3" cy="4" r="0.5" fill="#FFFFFF" />
    <circle cx="5" cy="4" r="0.5" fill="#FFFFFF" />
    <circle cx="7" cy="4" r="0.5" fill="#FFFFFF" />
    <circle cx="2" cy="6" r="0.5" fill="#FFFFFF" />
    <circle cx="4" cy="6" r="0.5" fill="#FFFFFF" />
    <circle cx="6" cy="6" r="0.5" fill="#FFFFFF" />
    <circle cx="8" cy="6" r="0.5" fill="#FFFFFF" />
    <circle cx="3" cy="8" r="0.5" fill="#FFFFFF" />
    <circle cx="5" cy="8" r="0.5" fill="#FFFFFF" />
    <circle cx="7" cy="8" r="0.5" fill="#FFFFFF" />
  </svg>
);

// 中国国旗 SVG
export const ChineseFlag: React.FC<FlagIconProps> = ({ className = '', size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 18" 
    className={className}
    role="img"
    aria-label="Chinese flag"
  >
    <rect width="24" height="18" fill="#DE2910" />
    {/* 大五角星 */}
    <polygon 
      points="4,3 4.8,5.4 7.2,5.4 5.4,6.8 6.2,9.2 4,7.8 1.8,9.2 2.6,6.8 0.8,5.4 3.2,5.4" 
      fill="#FFDE00" 
    />
    {/* 小五角星们 */}
    <polygon 
      points="8,2 8.4,2.8 9.2,2.8 8.6,3.2 8.8,4 8,3.6 7.2,4 7.4,3.2 6.8,2.8 7.6,2.8" 
      fill="#FFDE00" 
    />
    <polygon 
      points="9,4 9.4,4.8 10.2,4.8 9.6,5.2 9.8,6 9,5.6 8.2,6 8.4,5.2 7.8,4.8 8.6,4.8" 
      fill="#FFDE00" 
    />
    <polygon 
      points="9,6 9.4,6.8 10.2,6.8 9.6,7.2 9.8,8 9,7.6 8.2,8 8.4,7.2 7.8,6.8 8.6,6.8" 
      fill="#FFDE00" 
    />
    <polygon 
      points="8,8 8.4,8.8 9.2,8.8 8.6,9.2 8.8,10 8,9.6 7.2,10 7.4,9.2 6.8,8.8 7.6,8.8" 
      fill="#FFDE00" 
    />
  </svg>
);
