import React from 'react';

interface MainGridProps {
  children: React.ReactNode;
}

export function MainGrid({ children }: MainGridProps) {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      {children}
    </main>
  );
}

interface LeftColumnProps {
  children: React.ReactNode;
}

export function LeftColumn({ children }: LeftColumnProps) {
  return (
    <section className="bg-white border border-gray-200 p-8 overflow-y-auto">
      {children}
    </section>
  );
}
