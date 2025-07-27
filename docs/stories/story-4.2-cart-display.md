# Story 4.2: 장바구니 디스플레이 컴포넌트

## Story Overview

**As a** 사용자  
**I want** 장바구니 아이템들을 명확하게 볼 수 있는 디스플레이  
**So that** 구매할 상품들과 수량, 가격을 쉽게 확인하고 수정할 수 있다

## Story Points: 8

## Epic: Epic 4 - UI 컴포넌트화 및 DOM 분리

## Problem Statement

### 현재 문제

`main.basic.js`에서 장바구니 아이템 생성이 매우 복잡하고 중복:

```javascript
// 현재: main.basic.js 내 복잡한 장바구니 아이템 생성
function doAddToCart(selectedValue) {
  // 복잡한 장바구니 아이템 HTML 생성
  cartItemDiv = document.createElement('div');
  cartItemDiv.className = 'bg-white border border-gray-200 p-4 rounded-lg mb-2';
  cartItemDiv.id = selectedProduct.id;

  cartItemDiv.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">${selectedProduct.name}</h3>
        <div class="text-sm text-gray-600 mt-1">
          <span class="text-lg font-medium text-gray-900">₩${selectedProduct.val.toLocaleString()}</span>
          <!-- 복잡한 가격 및 할인 표시 로직 -->
        </div>
      </div>
      <button type="button" class="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center bg-gray-50 rounded-lg">
        <button type="button" class="decrease-btn p-2 rounded-l-lg border-r border-gray-200 hover:bg-gray-200 disabled:opacity-50">-</button>
        <span class="quantity-number px-4 py-2 bg-white min-w-[3rem] text-center">${quantity}</span>
        <button type="button" class="increase-btn p-2 rounded-r-lg border-l border-gray-200 hover:bg-gray-200 disabled:opacity-50">+</button>
      </div>
    </div>
  `;
}
```

### 문제점 분석

1. **복잡한 HTML 템플릿**: 긴 innerHTML 문자열로 가독성 저하
2. **중복 코드**: 비슷한 아이템 생성 로직이 여러 곳에 분산
3. **이벤트 바인딩 복잡**: 동적 버튼들의 이벤트 처리가 복잡
4. **상태 관리 어려움**: 수량 변경, 할인 적용 등의 상태 변경 시 UI 업데이트 복잡
5. **테스트 불가능**: UI 생성 로직이 비즈니스 로직과 혼재

## Solution

### 새로운 구조: `src/basic/components/CartDisplay.js` + `CartItem.js`

```javascript
// CartDisplay.js - 장바구니 전체 컨테이너
export class CartDisplay {
  static render(cartItems, options = {})
  static generateEmptyState()
}

// CartItem.js - 개별 장바구니 아이템
export class CartItem {
  static render(item, options = {})
  static generateQuantityControls(item)
  static generatePriceDisplay(item, discounts)
  static generateRemoveButton(item)
}
```

## Detailed Acceptance Criteria

### Task 1: CartItem 컴포넌트 기본 구조 생성

- [x] `src/basic/components/CartItem.js` 파일 생성
- [x] CartItem 클래스 및 JSDoc 타입 정의
- [x] 기본 render() 메서드 구현
- [x] 아이템 데이터 구조 정의

### Task 2: CartItem render() 메서드 구현

- [x] `render(item, options)` 메서드 구현
  - 입력: `item` 객체 (상품정보, 수량, 할인정보)
  - 출력: 완전한 장바구니 아이템 HTML
  - 기존 아이템 카드와 100% 동일한 구조

### Task 3: 수량 조절 컨트롤 구현

- [x] `generateQuantityControls(item)` 메서드 구현
  - +/- 버튼 HTML 생성
  - 현재 수량 표시
  - 재고 한도에 따른 버튼 활성화/비활성화
  - data-\* 속성으로 상품 ID 저장

### Task 4: 가격 표시 로직 구현

- [x] `generatePriceDisplay(item, discounts)` 메서드 구현
  - 원가, 할인가 표시
  - 할인률 표시 (10개 이상 구매 시)
  - 취소선 스타일 적용
  - 가격 포맷팅 (천 단위 구분자)

### Task 5: 제거 버튼 구현

- [x] `generateRemoveButton(item)` 메서드 구현
  - Remove 버튼 HTML 생성
  - 호버 스타일 적용
  - data-product-id 속성 설정

### Task 6: CartDisplay 컨테이너 구현

- [x] `src/basic/components/CartDisplay.js` 파일 생성
- [x] `render(cartItems, options)` 메서드 구현
  - 여러 CartItem 조합하여 전체 장바구니 렌더링
  - 빈 장바구니 상태 처리
  - 컨테이너 스타일링

### Task 7: 빈 장바구니 상태 처리

- [x] `generateEmptyState()` 메서드 구현
  - 빈 장바구니 메시지 표시
  - 쇼핑 유도 메시지
  - 적절한 스타일링

### Task 8: 이벤트 핸들러 인터페이스 설계

- [x] 수량 변경 이벤트 인터페이스
- [x] 제거 버튼 이벤트 인터페이스
- [x] main.basic.js와의 콜백 연동

### Task 9: main.basic.js 통합

- [x] CartDisplay, CartItem import 추가
- [x] 기존 장바구니 생성 로직 제거
- [x] 컴포넌트 기반 렌더링으로 대체
- [x] 이벤트 바인딩 로직 업데이트

### Task 10: 단위 테스트 작성

- [x] `src/basic/__tests__/CartItem.test.js` 생성
- [x] `src/basic/__tests__/CartDisplay.test.js` 생성
- [x] 컴포넌트 렌더링 테스트
- [x] 할인 적용 시나리오 테스트

## Technical Requirements

### CartItem 데이터 구조

```javascript
// CartItem 입력 데이터 구조
const cartItemData = {
  product: {
    id: 'p1',
    name: '무선 키보드',
    val: 100000,
    originalVal: 100000,
  },
  quantity: 2,
  discounts: {
    individual: { rate: 0.1, amount: 20000 },
    bulk: { applied: false },
    tuesday: { applied: true, rate: 0.1 },
  },
  subtotal: 180000,
  stock: 15,
};
```

### 컴포넌트 API 설계

```javascript
// CartItem 사용 예시
const itemHTML = CartItem.render(cartItemData, {
  showDiscounts: true,
  allowQuantityChange: true,
  onQuantityChange: handleQuantityChange,
  onRemove: handleRemoveItem,
});

