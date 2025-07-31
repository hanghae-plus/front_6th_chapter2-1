import { PRODUCT_LIST } from '@/advanced/data/product.data';
import { Product, ProductData } from '@/advanced/types/product.type';

export default async function getProducts(): Promise<Product[]> {
  return Promise.resolve(formatProductData(PRODUCT_LIST));
}

function formatProductData(productData: ProductData[]): Product[] {
  return productData.map(product => ({
    id: product.id,
    name: product.name,
    price: product.val,
    originalPrice: product.originalVal,
    stock: product.q,
    onSale: product.onSale,
    suggestSale: product.suggestSale,
    discountRate: 0,
  }));
}
