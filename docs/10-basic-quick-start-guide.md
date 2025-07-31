# Basic 모듈 퀵 스타트 가이드

## 1. 시작하기

이 가이드는 새로운 개발자가 `/src/basic` 모듈을 빠르게 이해하고 개발을 시작할 수 있도록 도와줍니다.

## 2. 프로젝트 구조 이해

### 2.1 핵심 디렉토리

```
src/basic/
├── services/    # 비즈니스 로직
├── ui/         # 사용자 인터페이스
├── utils/      # 유틸리티 함수
├── constants/  # 상수 정의
├── app/        # 애플리케이션 로직
└── main.basic.js  # 진입점
```

### 2.2 주요 파일 역할

- **`main.basic.js`**: 애플리케이션 시작점
- **`services/`**: 순수한 비즈니스 로직
- **`ui/`**: 모든 UI 관련 코드
- **`utils/`**: 재사용 가능한 헬퍼 함수
- **`constants/`**: 설정값과 템플릿

## 3. 개발 환경 설정

### 3.1 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 3.2 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

### 3.3 테스트 실행

```bash
npm test
# 또는
pnpm test
```

## 4. 첫 번째 기능 추가하기

### 4.1 새로운 상품 추가

#### 1단계: 상품 서비스 수정

```javascript
// src/basic/services/productService.js
export function initializeProductList() {
  return [
    // 기존 상품들...
    {
      id: "p6",
      name: "새로운 상품",
      val: 15000,
      originalVal: 15000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
  ];
}
```

#### 2단계: UI 업데이트

```javascript
// src/basic/ui/productUI.js
function createProductOptionTemplate(product) {
  // 기존 로직...

  // 새로운 상품에 대한 특별 처리 추가
  if (product.id === "p6") {
    displayText += " 🆕"; // 새 상품 표시
  }

  return bindTemplate(PRODUCT_OPTION_NORMAL_TEMPLATE, {
    productId: product.id,
    displayText,
  });
}
```

#### 3단계: 테스트 작성

```javascript
// src/basic/__tests__/basic.test.js
it("새로운 상품이 올바르게 표시되어야 함", () => {
  const options = Array.from(sel.options);
  const newProductOption = options.find((opt) => opt.value === "p6");

  expect(newProductOption).toBeTruthy();
  expect(newProductOption.textContent).toContain("새로운 상품");
  expect(newProductOption.textContent).toContain("🆕");
});
```

### 4.2 새로운 할인 정책 추가

#### 1단계: 상수 정의

```javascript
// src/basic/constants/productConstants.js
export const NEW_DISCOUNT_RATE = 0.15; // 15% 할인
export const NEW_DISCOUNT_THRESHOLD = 5; // 5개 이상 구매 시
```

#### 2단계: 비즈니스 로직 추가

```javascript
// src/basic/utils/businessLogic.js
function calculateNewDiscount(cartItemInfo, productList) {
  let totalQuantity = 0;
  for (const item of cartItemInfo) {
    totalQuantity += item.quantity;
  }

  if (totalQuantity >= NEW_DISCOUNT_THRESHOLD) {
    return NEW_DISCOUNT_RATE;
  }

  return 0;
}
```

#### 3단계: UI 업데이트

```javascript
// src/basic/ui/eventUI.js
function updateNewDiscountInfo(calculationResult) {
  const discountInfo = document.getElementById("new-discount-info");
  if (!discountInfo) return;

  if (calculationResult.newDiscountRate > 0) {
    discountInfo.textContent = `새로운 할인: ${calculationResult.newDiscountRate * 100}%`;
    discountInfo.style.display = "block";
  } else {
    discountInfo.style.display = "none";
  }
}
```

## 5. 디버깅 가이드

### 5.1 콘솔 로그 활용

```javascript
// 개발 중 디버깅을 위한 로그
console.log("Cart Items:", cartItems);
console.log("Product List:", productList);
console.log("App State:", appState);
```

### 5.2 브라우저 개발자 도구

1. **Elements 탭**: DOM 구조 확인
2. **Console 탭**: 로그 및 에러 확인
3. **Network 탭**: API 호출 확인
4. **Sources 탭**: 코드 디버깅

### 5.3 테스트 디버깅

```bash
# 특정 테스트만 실행
npm test -- --grep "새로운 상품"

# 상세 로그와 함께 실행
npm test -- --verbose
```

## 6. 코드 스타일 가이드

### 6.1 함수 작성 규칙

```javascript
/**
 * 함수 설명
 * @param {string} param1 - 매개변수 설명
 * @param {number} param2 - 매개변수 설명
 * @returns {Object} 반환값 설명
 */
export function exampleFunction(param1, param2) {
  // 함수 구현
  return result;
}
```

### 6.2 변수 명명 규칙

