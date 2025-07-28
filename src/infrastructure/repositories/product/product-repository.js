import Product from "../../../core/domain/entities/product";

class ProductRepository {
  async findAll() {
    throw new Error("Not implemented");
  }

  mapToProductDomain(product) {
    return new Product({
      id: product.id,
      name: product.name,
      price: product.val,
      originalVal: product.originalVal,
      quantity: product.q,
      onSale: product.onSale,
      suggestSale: product.suggestSale,
    });
  }
}

export default ProductRepository;
