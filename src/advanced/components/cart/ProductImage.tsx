import React from 'react';

export default function ProductImage() {
  return (
    <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  );
}
