import React from 'react';

import type { HeaderProps } from '../../types/header';

const Header: React.FC<HeaderProps> = ({
  title = '🛒 Hanghae Online Store',
  subtitle = 'Shopping Cart',
  itemCount,
}) => {
  return (
    <header className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">{title}</h1>
      <div className="text-5xl tracking-tight leading-none">{subtitle}</div>
      <p className="text-sm text-gray-500 font-normal mt-3" aria-live="polite">
        🛍️ {itemCount} items in cart
      </p>
    </header>
  );
};

export default Header;
