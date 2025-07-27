# Story 5.1: 장바구니 상태 관리

## Story Overview

**As a** 개발자  
**I want** 장바구니 상태가 중앙에서 관리되는 시스템  
**So that** 장바구니 변경 시 모든 관련 UI가 자동으로 업데이트된다

## Story Points: 8

## Epic: Epic 5 - 상태 관리 구조화

## Problem Statement

### 현재 문제

`main.basic.js`에서 장바구니 관련 전역 변수들이 분산되어 관리:

```javascript
// 현재: 분산된 전역 변수들
let bonusPts = 0;
let prodList = [
  /* 상품 목록 */
];
let totalAmt = 0;

// 장바구니 상태가 DOM에 직접 의존
function calcCart() {
  // DOM 요소에서 장바구니 정보 수집
  let cartItems = Array.from(document.querySelectorAll('#cart-items > div'));
  // 복잡한 계산 로직
}

// 상태 변경이 여러 곳에 흩어져 있음
function addToCart(item) {
  // DOM 직접 조작
  // 전역 변수 직접 수정
}
```

### 문제점 분석

1. **상태 분산**: 장바구니 정보가 DOM, 전역변수, 계산함수에 분산
2. **동기화 문제**: 상태 변경 시 관련 UI 업데이트 누락 가능성
3. **추적 어려움**: 장바구니 상태 변경의 원인과 시점 파악 어려움
4. **테스트 불가**: DOM 의존성으로 인한 단위 테스트 어려움

## Solution

### 새로운 구조: `src/basic/state/CartState.js`

```javascript
export class CartState {
  // 장바구니 상태 관리
  static getState()
  static addItem(product, quantity)
  static updateQuantity(productId, quantity)
  static removeItem(productId)

  // 선택자 (Selectors)
  static getCartItems()
  static getTotalQuantity()
  static getTotalAmount()
  static getBonusPoints()

  // 이벤트 및 구독
  static subscribe(listener)
  static unsubscribe(listener)
}
```

## Detailed Acceptance Criteria

### Task 1: CartState 기본 구조 생성

- [ ] `src/basic/state/` 디렉토리 생성
- [ ] `src/basic/state/CartState.js` 파일 생성
- [ ] 내부 상태 객체 정의
- [ ] Observer 패턴 기본 구조 구현

### Task 2: 장바구니 아이템 관리 액션

- [ ] `addItem(product, quantity)` 메서드 구현
  - 동일 상품 수량 누적 처리
  - 재고 확인 및 제한
  - 상태 변경 이벤트 발생
- [ ] `updateQuantity(productId, quantity)` 메서드 구현
  - 수량 0일 때 아이템 제거
  - 재고 한도 체크
  - 음수 수량 방지
- [ ] `removeItem(productId)` 메서드 구현
  - 아이템 완전 제거
  - 관련 계산 업데이트

### Task 3: 상태 선택자 구현

- [ ] `getCartItems()` 선택자 구현
  - 현재 장바구니의 모든 아이템 반환
  - 상품 정보와 수량 포함된 배열
- [ ] `getTotalQuantity()` 선택자 구현
  - 전체 아이템 수량 합계
- [ ] `getTotalAmount()` 선택자 구현
  - 할인 적용 전 총 금액
- [ ] `getBonusPoints()` 선택자 구현
  - 현재 장바구니의 적립 포인트

### Task 4: 이벤트 시스템 구현

- [ ] `subscribe(listener)` 메서드 구현
  - 상태 변경 리스너 등록
  - 리스너 ID 반환
- [ ] `unsubscribe(listener)` 메서드 구현
  - 리스너 등록 해제
- [ ] `notify(action, payload)` 내부 메서드
  - 모든 구독자에게 상태 변경 알림

### Task 5: 계산 로직 통합

- [ ] PriceCalculator 연동
- [ ] DiscountEngine 연동
- [ ] PointsCalculator 연동
- [ ] StockCalculator 연동

### Task 6: main.basic.js 통합

- [ ] CartState import 추가
- [ ] 기존 전역 변수 제거
- [ ] 장바구니 관련 함수들 CartState 사용으로 변경
- [ ] DOM 이벤트 핸들러에서 CartState 액션 호출

### Task 7: UI 컴포넌트 구독 설정

- [ ] CartDisplay에서 CartState 구독
- [ ] OrderSummary에서 CartState 구독
- [ ] 자동 UI 업데이트 구현

### Task 8: 단위 테스트 작성

- [ ] `src/basic/__tests__/CartState.test.js` 생성
- [ ] 액션 메서드 테스트
- [ ] 선택자 메서드 테스트
- [ ] 이벤트 시스템 테스트

