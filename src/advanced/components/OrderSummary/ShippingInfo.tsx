import React, { memo } from "react";

const ShippingInfo: React.FC = () => (
  <div className="flex justify-between text-sm tracking-wide text-gray-400">
    <span>Shipping</span>
    <span>Free</span>
  </div>
);

export default memo(ShippingInfo);
