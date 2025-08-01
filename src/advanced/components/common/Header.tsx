import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = '🛒 Advanced React + TypeScript',
  subtitle = '장바구니 시스템 - React + TypeScript 버전',
}) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </header>
  );
};

export default Header;
