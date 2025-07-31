import React from 'react';

interface SelectProps {
  id: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export default function Select({
  id,
  className = '',
  value,
  onChange,
  children,
}: SelectProps) {
  return (
    <select id={id} className={className} value={value} onChange={onChange}>
      {children}
    </select>
  );
}
