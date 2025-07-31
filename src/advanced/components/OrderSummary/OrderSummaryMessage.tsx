import React, { memo } from "react";

const OrderSummaryMessage: React.FC = () => (
  <p className="text-2xs mt-4 text-center leading-relaxed text-white/60">
    Free shipping on all orders.
    <br />
    <span id="points-notice">Earn loyalty points with purchase.</span>
  </p>
);

export default memo(OrderSummaryMessage);
