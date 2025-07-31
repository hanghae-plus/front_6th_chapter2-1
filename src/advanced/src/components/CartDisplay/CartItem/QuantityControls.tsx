interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (change: number) => void;
}

export default function QuantityControls({ quantity, onQuantityChange }: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
        onClick={() => onQuantityChange(-1)}
      >
        −
      </button>
      <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
        {quantity}
      </span>
      <button
        className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
        onClick={() => onQuantityChange(1)}
      >
        +
      </button>
    </div>
  );
}