// CartDisplay 사용 예시
const cartHTML = CartDisplay.render(cartItems, {
  emptyMessage: '장바구니가 비어있습니다',
  className: 'cart-container',
});
```

### 예상 HTML 출력

```html
<!-- CartItem 출력 예시 -->
<div class="bg-white border border-gray-200 p-4 rounded-lg mb-2" data-product-id="p1">
  <div class="flex justify-between items-start mb-3">
    <div class="flex-1">
      <h3 class="font-medium text-gray-900">무선 키보드</h3>
      <div class="text-sm text-gray-600 mt-1">
        <span class="text-lg font-medium text-gray-900">₩90,000</span>
        <span class="text-sm text-gray-500 line-through ml-2">₩100,000</span>
        <span class="text-sm text-green-600 ml-2">(10% 할인)</span>
      </div>
    </div>
    <button
      type="button"
      class="remove-btn text-red-600 hover:text-red-800 text-sm font-medium"
      data-product-id="p1"
    >
      Remove
    </button>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center bg-gray-50 rounded-lg">
      <button
        type="button"
        class="decrease-btn p-2 rounded-l-lg border-r border-gray-200 hover:bg-gray-200"
        data-product-id="p1"
      >
        -
      </button>
      <span class="quantity-number px-4 py-2 bg-white min-w-[3rem] text-center">2</span>
      <button
        type="button"
        class="increase-btn p-2 rounded-r-lg border-l border-gray-200 hover:bg-gray-200"
        data-product-id="p1"
      >
        +
      </button>
    </div>
    <div class="text-right">
      <div class="text-lg font-medium">₩180,000</div>
    </div>
  </div>
</div>
```

## Definition of Done

- [x] CartItem 컴포넌트 완성
- [x] CartDisplay 컴포넌트 완성
- [x] 기존 장바구니 UI와 100% 동일
- [x] 수량 변경/제거 기능 정상 동작
- [x] 할인 정보 정확한 표시
- [x] 247개 전체 테스트 모두 통과 (기존 + 신규 50개)
- [x] CartItem/CartDisplay 단위 테스트 작성

## Edge Cases & Special Handling

### 할인 적용 시나리오

1. **개별 할인 + 화요일 할인**: 중복 할인 표시
2. **대량 구매 할인**: 개별 할인 무시 및 표시
3. **번개세일/추천할인**: 특별 할인 표시
4. **할인 없음**: 원가만 표시

### 수량 제어 시나리오

1. **재고 한도**: 재고 초과 시 + 버튼 비활성화
2. **최소 수량**: 1개 미만 시 - 버튼 비활성화
3. **수량 0**: 자동 제거 처리
4. **품절 상품**: 수량 조절 불가

### UI 상태 관리

1. **로딩 상태**: 수량 변경 중 버튼 비활성화
2. **에러 상태**: 재고 부족 시 시각적 피드백
3. **성공 상태**: 수량 변경 완료 시 애니메이션

## Implementation Notes

- 컴포넌트는 순수 함수로 구현 (상태 관리는 main.basic.js)
- CSS 클래스는 기존과 동일하게 유지 (TailwindCSS)
- 이벤트 위임 패턴 활용으로 성능 최적화
- data-\* 속성으로 상품 정보 저장

## Test Scenarios

### 단위 테스트 시나리오

1. **기본 렌더링**: 정상 아이템 데이터로 카드 생성
2. **할인 표시**: 다양한 할인 시나리오별 가격 표시 확인
3. **수량 컨트롤**: 버튼 활성화/비활성화 상태 확인
4. **빈 장바구니**: 빈 상태 메시지 표시 확인
5. **대량 아이템**: 여러 아이템이 포함된 장바구니 렌더링

## Integration Points

### main.basic.js 연동

```javascript
// Before: 복잡한 아이템 생성 로직
cartItemDiv.innerHTML = `<!-- 복잡한 HTML -->`;

