import productManager from '../domain/product';
import { renderProductSelect } from '../view/productSelector';

export const handleUpdateProductSelectOptions = () => {
  const options = productManager.getProductOptions();
  const isLowTotalStock = productManager.isLowTotalStock();

  renderProductSelect({ options, isLowTotalStock });
};
