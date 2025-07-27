# Story 5.5: 상태 통합 및 옵저버 패턴

## Story Overview

**As a** 개발자  
**I want** 모든 상태 변경을 감지하고 반응하는 시스템  
**So that** 상태 변경 시 필요한 컴포넌트만 업데이트할 수 있다

## Story Points: 9

## Epic: Epic 5 - 상태 관리 구조화

## Problem Statement

### 현재 문제

`main.basic.js`에서 상태 변경과 UI 업데이트가 수동으로 연결:

```javascript
// 현재: 수동 상태 동기화
function addToCart(product) {
  // 1. 데이터 변경
  cartItems.push(product);
  bonusPts += calculatePoints(product);

  // 2. UI 수동 업데이트 (누락 가능)
  updateCartDisplay();
  updateOrderSummary();
  updateStockInfo();
  updateNotifications();
  // 어떤 업데이트를 빼먹을 수 있음
}

// 상태 변경 추적 불가
// 디버깅 어려움
// 컴포넌트 간 의존성 복잡
```

### 문제점 분석

1. **수동 동기화**: 상태 변경 시 관련 UI 업데이트를 수동으로 호출
2. **업데이트 누락**: 일부 UI 업데이트를 빼먹을 위험성
3. **강결합**: 비즈니스 로직과 UI 업데이트가 강하게 결합
4. **추적 불가**: 상태 변경의 원인과 영향 범위 파악 어려움

## Solution

### 새로운 구조: `src/basic/state/StateManager.js`

```javascript
export class StateManager {
  // 중앙 상태 관리
  static getState()
  static dispatch(action)
  static getStateSlice(sliceName)

  // Observer 패턴
  static subscribe(listener, selector)
  static unsubscribe(listenerId)
  static subscribeToSlice(sliceName, listener)

  // 상태 변경 추적
  static getActionHistory()
  static enableDevMode()
  static getStateChanges()
}
```

## Detailed Acceptance Criteria

### Task 1: StateManager 핵심 구조 생성

- [ ] `src/basic/state/StateManager.js` 파일 생성
- [ ] 중앙 상태 스토어 구현
- [ ] 액션 디스패치 시스템
- [ ] 상태 불변성 보장 메커니즘

### Task 2: Observer 패턴 구현

- [ ] `subscribe(listener, selector)` 메서드 구현
  - 상태 변경 리스너 등록
  - 선택적 상태 구독 (selector 함수)
  - 고유 리스너 ID 반환
- [ ] `unsubscribe(listenerId)` 메서드 구현
  - 리스너 등록 해제
  - 메모리 누수 방지
- [ ] `notify(action, prevState, nextState)` 내부 메서드
  - 모든 구독자에게 변경 알림
  - 변경된 부분만 감지하여 알림

### Task 3: 상태 슬라이스 관리

- [ ] 각 상태 클래스를 슬라이스로 통합
  - CartState → cart 슬라이스
  - ProductState → products 슬라이스
  - UIState → ui 슬라이스
  - DiscountState → discounts 슬라이스
- [ ] `getStateSlice(sliceName)` 구현
- [ ] `subscribeToSlice(sliceName, listener)` 구현

### Task 4: 액션 시스템 구현

- [ ] `dispatch(action)` 메서드 구현
  - 액션 타입 및 페이로드 처리
  - 해당 상태 슬라이스에 액션 전달
  - 상태 변경 후 구독자 알림
- [ ] 액션 미들웨어 시스템
  - 로깅 미들웨어
  - 비동기 액션 처리
  - 에러 핸들링 미들웨어

### Task 5: 상태 변경 추적 시스템

- [ ] `getActionHistory()` 메서드 구현
  - 모든 액션 히스토리 제공
  - 시간 순서대로 정렬
- [ ] `enableDevMode()` 개발자 모드
  - 상세한 상태 변경 로깅
  - 성능 측정 및 경고
- [ ] 상태 변경 디프 계산

### Task 6: 기존 상태 클래스 통합

- [ ] CartState를 StateManager와 연동
- [ ] ProductState를 StateManager와 연동
- [ ] UIState를 StateManager와 연동
- [ ] DiscountState를 StateManager와 연동
- [ ] 각 클래스의 Observer 기능을 StateManager로 위임

### Task 7: 자동 UI 업데이트 시스템

- [ ] 컴포넌트 자동 구독 헬퍼
- [ ] 상태 변경 시 관련 컴포넌트만 업데이트
- [ ] 배치 업데이트로 성능 최적화
- [ ] 순환 업데이트 방지

### Task 8: main.basic.js 완전 통합

- [ ] StateManager import 및 초기화
- [ ] 모든 상태 관련 전역 변수 제거
- [ ] 이벤트 핸들러에서 StateManager.dispatch 사용
- [ ] 수동 UI 업데이트 호출 제거

### Task 9: 성능 최적화

- [ ] 불필요한 리렌더링 방지
- [ ] 상태 변경 배치 처리
- [ ] 메모이제이션 및 캐싱
- [ ] 지연 구독 해제

### Task 10: 단위 테스트 작성

- [ ] `src/basic/__tests__/StateManager.test.js` 생성
- [ ] Observer 패턴 테스트
- [ ] 액션 디스패치 테스트
- [ ] 상태 통합 테스트

## Technical Requirements

### 중앙 상태 구조 설계

