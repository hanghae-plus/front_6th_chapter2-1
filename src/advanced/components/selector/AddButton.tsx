interface Props {
  onClick: () => void;
}

export const AddButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      id="add-to-cart"
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  );
};
