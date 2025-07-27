import ProductSelector from "../components/ProductSelector.js";

export const renderProductSelector = ({
  products,
  containerElement,
  stockThreshold,
}) => {
  const selectElement = containerElement;
  const currentValue = selectElement.value;

  selectElement.innerHTML = ProductSelector({ products });

  if (currentValue) selectElement.value = currentValue;

  const totalStock = products.reduce((sum, p) => sum + p.q, 0);
  const isLowStock = totalStock < stockThreshold;
  selectElement.style.borderColor = isLowStock ? "orange" : "";

  return { totalStock, isLowStock };
};
