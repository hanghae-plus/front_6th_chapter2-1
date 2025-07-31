import React, { memo } from "react";

const CheckoutButton: React.FC = () => (
  <button className="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
    Proceed to Checkout
  </button>
);

export default memo(CheckoutButton);