```javascript
// ✅ 좋은 예
const productList = [];
const isTuesday = new Date().getDay() === 2;
const calculateTotalAmount = () => {};

// ❌ 나쁜 예
const pl = [];
const t = new Date().getDay() === 2;
const calc = () => {};
```

### 6.3 에러 처리

```javascript
try {
  const result = calculateCartTotal(cartItems, productList, appState);
  updateOrderSummary(result, appState);
} catch (error) {
  console.error("장바구니 계산 중 오류 발생:", error);
  // 사용자에게 에러 메시지 표시
  showErrorMessage("계산 중 오류가 발생했습니다.");
}
```

## 7. 성능 최적화 팁

### 7.1 DOM 조작 최소화

```javascript
// ✅ 좋은 예: DocumentFragment 사용
const fragment = document.createDocumentFragment();
cartItems.forEach((item) => {
  const element = createCartItemElement(item);
  fragment.appendChild(element);
});
cartDisplay.appendChild(fragment);

// ❌ 나쁜 예: 개별 추가
cartItems.forEach((item) => {
  const element = createCartItemElement(item);
  cartDisplay.appendChild(element); // 매번 DOM 업데이트
});
```

### 7.2 이벤트 위임 활용

```javascript
// ✅ 좋은 예: 이벤트 위임
cartDisplay.addEventListener("click", (event) => {
  if (event.target.matches(".quantity-change")) {
    handleQuantityChange(event, appState);
  }
});

// ❌ 나쁜 예: 개별 이벤트 리스너
cartItems.forEach((item) => {
  item.querySelector(".quantity-change").addEventListener("click", handleQuantityChange);
});
```

## 8. 테스트 작성 가이드

### 8.1 단위 테스트 예제

```javascript
describe("새로운 할인 정책", () => {
  it("5개 이상 구매 시 15% 할인이 적용되어야 함", () => {
    const cartItems = [
      { id: "p1", quantity: 3 },
      { id: "p2", quantity: 2 },
    ];

    const result = calculateNewDiscount(cartItems, productList);
    expect(result).toBe(0.15);
  });

  it("5개 미만 구매 시 할인이 적용되지 않아야 함", () => {
    const cartItems = [
      { id: "p1", quantity: 2 },
      { id: "p2", quantity: 1 },
    ];

    const result = calculateNewDiscount(cartItems, productList);
    expect(result).toBe(0);
  });
});
```

### 8.2 통합 테스트 예제

```javascript
describe("새로운 상품 추가 통합 테스트", () => {
  it("새로운 상품이 장바구니에 추가되어야 함", () => {
    // 상품 선택
    sel.value = "p6";
    addBtn.click();

    // 장바구니에 추가되었는지 확인
    const cartItem = cartDisplay.querySelector("#p6");
    expect(cartItem).toBeTruthy();

    // 수량이 1인지 확인
    const quantity = getCartItemQuantity(cartDisplay, "p6");
    expect(quantity).toBe(1);
  });
});
```

## 9. 배포 준비

### 9.1 빌드 최적화

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

### 9.2 환경 변수 설정

```javascript
// .env 파일
VITE_APP_TITLE=Hanghae Online Store
VITE_API_URL=https://api.example.com
```

### 9.3 성능 체크

```bash
# 번들 크기 분석
npm run analyze

# 성능 테스트
npm run test:performance
```

## 10. 문제 해결

### 10.1 자주 발생하는 문제들

#### 문제: Import 에러

```bash
# 해결 방법
npm install
npm run dev
```

#### 문제: 테스트 실패

```bash
# 해결 방법
npm test -- --watch
# 실패한 테스트만 다시 실행
```

#### 문제: UI가 업데이트되지 않음

```javascript
// 해결 방법: 강제 리렌더링
function forceRerender() {
  updateSelectOptions(selector, productList);
  updateStockInfo(productList);
  updatePricesInCart(cartItems, productList);
}
```

### 10.2 디버깅 체크리스트

- [ ] 콘솔 에러 확인
- [ ] 네트워크 요청 확인
- [ ] DOM 요소 존재 여부 확인
- [ ] 상태 값 확인
- [ ] 이벤트 리스너 확인

## 11. 추가 리소스

### 11.1 관련 문서

- [아키텍처 가이드](./08-basic-architecture-guide.md)
- [API 참조 문서](./09-basic-api-reference.md)
- [PRD 문서](./01-PRD.md)

### 11.2 유용한 도구

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Vitest**: 테스트 프레임워크
- **Vite**: 빌드 도구

### 11.3 커뮤니티

- 프로젝트 이슈 트래커 활용
- 코드 리뷰 프로세스 참여
- 팀 내 기술 공유 세션 참여

이 퀵 스타트 가이드를 통해 새로운 개발자도 빠르게 프로젝트에 참여할 수 있습니다. 추가 질문이나 도움이 필요하면 팀원들에게 언제든 문의하세요!
