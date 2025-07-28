/**
 * Advanced 앱 인수테스트
 * 실제 컴포넌트 구조에 맞는 핵심 기능 테스트
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { CartProvider } from '../context/CartContext';

describe('Advanced 앱 인수테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.useRealTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderApp = () => {
    return render(
      <CartProvider>
        <App />
      </CartProvider>
    );
  };

  describe('1. 기본 렌더링 테스트', () => {
    it('애플리케이션이 정상적으로 렌더링되어야 함', () => {
      renderApp();

      // 헤더 확인
      expect(screen.getByText('🛒 쇼핑몰 애플리케이션')).toBeInTheDocument();
      expect(
        screen.getByText('선언적 프로그래밍 패러다임 적용')
      ).toBeInTheDocument();

      // 주요 섹션 확인
      expect(screen.getByText('상품 선택')).toBeInTheDocument();
    });

    it('상품 목록이 표시되어야 함', () => {
      renderApp();

      // 상품들이 표시되는지 확인
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
      expect(screen.getByText('거북목 탈출 모니터암')).toBeInTheDocument();
      expect(screen.getByText('에러 방지 노트북 파우치')).toBeInTheDocument();
      expect(
        screen.getByText('코딩할 때 듣는 Lo-Fi 스피커')
      ).toBeInTheDocument();
    });

    it('상품 가격이 표시되어야 함', () => {
      renderApp();

      // 가격 정보 확인
      expect(screen.getByText('10,000원')).toBeInTheDocument();
      expect(screen.getByText('20,000원')).toBeInTheDocument();
      expect(screen.getByText('30,000원')).toBeInTheDocument();
      expect(screen.getByText('15,000원')).toBeInTheDocument();
      expect(screen.getByText('25,000원')).toBeInTheDocument();
    });

    it('재고 정보가 표시되어야 함', () => {
      renderApp();

      // 재고 정보가 표시되는지 확인 (첫 번째 상품의 재고만 확인)
      const stockElements = screen.getAllByText(/재고:/);
      expect(stockElements.length).toBeGreaterThan(0);
    });
  });

  describe('2. 장바구니 기능 테스트', () => {
    it('빈 장바구니 상태가 표시되어야 함', () => {
      renderApp();

      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
      expect(screen.getByText('상품을 추가해보세요!')).toBeInTheDocument();
    });

    it('상품을 장바구니에 추가할 수 있어야 함', async () => {
      renderApp();

      // 장바구니 추가 버튼 찾기
      const addButtons = screen.getAllByText('장바구니 추가');
      expect(addButtons.length).toBeGreaterThan(0);

      // 첫 번째 상품 추가
      await user.click(addButtons[0]);

      // 장바구니에 상품이 추가되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('장바구니 (1개 상품)')).toBeInTheDocument();
      });
    });

    it('장바구니에 상품이 추가되면 수량 조절이 가능해야 함', async () => {
      renderApp();

      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      // 수량 조절 버튼들이 나타나는지 확인
      await waitFor(() => {
        expect(screen.getByLabelText(/수량 증가/)).toBeInTheDocument();
        expect(screen.getByLabelText(/수량 감소/)).toBeInTheDocument();
      });
    });

    it('상품을 삭제할 수 있어야 함', async () => {
      renderApp();

      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      // 삭제 버튼 찾기
      await waitFor(() => {
        const removeButton = screen.getByLabelText(/장바구니에서 삭제/);
        expect(removeButton).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText(/장바구니에서 삭제/);
      await user.click(removeButton);

      // 장바구니가 비어있는지 확인
      await waitFor(() => {
        expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
      });
    });
  });

  describe('3. 필터링 기능 테스트', () => {
    it('카테고리 필터가 존재해야 함', () => {
      renderApp();

      expect(screen.getByLabelText('카테고리 선택')).toBeInTheDocument();
    });

    it('검색 기능이 존재해야 함', () => {
      renderApp();

      expect(screen.getByLabelText('상품 검색')).toBeInTheDocument();
    });

    it('상품 통계 정보가 표시되어야 함', () => {
      renderApp();

      expect(screen.getByText(/전체:/)).toBeInTheDocument();
      expect(screen.getByText(/검색결과:/)).toBeInTheDocument();
    });
  });

  describe('4. 주문 요약 테스트', () => {
    it('상품을 추가하면 주문 요약이 표시되어야 함', async () => {
      renderApp();

      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('주문 요약')).toBeInTheDocument();
        expect(screen.getByText(/상품 금액/)).toBeInTheDocument();
      });
    });

    it('주문하기 버튼이 존재해야 함', async () => {
      renderApp();

      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('주문하기')).toBeInTheDocument();
      });
    });
  });

  describe('5. 접근성 테스트', () => {
    it('모든 버튼에 aria-label이 있어야 함', () => {
      renderApp();

      const addButtons = screen.getAllByText('장바구니 추가');
      addButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('폼 요소에 적절한 label이 있어야 함', () => {
      renderApp();

      expect(screen.getByLabelText('카테고리 선택')).toBeInTheDocument();
      expect(screen.getByLabelText('상품 검색')).toBeInTheDocument();
    });
  });

  describe('6. 예외 처리 테스트', () => {
    it('품절 상품은 추가할 수 없어야 함', () => {
      renderApp();

      // 품절 상품의 버튼이 비활성화되어 있는지 확인
      const outOfStockButton = screen.getByText('품절');
      expect(outOfStockButton).toBeDisabled();
    });

    it('빈 장바구니에서는 주문하기 버튼이 없어야 함', () => {
      renderApp();

      // 빈 장바구니 상태에서는 주문하기 버튼이 없어야 함
      expect(screen.queryByText('주문하기')).not.toBeInTheDocument();
    });
  });

  describe('7. 통합 시나리오 테스트', () => {
    it('전체 구매 플로우가 정상적으로 동작해야 함', async () => {
      renderApp();

      // 1. 상품 추가
      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      // 2. 장바구니에 상품이 추가되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('주문 요약')).toBeInTheDocument();
      });

      // 3. 수량 증가
      const increaseButton = screen.getByLabelText(/수량 증가/);
      await user.click(increaseButton);

      // 4. 수량이 증가했는지 확인
      await waitFor(() => {
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      });

      // 5. 주문 요약 확인
      expect(screen.getByText('주문 요약')).toBeInTheDocument();
      expect(screen.getByText(/상품 금액/)).toBeInTheDocument();

      // 6. 주문하기 버튼 클릭
      const checkoutButton = screen.getByText('주문하기');
      await user.click(checkoutButton);

      // 7. 주문 완료 알림 확인
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('주문 금액:')
      );
    });

    it('여러 상품을 추가하고 수량을 조절할 수 있어야 함', async () => {
      renderApp();

      // 첫 번째 상품 추가
      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      // 두 번째 상품 추가
      await user.click(addButtons[1]);

      // 장바구니에 두 개의 상품이 추가되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('장바구니 (2개 상품)')).toBeInTheDocument();
      });

      // 수량 조절
      const increaseButtons = screen.getAllByLabelText(/수량 증가/);
      await user.click(increaseButtons[0]);

      // 수량이 증가했는지 확인
      await waitFor(() => {
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      });
    });

    it('장바구니 비우기 기능이 정상 작동해야 함', async () => {
      renderApp();

      // 상품 추가
      const addButtons = screen.getAllByText('장바구니 추가');
      await user.click(addButtons[0]);

      // 장바구니 비우기 버튼 클릭
      await waitFor(() => {
        const clearButton = screen.getByText('장바구니 비우기');
        expect(clearButton).toBeInTheDocument();
      });

      const clearButton = screen.getByText('장바구니 비우기');
      await user.click(clearButton);

      // 장바구니가 비어있는지 확인
      await waitFor(() => {
        expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
      });
    });
  });
});
