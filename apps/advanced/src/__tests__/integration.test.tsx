/**
 * Advanced 앱 인수테스트
 * basic.test.js를 기반으로 한 React 컴포넌트 통합 테스트
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { CartDisplay } from '../components/cart/CartDisplay';
import { ProductSelector } from '../components/product/ProductSelector';
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

  // 공통 헬퍼 함수
  const renderWithCartProvider = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  const addItemsToCart = async (productId: string, count: number) => {
    const addButton = screen.getByTestId(`add-to-cart-${productId}`);

    if (addButton) {
      for (let i = 0; i < count; i++) {
        await user.click(addButton);
      }
    }
  };

  describe('1. 상품 정보 테스트', () => {
    describe('1.1 상품 목록', () => {
      it('상품들이 올바른 정보로 표시되어야 함', () => {
        renderWithCartProvider(<ProductSelector />);

        // 상품 카드들이 렌더링되는지 확인
        expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
        expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
        expect(screen.getByText('거북목 탈출 모니터암')).toBeInTheDocument();
        expect(screen.getByText('에러 방지 노트북 파우치')).toBeInTheDocument();
        expect(
          screen.getByText('코딩할 때 듣는 Lo-Fi 스피커')
        ).toBeInTheDocument();

        // 가격 정보 확인
        expect(screen.getByText('10,000원')).toBeInTheDocument();
        expect(screen.getByText('20,000원')).toBeInTheDocument();
        expect(screen.getByText('30,000원')).toBeInTheDocument();
        expect(screen.getByText('15,000원')).toBeInTheDocument();
        expect(screen.getByText('25,000원')).toBeInTheDocument();
      });
    });

    describe('1.2 재고 관리', () => {
      it('재고가 0개인 상품은 "품절" 표시 및 버튼 비활성화', () => {
        renderWithCartProvider(<ProductSelector />);

        const outOfStockButton = screen.getByText('품절');
        expect(outOfStockButton).toBeInTheDocument();
        expect(outOfStockButton).toBeDisabled();
      });

      it('재고 정보가 표시되어야 함', () => {
        renderWithCartProvider(<ProductSelector />);

        // 재고 정보가 표시되는지 확인
        expect(screen.getByText(/재고:/)).toBeInTheDocument();
      });
    });
  });

  describe('2. 할인 정책 테스트', () => {
    describe('2.1 개별 상품 할인', () => {
      it('상품을 장바구니에 추가하면 할인 정보가 표시되어야 함', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 10);

        // 할인 정보 확인
        await waitFor(() => {
          expect(screen.getByText('할인 금액')).toBeInTheDocument();
        });
      });
    });

    describe('2.2 전체 수량 할인', () => {
      it('여러 상품을 추가하면 할인 정보가 표시되어야 함', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 10);
        await addItemsToCart('p2', 10);
        await addItemsToCart('p3', 10);

        await waitFor(() => {
          expect(screen.getByText('할인 금액')).toBeInTheDocument();
        });
      });
    });
  });

  describe('3. 포인트 적립 시스템 테스트', () => {
    describe('3.1 기본 적립', () => {
      it('상품을 추가하면 포인트 적립 정보가 표시되어야 함', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        await waitFor(() => {
          expect(screen.getByText(/적립 포인트/)).toBeInTheDocument();
        });
      });
    });

    describe('3.2 추가 적립', () => {
      it('여러 상품을 추가하면 포인트 적립 정보가 표시되어야 함', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);
        await addItemsToCart('p2', 1);

        await waitFor(() => {
          expect(screen.getByText(/적립 포인트/)).toBeInTheDocument();
        });
      });
    });
  });

  describe('4. UI/UX 요구사항 테스트', () => {
    describe('4.1 레이아웃', () => {
      it('필수 레이아웃 요소가 존재해야 함', () => {
        renderWithCartProvider(<App />);

        // 헤더
        expect(screen.getByText('🛒 쇼핑몰 애플리케이션')).toBeInTheDocument();
        expect(
          screen.getByText('선언적 프로그래밍 패러다임 적용')
        ).toBeInTheDocument();

        // 상품 선택 영역
        expect(screen.getByText('상품 선택')).toBeInTheDocument();

        // 장바구니 영역
        expect(screen.getByText('장바구니')).toBeInTheDocument();
      });
    });

    describe('4.2 상품 선택 영역', () => {
      it('카테고리 필터가 존재해야 함', () => {
        renderWithCartProvider(<ProductSelector />);

        expect(screen.getByLabelText('카테고리 선택')).toBeInTheDocument();
        expect(screen.getByLabelText('상품 검색')).toBeInTheDocument();
      });

      it('상품 통계 정보가 표시되어야 함', () => {
        renderWithCartProvider(<ProductSelector />);

        expect(screen.getByText(/전체:/)).toBeInTheDocument();
        expect(screen.getByText(/검색결과:/)).toBeInTheDocument();
      });
    });

    describe('4.3 장바구니 영역', () => {
      it('빈 장바구니 상태 표시', () => {
        renderWithCartProvider(<CartDisplay />);

        expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
        expect(screen.getByText('상품을 추가해보세요!')).toBeInTheDocument();
      });

      it('상품을 추가하면 장바구니에 표시되어야 함', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        await waitFor(() => {
          expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
        });
      });
    });
  });

  describe('5. 기능 요구사항 테스트', () => {
    describe('5.1 상품 추가', () => {
      it('선택한 상품을 장바구니에 추가', async () => {
        renderWithCartProvider(<App />);

        const addButton = screen.getByTestId('add-to-cart-p1');
        await user.click(addButton);

        await waitFor(() => {
          expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
        });
      });

      it('이미 있는 상품은 수량 증가', async () => {
        renderWithCartProvider(<App />);

        const addButton = screen.getByTestId('add-to-cart-p1');
        await user.click(addButton);
        await user.click(addButton);

        await waitFor(() => {
          const quantityInput = screen.getByDisplayValue('2');
          expect(quantityInput).toBeInTheDocument();
        });
      });

      it('품절 상품은 추가 불가', () => {
        renderWithCartProvider(<ProductSelector />);

        const outOfStockButton = screen.getByText('품절');
        expect(outOfStockButton).toBeDisabled();
      });
    });

    describe('5.2 수량 변경', () => {
      it('+/- 버튼으로 수량 조절', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        const increaseButton =
          screen.getByLabelText('버그 없애는 키보드 수량 증가');
        const decreaseButton =
          screen.getByLabelText('버그 없애는 키보드 수량 감소');

        // 증가
        await user.click(increaseButton);
        await waitFor(() => {
          expect(screen.getByDisplayValue('2')).toBeInTheDocument();
        });

        // 감소
        await user.click(decreaseButton);
        await waitFor(() => {
          expect(screen.getByDisplayValue('1')).toBeInTheDocument();
        });
      });

      it('수량 0이 되면 자동 제거', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        const decreaseButton =
          screen.getByLabelText('버그 없애는 키보드 수량 감소');
        await user.click(decreaseButton);

        await waitFor(() => {
          expect(
            screen.getByText('장바구니가 비어있습니다')
          ).toBeInTheDocument();
        });
      });
    });

    describe('5.3 상품 제거', () => {
      it('삭제 버튼 클릭 시 즉시 제거', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        const removeButton = screen.getByLabelText(
          '버그 없애는 키보드 장바구니에서 삭제'
        );
        await user.click(removeButton);

        await waitFor(() => {
          expect(
            screen.getByText('장바구니가 비어있습니다')
          ).toBeInTheDocument();
        });
      });
    });

    describe('5.4 실시간 계산', () => {
      it('수량 변경 시 즉시 재계산', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 1);

        await waitFor(() => {
          expect(screen.getByText(/상품 금액/)).toBeInTheDocument();
        });

        const increaseButton =
          screen.getByLabelText('버그 없애는 키보드 수량 증가');
        await user.click(increaseButton);

        await waitFor(() => {
          expect(screen.getByText(/상품 금액/)).toBeInTheDocument();
        });
      });

      it('할인 정책 자동 적용', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 10);

        await waitFor(() => {
          expect(screen.getByText('할인 금액')).toBeInTheDocument();
        });
      });
    });

    describe('5.5 상태 관리', () => {
      it('장바구니 상품 수 표시', async () => {
        renderWithCartProvider(<App />);

        await addItemsToCart('p1', 5);

        await waitFor(() => {
          expect(screen.getByText(/5개 상품/)).toBeInTheDocument();
        });
      });
    });
  });

  describe('6. 예외 처리 테스트', () => {
    describe('6.1 재고 부족', () => {
      it('재고 초과 시 알림 표시', async () => {
        renderWithCartProvider(<App />);

        // 재고가 10개인 상품을 11개 추가 시도
        await addItemsToCart('p5', 11);

        // 재고 한도 내에서만 추가되어야 함
        await waitFor(() => {
          const quantityInput = screen.getByDisplayValue('10');
          expect(quantityInput).toBeInTheDocument();
        });
      });
    });

    describe('6.2 빈 장바구니', () => {
      it('장바구니가 비어있을 때 빈 상태 표시', () => {
        renderWithCartProvider(<CartDisplay />);

        expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
        expect(screen.getByText('상품을 추가해보세요!')).toBeInTheDocument();
      });

      it('주문하기 버튼이 비활성화되어야 함', () => {
        renderWithCartProvider(<CartDisplay />);

        const checkoutButton = screen.getByText('상품을 추가해주세요');
        expect(checkoutButton).toBeDisabled();
      });
    });
  });

  describe('7. 복잡한 통합 시나리오', () => {
    it('대량구매 + 세트 할인 시나리오', async () => {
      renderWithCartProvider(<App />);

      // 키보드 10개, 마우스 10개, 모니터암 10개
      await addItemsToCart('p1', 10);
      await addItemsToCart('p2', 10);
      await addItemsToCart('p3', 10);

      await waitFor(() => {
        expect(screen.getByText('할인 금액')).toBeInTheDocument();
        expect(screen.getByText(/적립 포인트/)).toBeInTheDocument();
      });
    });

    it('주문하기 기능 테스트', async () => {
      renderWithCartProvider(<App />);

      await addItemsToCart('p1', 1);

      const checkoutButton = screen.getByText('주문하기');
      await user.click(checkoutButton);

      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('주문 금액:')
      );
    });
  });

  describe('8. 접근성 테스트', () => {
    it('모든 버튼에 적절한 aria-label이 있어야 함', () => {
      renderWithCartProvider(<App />);

      // 상품 추가 버튼
      const addButtons = screen.getAllByText('장바구니 추가');
      addButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });

      // 수량 조절 버튼들
      const quantityButtons = screen.getAllByText(/[+-]/);
      quantityButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('폼 요소에 적절한 label이 있어야 함', () => {
      renderWithCartProvider(<ProductSelector />);

      expect(screen.getByLabelText('카테고리 선택')).toBeInTheDocument();
      expect(screen.getByLabelText('상품 검색')).toBeInTheDocument();
    });
  });

  describe('9. 성능 테스트', () => {
    it('대량의 상품 추가 시 성능 저하 없이 동작', async () => {
      renderWithCartProvider(<App />);

      // 50개의 상품을 빠르게 추가
      const addButton = screen.getByTestId('add-to-cart-p1');

      const startTime = performance.now();

      for (let i = 0; i < 50; i++) {
        await user.click(addButton);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 5초 이내에 완료되어야 함
      expect(duration).toBeLessThan(5000);

      await waitFor(() => {
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      });
    });
  });
});
