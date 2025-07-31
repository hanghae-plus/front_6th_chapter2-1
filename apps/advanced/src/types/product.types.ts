/**
 * 상품 관련 타입 정의
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image?: string;
  discountRate?: number;
  discountThreshold?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface ProductFilters {
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductSortOptions {
  field: "name" | "price" | "stock";
  direction: "asc" | "desc";
}
