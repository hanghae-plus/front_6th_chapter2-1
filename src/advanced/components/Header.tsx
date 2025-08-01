import { type PropsWithChildren } from 'react';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      {children}
    </div>
  );
};

export default Header;
