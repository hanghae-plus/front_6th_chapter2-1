import { create } from 'zustand';
import { SALE_EVENT, saleRate } from '../utils/sale-event';
import { applyDiscount } from '../utils/discount';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  originalQuantity: number;
  bulkSaleRate: number;
  saleEvent: number;
}

interface ProductsStore {
  products: Product[];
  addQuantity: (params: Pick<Product, 'id' | 'quantity'>) => void;
  applyLightningSale: (params: Pick<Product, 'id'>) => void;
  applySuggestSale: (params: Pick<Product, 'id'>) => void;
}

export const useProducts = create<ProductsStore>((set) => ({
  products: [
    {
      id: 'p1',
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      quantity: 50,
      originalQuantity: 50,
      bulkSaleRate: 0.1,
      saleEvent: SALE_EVENT.NONE,
    },
    {
      id: 'p2',
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      quantity: 30,
      originalQuantity: 30,
      bulkSaleRate: 0.15,
      saleEvent: SALE_EVENT.NONE,
    },
    {
      id: 'p3',
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      quantity: 20,
      originalQuantity: 20,
      bulkSaleRate: 0.2,
      saleEvent: SALE_EVENT.NONE,
    },
    {
      id: 'p4',
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      quantity: 0,
      originalQuantity: 0,
      bulkSaleRate: 0.05,
      saleEvent: SALE_EVENT.NONE,
    },
    {
      id: 'p5',
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      price: 25000,
      originalPrice: 25000,
      quantity: 10,
      originalQuantity: 10,
      bulkSaleRate: 0.25,
      saleEvent: SALE_EVENT.NONE,
    },
  ],
  addQuantity: ({ id, quantity }: Pick<Product, 'id' | 'quantity'>) => {
    set(({ products }) => {
      return {
        products: products.map((product) => {
          if (product.id !== id) {
            return product;
          }

          return { ...product, quantity: product.quantity + quantity };
        }),
      };
    });
  },
  applyLightningSale: ({ id }: Pick<Product, 'id'>) => {
    set(({ products }) => {
      return {
        products: applySaleById({
          products,
          id,
          saleEvent: SALE_EVENT.LIGHTNING,
        }),
      };
    });
  },
  applySuggestSale: ({ id }: Pick<Product, 'id'>) => {
    set(({ products }) => {
      return {
        products: applySaleById({
          products,
          id,
          saleEvent: SALE_EVENT.SUGGEST,
        }),
      };
    });
  },
}));

function applySaleById({
  products,
  id,
  saleEvent,
}: {
  products: Product[];
  id: string;
  saleEvent: number;
}) {
  return products.map((product) => {
    if (product.id !== id) {
      return product;
    }

    const nextSaleEvent = product.saleEvent | saleEvent;
    return {
      ...product,
      price: applyDiscount({
        price: product.price,
        rate: saleRate(nextSaleEvent),
      }),
      saleEvent: nextSaleEvent,
    };
  });
}
