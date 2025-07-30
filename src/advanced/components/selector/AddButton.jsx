export const AddButton = ({ onClick, getItemToAdd }) => {
  return (
    <button
      onClick={() => onClick({ itemToAdd: getItemToAdd() })}
      id="add-to-cart"
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  );
};