## Technical Requirements

### 상태 구조 설계

```javascript
// CartState 내부 상태 구조
const state = {
  items: [
    {
      productId: 'p1',
      product: {
        /* 상품 정보 */
      },
      quantity: 2,
      addedAt: '2024-01-01T00:00:00Z',
    },
  ],
  totals: {
    quantity: 5,
    amount: 350000,
    bonusPoints: 3500,
  },
  lastUpdated: '2024-01-01T00:00:00Z',
};
```

### API 설계

```javascript
// 사용 예시
import { CartState } from './state/CartState.js';

// 상품 추가
CartState.addItem(product, 2);

// 상태 구독
const unsubscribe = CartState.subscribe((action, state) => {
  console.log('Cart updated:', action, state);
  updateCartDisplay();
});

// 현재 상태 조회
const cartItems = CartState.getCartItems();
const total = CartState.getTotalAmount();
```

### Dependencies

- Epic 3 완료 (PriceCalculator, DiscountEngine, PointsCalculator)
- Epic 4 완료 (CartDisplay, OrderSummary 컴포넌트)

### Performance

- 상태 변경 시에만 계산 수행
- 불필요한 리렌더링 방지
- 메모이제이션 활용

## Definition of Done

- [ ] CartState 클래스 완성
- [ ] 모든 액션 및 선택자 구현
- [ ] Observer 패턴 정상 동작
- [ ] main.basic.js 전역 변수 제거
- [ ] 674개 기존 테스트 모두 통과
- [ ] CartState 단위 테스트 작성
- [ ] UI 자동 업데이트 검증

## Edge Cases & Special Handling

### 재고 부족 시나리오

1. **재고 초과 추가**: 현재 재고만큼만 추가, 알림 표시
2. **품절 상품 추가**: 추가 거부, 사용자 알림
3. **재고 변동**: 장바구니 수량이 새 재고보다 많을 때 자동 조정

### 동시성 처리

- 빠른 연속 액션에 대한 디바운싱
- 상태 변경 중 추가 변경 요청 대기
- 원자적 상태 업데이트 보장

### 데이터 무결성

- 음수 수량 방지
- 존재하지 않는 상품 처리
- 잘못된 타입 입력 검증

## Implementation Notes

- 상태는 불변성 원칙 적용 (immutable updates)
- 모든 상태 변경은 새 객체 생성
- 부작용 없는 순수 함수로 선택자 구현
- 에러 핸들링 및 로깅 포함

## Test Scenarios

### 단위 테스트 시나리오

1. **아이템 추가**: 새 상품 추가 및 기존 상품 수량 증가
2. **수량 업데이트**: 정상 수량 변경 및 0으로 설정 시 제거
3. **아이템 제거**: 특정 상품 완전 제거
4. **계산 정확성**: 총액, 수량, 포인트 계산 검증
5. **이벤트 발생**: 상태 변경 시 구독자 알림 확인
6. **재고 제한**: 재고 초과 방지 테스트

### 통합 테스트 시나리오

1. **UI 동기화**: 상태 변경 시 CartDisplay 자동 업데이트
2. **할인 적용**: DiscountEngine과 연동하여 할인 반영
3. **포인트 계산**: PointsCalculator와 연동하여 적립 포인트 계산

## Integration Points

### 기존 코드와의 연동

```javascript
// Before: 전역 변수 직접 조작
bonusPts += calculatePoints(item);
totalAmt = calculateTotal();

// After: CartState 액션 사용
CartState.addItem(product, quantity);
const total = CartState.getTotalAmount();
const points = CartState.getBonusPoints();
```

### 컴포넌트 구독 패턴

```javascript
// CartDisplay.js
export class CartDisplay {
  static init() {
    CartState.subscribe((action, state) => {
      this.render(CartState.getCartItems());
    });
  }
}
```

## Risks & Mitigation

- **위험**: 상태 마이그레이션 중 데이터 손실
- **완화**: 기존 동작과 100% 일치하는지 단계별 검증

- **위험**: 성능 저하 (불필요한 재계산)
- **완화**: 메모이제이션 및 변경 감지 최적화

## Related Stories

- Story 5.2: 상품 및 재고 상태 관리
- Story 5.3: UI 상태 관리
- Story 5.5: 상태 통합 및 옵저버 패턴

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 3 계산 로직 클래스들
- Epic 4 UI 컴포넌트들
- Observer 패턴 구현

### Success Criteria

- 전역 변수 제거 완료
- 자동 UI 업데이트 구현
- 674개 테스트 통과 유지
