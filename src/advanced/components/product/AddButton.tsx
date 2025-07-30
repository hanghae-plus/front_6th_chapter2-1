import { ReactElement } from 'react';

export default function AddButton(): ReactElement {
  return (
    <button className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
      Add to Cart
    </button>
  );
}
