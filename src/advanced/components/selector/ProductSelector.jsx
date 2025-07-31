export const ProductSelector = ({ isLowStock }) => {
  return (
    <select
      id="product-select"
      className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      style={{
        borderColor: isLowStock ? "orange" : "",
      }}
    ></select>
  );
};
