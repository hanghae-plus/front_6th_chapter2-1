import React from 'react';
import { DISCOUNT_ICONS, CSS_CLASSES } from '../../constants';

interface DiscountIconProps {
  discountType:
    | 'flash_sale'
    | 'recommendation'
    | 'super_sale'
    | 'bulk'
    | 'tuesday';
  className?: string;
}

const DiscountIcon: React.FC<DiscountIconProps> = ({
  discountType,
  className = '',
}) => {
  const getIconAndClass = () => {
    switch (discountType) {
      case 'flash_sale':
        return {
          icon: DISCOUNT_ICONS.FLASH_SALE,
          className: CSS_CLASSES.RED_BOLD,
        };
      case 'recommendation':
        return {
          icon: DISCOUNT_ICONS.RECOMMENDATION,
          className: CSS_CLASSES.BLUE_BOLD,
        };
      case 'super_sale':
        return {
          icon: DISCOUNT_ICONS.SUPER_SALE,
          className: CSS_CLASSES.PURPLE_BOLD,
        };
      case 'bulk':
        return {
          icon: '📦',
          className: 'text-green-600 font-bold',
        };
      case 'tuesday':
        return {
          icon: '🗓️',
          className: 'text-orange-600 font-bold',
        };
      default:
        return {
          icon: '',
          className: '',
        };
    }
  };

  const { icon, iconClassName } = getIconAndClass();

  if (!icon) return null;

  return (
    <span
      className={`${iconClassName} ${className}`}
      title={getDiscountTitle(discountType)}
    >
      {icon}
    </span>
  );
};

// 할인 타입별 제목 반환
const getDiscountTitle = (discountType: string): string => {
  switch (discountType) {
    case 'flash_sale':
      return '⚡ 번개세일 - 20% 할인';
    case 'recommendation':
      return '💝 추천할인 - 5% 할인';
    case 'super_sale':
      return '🔥 SUPER SALE - 25% 할인';
    case 'bulk':
      return '📦 전체 수량 할인 - 25% 할인';
    case 'tuesday':
      return '🗓️ 화요일 할인 - 10% 할인';
    default:
      return '';
  }
};

export default DiscountIcon;
