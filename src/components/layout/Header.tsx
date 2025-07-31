import React from 'react';
import { HeaderProps } from '../../types';

export const Header: React.FC<HeaderProps> = ({ itemCount }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛒 개발자 쇼핑몰</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">장바구니</span>
          <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {itemCount}
          </div>
        </div>
      </div>
    </header>
  );
};
