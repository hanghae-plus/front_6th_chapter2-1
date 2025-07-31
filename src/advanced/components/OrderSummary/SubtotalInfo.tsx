import React, { memo } from "react";

interface SubtotalInfoProps {
  subtotal: number;
}

const SubtotalInfo: React.FC<SubtotalInfoProps> = ({ subtotal }) => (
  <div className="flex justify-between text-sm tracking-wide">
    <span>Subtotal</span>
    <span>₩{subtotal.toLocaleString()}</span>
  </div>
);

export default memo(SubtotalInfo);