```javascript
// StateManager 내부 상태 구조
const centralState = {
  cart: {
    items: [],
    totals: { quantity: 0, amount: 0, bonusPoints: 0 },
  },
  products: {
    list: {},
    stockLevels: {},
  },
  ui: {
    modal: { isOpen: false, type: null },
    notifications: [],
    loading: {},
  },
  discounts: {
    flashSale: { isActive: false },
    recommendDiscount: { isActive: false },
    tuesdayDiscount: { isActive: false },
  },
  meta: {
    lastAction: null,
    actionHistory: [],
    version: 1,
  },
};
```

### 액션 구조 정의

```javascript
// 표준 액션 형식
const action = {
  type: 'CART_ADD_ITEM',
  payload: { product, quantity },
  meta: {
    timestamp: Date.now(),
    source: 'user_interaction',
  },
};
```

### API 설계

```javascript
// 사용 예시
import { StateManager } from './state/StateManager.js';

// 상태 변경
StateManager.dispatch({
  type: 'CART_ADD_ITEM',
  payload: { product, quantity: 2 },
});

// 상태 구독
const unsubscribe = StateManager.subscribe(
  (action, state) => {
    console.log('State changed:', action.type);
    updateUI();
  },
  state => state.cart
); // cart 슬라이스만 구독

// 현재 상태 조회
const currentState = StateManager.getState();
const cartState = StateManager.getStateSlice('cart');
```

### Dependencies

- Story 5.1-5.4 완료 (모든 상태 클래스)
- Observer 패턴 라이브러리 또는 직접 구현

### Performance

- 상태 변경 배치 처리
- 선택적 구독으로 불필요한 업데이트 방지
- 상태 변경 디프 최적화

## Definition of Done

- [ ] StateManager 클래스 완성
- [ ] Observer 패턴 정상 동작
- [ ] 모든 상태 클래스 통합 완료
- [ ] 자동 UI 업데이트 시스템 구축
- [ ] main.basic.js 전역 변수 완전 제거
- [ ] 674개 기존 테스트 모두 통과
- [ ] StateManager 단위 테스트 작성
- [ ] 상태 변경 추적 시스템 동작

## Edge Cases & Special Handling

### Observer 패턴 관리

1. **메모리 누수**: 구독 해제되지 않은 리스너들
2. **순환 의존성**: 상태 변경이 다른 상태 변경을 유발
3. **무한 루프**: 잘못된 구독으로 인한 무한 업데이트
4. **동시성**: 빠른 연속 상태 변경 처리

### 상태 동기화

- 여러 상태 슬라이스 간 일관성 유지
- 액션 처리 중 에러 발생 시 롤백
- 상태 변경 순서 보장

### 성능 고려사항

- 대량 상태 변경 시 배치 처리
- 자주 변경되는 상태의 효율적 처리
- 메모리 사용량 최적화

## Implementation Notes

- Redux DevTools와 유사한 디버깅 도구 고려
- 상태 변경은 불변성 원칙 엄격 적용
- 액션은 순수 객체로만 구성
- 비동기 액션은 별도 미들웨어로 처리

## Test Scenarios

### 단위 테스트 시나리오

1. **상태 구독/해제**: Observer 패턴 정상 동작
2. **액션 디스패치**: 액션에 따른 상태 변경
3. **상태 통합**: 여러 슬라이스 간 상호작용
4. **성능 테스트**: 대량 상태 변경 처리
5. **에러 처리**: 잘못된 액션 및 상태 처리

### 통합 테스트 시나리오

1. **전체 워크플로**: 상품 추가부터 결제까지 전 과정
2. **실시간 업데이트**: 할인 타이머와 UI 동기화
3. **에러 복구**: 상태 불일치 시 자동 복구

## Integration Points

### 기존 코드와의 연동

```javascript
// Before: 수동 상태 관리
function addToCart(product) {
  cartItems.push(product);
  updateCartDisplay();
  updateOrderSummary();
}

// After: 중앙 상태 관리
function addToCart(product) {
  StateManager.dispatch({
    type: 'CART_ADD_ITEM',
    payload: { product, quantity: 1 },
  });
  // UI 자동 업데이트됨
}
```

### 컴포넌트 자동 구독

```javascript
// 컴포넌트 자동 구독 헬퍼
export function connectComponent(component, selector) {
  const unsubscribe = StateManager.subscribe((action, state) => component.render(), selector);

  // 컴포넌트 정리 시 자동 구독 해제
  return unsubscribe;
}
```

## Risks & Mitigation

- **위험**: 과도한 추상화로 인한 복잡성 증가
- **완화**: 단계적 도입 및 명확한 API 설계

- **위험**: 성능 저하 (모든 상태 변경 추적)
- **완화**: 선택적 구독 및 최적화된 변경 감지

## Related Stories

- Story 5.1: 장바구니 상태 관리
- Story 5.2: 상품 및 재고 상태 관리
- Story 5.3: UI 상태 관리
- Story 5.4: 할인 및 이벤트 상태 관리

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Story 5.1-5.4 모든 상태 클래스 완성
- Observer 패턴 구현
- 액션 시스템 설계

### Success Criteria

- 완전한 중앙 상태 관리 구현
- 자동 UI 업데이트 시스템
- 모든 전역 변수 제거 완료
- 674개 테스트 통과 유지
