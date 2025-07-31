// src/advanced/__tests__/advanced.test.tsx
import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { CartProvider } from '../context/CartContext';
import { vi } from 'vitest';
import { initialProducts } from '../state/initialData';

const renderApp = () => {
  return render(
    <CartProvider>
      <App />
    </CartProvider>
  );
};

describe('Advanced Shopping Cart App', () => {
  const user = userEvent.setup();

  beforeAll(() => {
    // Mock alert for all tests in this suite
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear mock history after each test
    window.alert.mockClear();
    vi.useRealTimers();
  });

  afterAll(() => {
    // Restore all mocks after the suite is done
    vi.restoreAllMocks();
  });

  test('초기 렌더링 시 UI 요소들이 올바르게 표시된다', () => {
    renderApp();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('🛍️ 0 items in cart')).toBeInTheDocument();
  });

  test('상품을 장바구니에 추가하면 카운트와 요약 정보가 업데이트된다', async () => {
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p1');
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const summary = screen.getByTestId('order-summary');
      expect(within(summary).getByTestId('subtotal')).toHaveTextContent('₩10,000');
    });
  });

  test('+/- 버튼으로 수량을 조절하고, 0이 되면 아이템이 사라진다', async () => {
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p1');
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    const itemRow = await screen.findByText('버그 없애는 키보드');
    const increaseBtn = within(itemRow.parentElement.parentElement).getByRole('button', { name: '+' });
    const decreaseBtn = within(itemRow.parentElement.parentElement).getByRole('button', { name: '−' });

    await user.click(increaseBtn);
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());

    await user.click(decreaseBtn);
    await user.click(decreaseBtn);
    await waitFor(() => {
      expect(screen.queryByText('버그 없애는 키보드')).not.toBeInTheDocument();
    });
  });

  test('Remove 버튼으로 상품을 제거할 수 있다', async () => {
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p1');
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    const itemRow = await screen.findByText('버그 없애는 키보드');
    const removeBtn = within(itemRow.parentElement.parentElement).getByRole('button', { name: 'Remove' });
    
    await user.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText('버그 없애는 키보드')).not.toBeInTheDocument();
    });
  });

  test('재고 이상으로 상품을 담으려 하면 alert가 표시된다', async () => {
    renderApp();
    const product = initialProducts.find(p => p.id === 'p5');
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p5');
    
    for (let i = 0; i < product.q; i++) {
      await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    }

    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(window.alert).toHaveBeenCalledWith('재고가 부족합니다.');
  });

  test('개별 상품 할인이 올바르게 적용된다 (마우스 10개)', async () => {
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p2');
    for (let i = 0; i < 10; i++) {
      await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    }

    await waitFor(() => {
      const summary = screen.getByTestId('order-summary');
      const expectedTotal = (20000 * 10 * (1 - 0.15)).toLocaleString();
      expect(within(summary).getByTestId('total')).toHaveTextContent(`₩${expectedTotal}`);
    });
  });

  test('전체 수량 할인이 개별 할인을 덮어쓴다 (30개 이상)', async () => {
    renderApp();
    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p1');
    for (let i = 0; i < 30; i++) {
      await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    }

    await waitFor(() => {
      const summary = screen.getByTestId('order-summary');
      const expectedTotal = (10000 * 30 * (1 - 0.25)).toLocaleString();
      expect(within(summary).getByTestId('total')).toHaveTextContent(`₩${expectedTotal}`);
    });
  });

  test('화요일에는 10% 추가 할인이 적용된다', async () => {
    vi.setSystemTime(new Date('2025-07-29T10:00:00'));
    renderApp();

    await user.selectOptions(screen.getByRole('combobox', { name: '상품 선택' }), 'p1');
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const summary = screen.getByTestId('order-summary');
      const expectedTotal = (10000 * (1 - 0.1)).toLocaleString();
      expect(within(summary).getByTestId('total')).toHaveTextContent(`₩${expectedTotal}`);
    });
  });

  test('복합적인 포인트가 올바르게 적립된다', async () => {
    renderApp();
    const productSelect = screen.getByRole('combobox', { name: '상품 선택' });
    const addButton = screen.getByRole('button', { name: 'Add to Cart' });

    for (const productId of ['p1', 'p2', 'p3']) {
      await user.selectOptions(productSelect, productId);
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }
    }

    await waitFor(() => {
      const summary = screen.getByTestId('order-summary');
      expect(within(summary).getByText(/풀세트 구매/)).toBeInTheDocument();
    });
  });

  test('시간이 지나면 번개세일이 적용된다', async () => {
    vi.useFakeTimers();
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    renderApp();

    await act(async () => {
      vi.advanceTimersByTime(35000);
    });

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('⚡번개세일!'));
    
    const productSelect = screen.getByRole('combobox', { name: '상품 선택' });
    expect(within(productSelect).getByText(/⚡/)).toBeInTheDocument();
    
    randomSpy.mockRestore();
  });
});
