import React from 'react';

interface LayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const Layout = ({ leftContent, rightContent }: LayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
        {leftContent}
      </div>
      <div className="bg-black text-white p-8 flex flex-col">
        {rightContent}
      </div>
    </div>
  );
};

export default Layout;
