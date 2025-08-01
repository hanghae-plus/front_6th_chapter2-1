import React from 'react';

interface ProductPanelProps {
  children: React.ReactNode;
}

export function ProductPanel({ children }: ProductPanelProps) {
  return <div className="mb-6 pb-6 border-b border-gray-200">{children}</div>;
}
