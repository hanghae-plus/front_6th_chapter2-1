import React from 'react';

export interface HeaderPropsType {
  className?: string;
}

const Header: React.FC<HeaderPropsType> = ({ className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p className="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  );
};

export default Header;
