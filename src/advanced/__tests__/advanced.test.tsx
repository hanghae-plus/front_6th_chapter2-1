import React from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

// 상품 데이터 타입 정의
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discount: number;
}

describe("advanced 테스트", () => {
  // 공통 헬퍼 함수들
  const addItemsToCart = async (
    user: any,
    productId: string,
    count: number
  ) => {
    const select = screen.getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /add to cart/i });

    for (let i = 0; i < count; i++) {
      await user.selectOptions(select, productId);
      await user.click(addButton);
    }
  };

  const expectProductInfo = (option: HTMLOptionElement, product: Product) => {
    expect(option.value).toBe(product.id);
    expect(option.textContent).toContain(product.name);
    expect(option.textContent).toContain(product.price.toLocaleString());
    if (product.stock === 0) {
      expect(option.disabled).toBe(true);
      expect(option.textContent).toContain("품절");
    }
  };

  const getCartItemQuantity = (productName: string) => {
    const item = screen.queryByText(productName);
    if (!item) return 0;
    const itemContainer = item.closest(
      '[class*="flex items-center justify-between"]'
    );
    if (!itemContainer) return 0;
    const qtyElement = itemContainer.querySelector(
      'span[class*="px-3 py-1 text-sm font-medium"]'
    );
    return qtyElement ? parseInt(qtyElement.textContent || "0") : 0;
  };

  beforeEach(() => {
    vi.useRealTimers();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("2. 상품 정보", () => {
    describe("2.1 상품 목록", () => {
      it("4개 상품이 올바른 정보로 표시되어야 함", () => {
        render(<App />);

        const expectedProducts = [
          { id: "1", name: "키보드", price: 50000, stock: 100, discount: 10 },
          { id: "2", name: "마우스", price: 30000, stock: 150, discount: 15 },
          { id: "3", name: "모니터암", price: 80000, stock: 50, discount: 20 },
          { id: "4", name: "스피커", price: 120000, stock: 30, discount: 25 },
        ];

        const select = screen.getByRole("combobox");
        expect(select.children.length).toBe(5); // 기본 옵션 + 4개 상품

        expectedProducts.forEach((product, index) => {
          const option = select.children[index + 1] as HTMLOptionElement;
          expectProductInfo(option, product);
        });
      });
    });

    describe("2.2 재고 관리", () => {
      it('재고가 5개 미만인 상품은 "재고 부족" 표시', async () => {
        const user = userEvent.setup();
        render(<App />);

        // 스피커를 26개 구매하여 재고를 4개로 만듦
        await addItemsToCart(user, "4", 26);

        // 재고 부족 메시지가 표시되는지 확인
        const stockStatus = screen.getByText(/재고 부족|4개 남음/);
        expect(stockStatus).toBeInTheDocument();
      });
    });
  });

  describe("3. 할인 정책", () => {
    describe("3.1 개별 상품 할인", () => {
      it("키보드: 10개 이상 구매 시 10% 할인", async () => {
        const user = userEvent.setup();
        render(<App />);

        await addItemsToCart(user, "1", 10);

        // 500,000원 -> 450,000원 (10% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩450,000");
      });

      it("마우스: 10개 이상 구매 시 15% 할인", async () => {
        const user = userEvent.setup();
        render(<App />);

        await addItemsToCart(user, "2", 10);

        // 300,000원 -> 255,000원 (15% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩255,000");
      });

      it("모니터암: 10개 이상 구매 시 20% 할인", async () => {
        const user = userEvent.setup();
        render(<App />);

        await addItemsToCart(user, "3", 10);

        // 800,000원 -> 640,000원 (20% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩640,000");
      });

      it("스피커: 10개 이상 구매 시 25% 할인", async () => {
        const user = userEvent.setup();
        render(<App />);

        await addItemsToCart(user, "4", 10);

        // 1,200,000원 -> 900,000원 (25% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩900,000");
      });
    });

    describe("3.2 전체 수량 할인", () => {
      it("전체 30개 이상 구매 시 25% 할인 (개별 할인 무시)", async () => {
        const user = userEvent.setup();
        render(<App />);

        // 키보드 10개, 마우스 10개, 모니터암 10개 = 총 30개
        await addItemsToCart(user, "1", 10);
        await addItemsToCart(user, "2", 10);
        await addItemsToCart(user, "3", 10);

        // 1,600,000원 -> 1,200,000원 (25% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩1,200,000");
      });
    });

    describe("3.3 특별 할인", () => {
      describe("3.3.1 화요일 할인", () => {
        it("화요일에 10% 추가 할인 적용", () => {
          const tuesday = new Date("2024-10-15"); // 화요일
          vi.useFakeTimers();
          vi.setSystemTime(tuesday);

          render(<App />);

          const select = screen.getByRole("combobox");
          const addButton = screen.getByRole("button", {
            name: /add to cart/i,
          });

          fireEvent.change(select, { target: { value: "1" } });
          fireEvent.click(addButton);

          // 50,000원 -> 45,000원 (10% 할인)
          const totalElement = screen.getByText(/Total/).closest("div");
          expect(totalElement).toHaveTextContent("₩45,000");

          // 화요일 특별 할인 배너 표시
          const tuesdayBanner = screen.getByText(/Tuesday Special 10% Applied/);
          expect(tuesdayBanner).toBeInTheDocument();

          vi.useRealTimers();
        });
      });
    });
  });

  describe("4. 포인트 적립 시스템", () => {
    describe("4.1 기본 적립", () => {
      it("최종 결제 금액의 0.1% 포인트 적립", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        // 50,000원 -> 50포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("50p");
      });
    });

    describe("4.2 추가 적립", () => {
      it("화요일 구매 시 기본 포인트 2배", () => {
        const tuesday = new Date("2024-10-15");
        vi.useFakeTimers();
        vi.setSystemTime(tuesday);

        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        fireEvent.change(select, { target: { value: "1" } });
        fireEvent.click(addButton);

        // 45,000원 (화요일 10% 할인) -> 45포인트 * 2 = 90포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("90p");

        vi.useRealTimers();
      });

      it("키보드+마우스 세트 구매 시 +50p", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        await user.selectOptions(select, "2");
        await user.click(addButton);

        // 80,000원 -> 80포인트 + 50포인트 = 130포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("130p");
      });

      it("풀세트(키보드+마우스+모니터암) 구매 시 +100p", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        await user.selectOptions(select, "2");
        await user.click(addButton);

        await user.selectOptions(select, "3");
        await user.click(addButton);

        // 160,000원 -> 160포인트 + 50포인트(세트) + 100포인트(풀세트) = 310포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("310p");
      });
    });
  });

  describe("5. UI/UX 요구사항", () => {
    describe("5.1 레이아웃", () => {
      it("필수 레이아웃 요소가 존재해야 함", () => {
        render(<App />);

        // 헤더
        expect(screen.getByText(/🛒 Hanghae Online Store/)).toBeInTheDocument();
        expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();

        // 좌측: 상품 선택 및 장바구니
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText(/상품을 선택하세요/)).toBeInTheDocument();

        // 우측: 주문 요약
        expect(screen.getByText(/Order Summary/)).toBeInTheDocument();
        expect(screen.getByText(/Total/)).toBeInTheDocument();

        // 도움말 버튼 (접근성 관점에서)
        expect(
          screen.getByRole("button", { name: /help/i })
        ).toBeInTheDocument();
      });
    });

    describe("5.2 상품 선택 영역", () => {
      it("상품 선택 드롭다운이 올바르게 작동", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "1");

        expect(select).toHaveValue("1");
      });
    });

    describe("5.3 장바구니 영역", () => {
      it("장바구니 아이템 카드 형식 확인", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        // 상품명
        expect(screen.getByText("키보드")).toBeInTheDocument();

        // 수량 조절 버튼 (접근성 관점에서)
        expect(
          screen.getByRole("button", { name: /decrease/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /increase/i })
        ).toBeInTheDocument();

        // 제거 버튼
        expect(
          screen.getByRole("button", { name: /remove/i })
        ).toBeInTheDocument();
      });
    });

    describe("5.5 도움말 모달", () => {
      it("도움말 버튼 클릭 시 모달 표시", async () => {
        const user = userEvent.setup();
        render(<App />);

        const helpButton = screen.getByRole("button", { name: /help/i });

        // 초기 상태: 모달 내용이 숨겨져 있음
        expect(screen.queryByText(/이용 안내/)).not.toBeInTheDocument();

        // 클릭 후: 모달 표시
        await user.click(helpButton);

        expect(screen.getByText(/이용 안내/)).toBeInTheDocument();
        expect(screen.getByText(/할인 정책/)).toBeInTheDocument();
      });

      it("배경 클릭 시 모달 닫기", async () => {
        const user = userEvent.setup();
        render(<App />);

        const helpButton = screen.getByRole("button", { name: /help/i });

        // 모달 열기
        await user.click(helpButton);
        expect(screen.getByText(/이용 안내/)).toBeInTheDocument();

        // 배경 클릭으로 닫기
        const overlay = screen.getByRole("presentation");
        await user.click(overlay);

        // 모달이 닫혔는지 확인
        expect(screen.queryByText(/이용 안내/)).not.toBeInTheDocument();
      });
    });
  });

  describe("6. 기능 요구사항", () => {
    describe("6.1 상품 추가", () => {
      it("선택한 상품을 장바구니에 추가", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "2");
        await user.click(addButton);

        expect(screen.getByText("마우스")).toBeInTheDocument();
      });

      it("이미 있는 상품은 수량 증가", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "3");
        await user.click(addButton);
        await user.click(addButton);

        // 수량이 2인지 확인
        const quantityElement = screen.getByText("2");
        expect(quantityElement).toBeInTheDocument();
      });
    });

    describe("6.2 수량 변경", () => {
      it("+/- 버튼으로 수량 조절", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        const increaseBtn = screen.getByRole("button", { name: /increase/i });
        const decreaseBtn = screen.getByRole("button", { name: /decrease/i });

        // 증가
        await user.click(increaseBtn);
        expect(screen.getByText("2")).toBeInTheDocument();

        // 감소
        await user.click(decreaseBtn);
        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("수량 0이 되면 자동 제거", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        const decreaseBtn = screen.getByRole("button", { name: /decrease/i });
        await user.click(decreaseBtn);

        expect(screen.queryByText("키보드")).not.toBeInTheDocument();
      });
    });

    describe("6.3 상품 제거", () => {
      it("Remove 버튼 클릭 시 즉시 제거", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "2");
        await user.click(addButton);

        const removeBtn = screen.getByRole("button", { name: /remove/i });
        await user.click(removeBtn);

        expect(screen.queryByText("마우스")).not.toBeInTheDocument();
      });
    });

    describe("6.4 실시간 계산", () => {
      it("수량 변경 시 즉시 재계산", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        // 초기 총액 확인
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩50,000");

        const increaseBtn = screen.getByRole("button", { name: /increase/i });
        await user.click(increaseBtn);

        // 수량 증가 후 총액 확인
        expect(totalElement).toHaveTextContent("₩100,000");
      });

      it("포인트 실시간 업데이트", async () => {
        const user = userEvent.setup();
        render(<App />);

        const select = screen.getByRole("combobox");
        const addButton = screen.getByRole("button", { name: /add to cart/i });

        await user.selectOptions(select, "1");
        await user.click(addButton);

        expect(screen.getByText(/적립 포인트/)).toHaveTextContent("50p");

        const increaseBtn = screen.getByRole("button", { name: /increase/i });
        await user.click(increaseBtn);

        expect(screen.getByText(/적립 포인트/)).toHaveTextContent("100p");
      });
    });

    describe("6.5 상태 관리", () => {
      it("장바구니 상품 수 표시", async () => {
        const user = userEvent.setup();
        render(<App />);

        expect(screen.getByText(/0 items/)).toBeInTheDocument();

        await addItemsToCart(user, "1", 5);

        expect(screen.getByText(/5 items/)).toBeInTheDocument();
      });
    });
  });

  describe("복잡한 통합 시나리오", () => {
    it("화요일 + 풀세트 + 대량구매 시나리오", () => {
      const tuesday = new Date("2024-10-15");
      vi.useFakeTimers();
      vi.setSystemTime(tuesday);

      render(<App />);

      // 키보드 10개, 마우스 10개, 모니터암 10개
      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /add to cart/i });

      // 키보드 10개
      fireEvent.change(select, { target: { value: "1" } });
      for (let i = 0; i < 10; i++) {
        fireEvent.click(addButton);
      }

      // 마우스 10개
      fireEvent.change(select, { target: { value: "2" } });
      for (let i = 0; i < 10; i++) {
        fireEvent.click(addButton);
      }

      // 모니터암 10개
      fireEvent.change(select, { target: { value: "3" } });
      for (let i = 0; i < 10; i++) {
        fireEvent.click(addButton);
      }

      // 총액 확인: 1,600,000원 -> 25% 할인 -> 1,200,000원 -> 화요일 10% -> 1,080,000원
      const totalElement = screen.getByText(/Total/).closest("div");
      expect(totalElement).toHaveTextContent("₩1,080,000");

      // 포인트 확인: 1,080포인트(기본) * 2(화요일) + 50(세트) + 100(풀세트) + 100(30개) = 2,410포인트
      const loyaltyPoints = screen.getByText(/적립 포인트/);
      expect(loyaltyPoints).toHaveTextContent("2,410p");

      vi.useRealTimers();
    });
  });
});
