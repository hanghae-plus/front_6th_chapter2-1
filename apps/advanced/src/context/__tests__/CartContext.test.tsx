/**
 * CartContext 테스트
 * React Context API 구현 검증
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PRODUCTS } from '../../constants/products';
import {
  CartProvider,
  useCart,
  useCartActions,
  useCartState
} from '../CartContext';

// 테스트용 컴포넌트들
const TestComponent = () => {
  const {
    items,
    totalPrice,
    totalDiscount,
    totalPoints,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  return (
    <div>
      <span data-testid='item-count'>{itemCount}</span>
      <span data-testid='total-price'>{totalPrice}</span>
      <span data-testid='total-discount'>{totalDiscount}</span>
      <span data-testid='total-points'>{totalPoints}</span>
      <span data-testid='items-length'>{items.length}</span>

      <button onClick={() => addToCart(PRODUCTS[0], 1)}>Add Item</button>
      <button onClick={() => addToCart(PRODUCTS[1], 2)}>
        Add Multiple Items
      </button>
      <button onClick={() => removeFromCart(PRODUCTS[0].id)}>
        Remove Item
      </button>
      <button onClick={() => updateQuantity(PRODUCTS[0].id, 3)}>
        Update Quantity
      </button>
      <button onClick={() => updateQuantity(PRODUCTS[0].id, 0)}>
        Set Zero Quantity
      </button>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
};

const TestStateComponent = () => {
  const { items, totalPrice, itemCount } = useCartState();

  return (
    <div>
      <span data-testid='state-item-count'>{itemCount}</span>
      <span data-testid='state-total-price'>{totalPrice}</span>
      <span data-testid='state-items-length'>{items.length}</span>
    </div>
  );
};

const TestActionsComponent = () => {
  const { addToCart, removeFromCart } = useCartActions();

  return (
    <div>
      <button onClick={() => addToCart(PRODUCTS[0], 1)}>Add Item</button>
      <button onClick={() => removeFromCart(PRODUCTS[0].id)}>
        Remove Item
      </button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    // 각 테스트 전에 화면 정리
  });

  describe('CartProvider', () => {
    it('should provide initial cart state', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('total-discount')).toHaveTextContent('0');
      expect(screen.getByTestId('total-points')).toHaveTextContent('0');
      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    });

    it('should add item to cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      fireEvent.click(screen.getByText('Add Item'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent(
        PRODUCTS[0].price.toString()
      );
    });

    it('should add multiple items to cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      fireEvent.click(screen.getByText('Add Multiple Items'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('items-length')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent(
        (PRODUCTS[1].price * 2).toString()
      );
    });

    it('should update existing item quantity', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // 먼저 아이템 추가
      fireEvent.click(screen.getByText('Add Item'));

      // 같은 아이템 다시 추가 (수량 증가)
      fireEvent.click(screen.getByText('Add Item'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('items-length')).toHaveTextContent('1'); // 아이템 종류는 1개
      expect(screen.getByTestId('total-price')).toHaveTextContent(
        (PRODUCTS[0].price * 2).toString()
      );
    });

    it('should remove item from cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // 아이템 추가
      fireEvent.click(screen.getByText('Add Item'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('1');

      // 아이템 제거
      fireEvent.click(screen.getByText('Remove Item'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    });

    it('should update item quantity', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // 아이템 추가
      fireEvent.click(screen.getByText('Add Item'));

      // 수량 업데이트
      fireEvent.click(screen.getByText('Update Quantity'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('3');
      expect(screen.getByTestId('total-price')).toHaveTextContent(
        (PRODUCTS[0].price * 3).toString()
      );
    });

    it('should clear cart', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // 아이템 추가
      fireEvent.click(screen.getByText('Add Item'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('1');

      // 장바구니 비우기
      fireEvent.click(screen.getByText('Clear Cart'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    it('should handle zero quantity removal', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // 아이템 추가
      fireEvent.click(screen.getByText('Add Item'));

      // 수량을 3으로 업데이트
      fireEvent.click(screen.getByText('Update Quantity'));
      expect(screen.getByTestId('item-count')).toHaveTextContent('3');

      // 수량을 0으로 업데이트 (자동 제거)
      fireEvent.click(screen.getByText('Set Zero Quantity'));

      expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    });
  });

  describe('useCartState', () => {
    it('should provide cart state only', () => {
      render(
        <CartProvider>
          <TestStateComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('state-item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('state-total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('state-items-length')).toHaveTextContent('0');
    });

    it('should update state when cart changes', () => {
      render(
        <CartProvider>
          <TestStateComponent />
          <TestActionsComponent />
        </CartProvider>
      );

      fireEvent.click(screen.getByText('Add Item'));

      expect(screen.getByTestId('state-item-count')).toHaveTextContent('1');
      expect(screen.getByTestId('state-items-length')).toHaveTextContent('1');
    });
  });

  describe('useCartActions', () => {
    it('should provide cart actions only', () => {
      render(
        <CartProvider>
          <TestActionsComponent />
        </CartProvider>
      );

      expect(screen.getByText('Add Item')).toBeInTheDocument();
      expect(screen.getByText('Remove Item')).toBeInTheDocument();
    });

    it('should execute actions correctly', () => {
      render(
        <CartProvider>
          <TestStateComponent />
          <TestActionsComponent />
        </CartProvider>
      );

      fireEvent.click(screen.getByText('Add Item'));
      expect(screen.getByTestId('state-item-count')).toHaveTextContent('1');

      fireEvent.click(screen.getByText('Remove Item'));
      expect(screen.getByTestId('state-item-count')).toHaveTextContent('0');
    });
  });

  describe('Error handling', () => {
    it('should throw error when useCart is used outside provider', () => {
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');
    });

    it('should throw error when useCartState is used outside provider', () => {
      expect(() => {
        render(<TestStateComponent />);
      }).toThrow('useCartState must be used within a CartProvider');
    });

    it('should throw error when useCartActions is used outside provider', () => {
      expect(() => {
        render(<TestActionsComponent />);
      }).toThrow('useCartActions must be used within a CartProvider');
    });
  });

  describe('Performance optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;

      const TestComponentWithRenderCount = () => {
        renderCount++;
        const { items } = useCartState();

        return (
          <div>
            <span data-testid='render-count'>{renderCount}</span>
            <span data-testid='items-length'>{items.length}</span>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponentWithRenderCount />
          <TestActionsComponent />
        </CartProvider>
      );

      const initialRenderCount = renderCount;

      // 액션 실행
      fireEvent.click(screen.getByText('Add Item'));

      // 렌더링 횟수가 최소화되었는지 확인
      expect(renderCount).toBeLessThanOrEqual(initialRenderCount + 2);
    });
  });
});
