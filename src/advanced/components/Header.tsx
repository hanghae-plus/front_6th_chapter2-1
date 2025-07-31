import React from 'react';
import { UI_CONSTANTS } from '../constants';

interface HeaderProps {
  itemCount: number;
}

/**
 * 애플리케이션 헤더 컴포넌트 - basic 버전과 동일한 UI
 */
export const Header: React.FC<HeaderProps> = ({ itemCount }) => {
  const itemText = itemCount === 1 ? UI_CONSTANTS.TEXT.ITEM_SINGULAR : UI_CONSTANTS.TEXT.ITEM_PLURAL;
  
  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        {UI_CONSTANTS.TEXT.STORE_NAME}
      </h1>
      <div className="text-5xl tracking-tight leading-none">{UI_CONSTANTS.TEXT.SHOPPING_CART}</div>
      <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">
        {UI_CONSTANTS.TEXT.CART_ICON} {itemCount} {itemText}{UI_CONSTANTS.TEXT.IN_CART}
      </p>
    </div>
  );
};