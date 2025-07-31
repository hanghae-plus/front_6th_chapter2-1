import { forwardRef, type ReactNode, type ChangeEvent } from 'react';

interface ProductSelectProps {
  children: ReactNode;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const ProductSelect = forwardRef<HTMLSelectElement, ProductSelectProps>(
  ({ children, onChange }, ref) => {
    return (
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        ref={ref}
        onChange={onChange}
      >
        {children}
      </select>
    );
  }
);

ProductSelect.displayName = 'ProductSelect';

export default ProductSelect;