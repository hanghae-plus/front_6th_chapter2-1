export function createDropdownOption(product) {
  const opt = document.createElement("option");
  opt.value = product.id;
  let label = `${product.name} - ${product.salePrice.toLocaleString()}원`;
  if (!product.hasStock()) {
    label += " (품절)";
    opt.disabled = true;
    opt.className = "text-gray-400";
  }
  opt.textContent = label;
  return opt;
}
