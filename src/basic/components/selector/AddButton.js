export const AddButton = ({ onClick, getItemToAdd }) => {
  const addButton = document.createElement("button");
  addButton.id = "add-to-cart";
  addButton.innerHTML = "Add to Cart";
  addButton.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

  addButton.addEventListener("click", () =>
    onClick({ itemToAdd: getItemToAdd() })
  );
  return addButton;
};
