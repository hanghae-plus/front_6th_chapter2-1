import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import ReactDOM from "react-dom/client";
import React from "react";

describe("advanced 장바구니 테스트", () => {
  let root;
  let container;

  beforeEach(async () => {
    vi.useRealTimers();
    // 특정 날짜 고정 (화요일로 설정)
    vi.setSystemTime(new Date("2024-10-15")); // 화요일

    // DOM 초기화
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app");

    // React 앱 렌더링을 위한 동적 import
    const App = (await import("../App")).default;
    root = ReactDOM.createRoot(container);
    root.render(React.createElement(App));

    // 렌더링 완료를 위한 대기
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  afterEach(() => {
    if (root) {
      root.unmount();
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // 헬퍼 함수들
  const addItemsToCart = async (productValue, count) => {
    const select = container.querySelector("select");
    const addButton = container.querySelector('button[class*="w-full py-3"]');

    if (select && addButton) {
      select.value = productValue;
      select.dispatchEvent(new Event("change", { bubbles: true }));

      for (let i = 0; i < count; i++) {
        addButton.click();
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
  };

  const waitForUpdate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  describe("1. 컴포넌트 렌더링", () => {
    it("CartPage가 정상적으로 렌더링되어야 함", () => {
      expect(container.textContent).toContain("🛒 Hanghae Online Store");
      expect(container.textContent).toContain("Shopping Cart");
      expect(container.querySelector("button")).toBeTruthy();
    });

    it("초기 상태에서 5개의 상품이 선택 가능해야 함", () => {
      const options = container.querySelectorAll("option");

      expect(options.length).toBe(5);
      expect(container.textContent).toContain("버그 없애는 키보드");
      expect(container.textContent).toContain("생산성 폭발 마우스");
      expect(container.textContent).toContain("거북목 탈출 모니터암");
      expect(container.textContent).toContain("에러 방지 노트북 파우치");
      expect(container.textContent).toContain("코딩할 때 듣는 Lo-Fi 스피커");
    });
  });

  describe("2. 상품 정보 및 재고 관리", () => {
    it("초기 재고가 0인 에러 방지 노트북 파우치는 품절 표시되어야 함", () => {
      const options = container.querySelectorAll("option");
      const product4Option = Array.from(options).find((option) =>
        option.textContent.includes("에러 방지 노트북 파우치")
      );

      expect(product4Option.textContent).toContain("품절");
      expect(product4Option.disabled).toBe(true);
    });

    it("재고가 부족한 상품은 재고 경고가 표시되어야 함", async () => {
      // "코딩할 때 듣는 Lo-Fi 스피커"를 많이 구매해서 재고를 줄임
      await addItemsToCart("p5", 8);
      await waitForUpdate();

      // 재고 부족 메시지 확인
      expect(container.textContent).toContain("재고 부족");
    });
  });

  describe("3. 장바구니 기능", () => {
    it("상품을 장바구니에 추가할 수 있어야 함", async () => {
      await addItemsToCart("p1", 1);
      await waitForUpdate();

      expect(container.textContent).toContain("버그 없애는 키보드");
      expect(container.textContent).toContain("1 items in cart");
    });

    it("장바구니에서 상품 수량을 증가/감소할 수 있어야 함", async () => {
      await addItemsToCart("p1", 2);
      await waitForUpdate();

      // 수량 증가
      const increaseButton = container.querySelector(
        'button[class*="quantity-change"]:last-of-type'
      );
      if (increaseButton) {
        increaseButton.click();
        await waitForUpdate();
        expect(container.textContent).toContain("3 items in cart");
      }

      // 수량 감소
      const decreaseButton = container.querySelector(
        'button[class*="quantity-change"]:first-of-type'
      );
      if (decreaseButton) {
        decreaseButton.click();
        await waitForUpdate();
        expect(container.textContent).toContain("2 items in cart");
      }
    });

    it("장바구니에서 상품을 제거할 수 있어야 함", async () => {
      await addItemsToCart("p1", 2);
      await waitForUpdate();

      const removeButton = container.querySelector(
        'button[class*="remove-item"]'
      );
      if (removeButton) {
        removeButton.click();
        await waitForUpdate();
        expect(container.textContent).toContain("0 items in cart");
      }
    });

    it("빈 장바구니일 때 안내 메시지가 표시되어야 함", () => {
      expect(container.textContent).toContain("장바구니가 비어있습니다");
    });
  });

  describe("4. 할인 정책", () => {
    it("개별 상품 10개 이상 구매 시 할인이 적용되어야 함", async () => {
      await addItemsToCart("p1", 10);
      await waitForUpdate();

      expect(container.textContent).toContain("10개↑");
      expect(container.textContent).toContain("-10%");
    });

    it("대량구매 할인 (30개 이상)이 적용되어야 함", async () => {
      await addItemsToCart("p1", 15);
      await addItemsToCart("p2", 15);
      await waitForUpdate();

      expect(container.textContent).toContain("🎉 대량구매 할인");
      expect(container.textContent).toContain("-25%");
    });

    it("화요일 추가 할인이 적용되어야 함", async () => {
      await addItemsToCart("p1", 5);
      await waitForUpdate();

      expect(container.textContent).toContain("🌟 화요일 추가 할인");
      expect(container.textContent).toContain("Tuesday Special");
    });
  });

  describe("5. 포인트 시스템", () => {
    it("기본 포인트 적립이 계산되어야 함", async () => {
      await addItemsToCart("p1", 1);
      await waitForUpdate();

      expect(container.textContent).toContain("적립 포인트");
    });

    it("화요일 포인트 2배 적립이 적용되어야 함", async () => {
      await addItemsToCart("p1", 1);
      await waitForUpdate();

      expect(container.textContent).toContain("화요일 2배");
    });
  });

  describe("6. 주문 요약", () => {
    it("소계가 정확히 계산되어야 함", async () => {
      await addItemsToCart("p1", 2);
      await waitForUpdate();

      expect(container.textContent).toContain("Subtotal");
      expect(container.textContent).toContain("₩20,000");
    });

    it("최종 총계가 표시되어야 함", async () => {
      await addItemsToCart("p1", 1);
      await waitForUpdate();

      expect(container.textContent).toContain("Total");
    });

    it("무료배송 안내가 표시되어야 함", () => {
      expect(container.textContent).toContain("Free shipping on all orders");
      expect(container.textContent).toContain(
        "Earn loyalty points with purchase"
      );
    });
  });

  describe("7. 모달 기능", () => {
    it("이용 안내 모달 요소가 존재해야 함", () => {
      // 모달 토글 버튼 확인
      const modalButton = container.querySelector(
        'button[class*="fixed top-4 right-4"]'
      );
      expect(modalButton).toBeTruthy();
    });
  });
});