// After: 컴포넌트 기반 렌더링
import { CartDisplay, CartItem } from './components/CartDisplay.js';

const updateCartDisplay = () => {
  const cartHTML = CartDisplay.render(cartItems, {
    onQuantityChange: handleQuantityChange,
    onRemove: handleRemoveItem,
  });
  cartDisp.innerHTML = cartHTML;
};
```

## Performance Considerations

- 아이템 변경 시 전체 재렌더링 최소화
- Virtual DOM 패턴으로 필요한 부분만 업데이트
- 이벤트 리스너 메모리 누수 방지

## Accessibility Features

- ARIA 라벨 적용
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 고대비 모드 지원

## Risks & Mitigation

- **위험**: 복잡한 상태 관리로 인한 UI 불일치
- **완화**: 상태 변경 시 전체 재렌더링으로 일관성 보장

- **위험**: 이벤트 바인딩 타이밍 이슈
- **완화**: 이벤트 위임 패턴으로 안정성 확보

## Related Stories

- Story 4.1: 상품 선택 컴포넌트 (추가 시 연동)
- Story 4.3: 주문 요약 컴포넌트 (가격 정보 연동)
- Story 4.5: 재고 정보 컴포넌트 (재고 확인 연동)

---

## Dev Agent Record

### Status: Ready for Review ✅

### Dependencies

- Epic 3 PriceCalculator 결과 활용
- Epic 3 StockCalculator 재고 정보 활용

### Success Criteria

- 기존 장바구니 UI와 100% 동일
- 수량 변경/제거 기능 완벽 동작
- 독립적 컴포넌트로 재사용 가능
- 복잡한 할인 시나리오 정확 표시

### File List

**Modified Files:**

- `src/basic/main.basic.js` - 복잡한 장바구니 로직을 컴포넌트 호출로 교체

**New Files:**

- `src/basic/components/CartItem.js` - 장바구니 아이템 컴포넌트 (22 tests passing)
- `src/basic/components/CartDisplay.js` - 장바구니 디스플레이 컨테이너 (28 tests passing)
- `src/basic/components/CartEventHandler.js` - 이벤트 핸들링 인터페이스
- `src/basic/__tests__/CartItem.test.js` - CartItem 단위 테스트 (22 tests)
- `src/basic/__tests__/CartDisplay.test.js` - CartDisplay 단위 테스트 (28 tests)

### Change Log

**Task 1 완료** (2024-01-XX)

- ✅ CartItem 컴포넌트 기본 구조 및 모든 메서드 구현
- ✅ 종합적인 JSDoc 타입 정의
- ✅ 22개 단위 테스트 모두 통과
- ✅ 기존 main.basic.js와 100% 호환되는 HTML 구조 생성

**Task 6-7 완료** (2024-01-XX)

- ✅ CartDisplay 컨테이너 컴포넌트 구현
- ✅ 빈 장바구니 상태 처리
- ✅ 3개 기본 테스트 통과
- ✅ CartItem과 연동되는 전체 장바구니 렌더링

**Task 8-9 완료** (2024-01-XX)

- ✅ CartEventHandler 이벤트 인터페이스 구현
- ✅ main.basic.js 복잡한 장바구니 로직 제거 (672-729 라인)
- ✅ CartItem.render()로 아이템 생성 로직 교체
- ✅ CartEventHandler로 이벤트 처리 로직 교체
- ✅ 기존 기능 100% 유지하면서 컴포넌트화 완료

**Task 10 완료** (2024-01-XX)

- ✅ CartItem 단위 테스트 22개 작성 및 통과
- ✅ CartDisplay 단위 테스트 28개 작성 및 통과
- ✅ 할인 적용 시나리오 테스트 완료
- ✅ 통합 렌더링 테스트 완료

**스토리 완료** (2024-01-XX)

- ✅ 전체 247개 테스트 통과 (기존 + 신규 50개)
- ✅ 복잡한 장바구니 로직 완전히 컴포넌트화
- ✅ 코드 중복 제거 및 재사용성 확보
- ✅ 테스트 가능한 구조로 아키텍처 개선
