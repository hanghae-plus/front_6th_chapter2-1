# Story 5.4: 할인 및 이벤트 상태 관리

## Story Overview

**As a** 비즈니스 관리자  
**I want** 할인 이벤트 상태가 정확히 관리되는 시스템  
**So that** 번개세일과 추천할인이 정확한 타이밍에 작동한다

## Story Points: 6

## Epic: Epic 5 - 상태 관리 구조화

## Problem Statement

### 현재 문제

`main.basic.js`에서 할인 이벤트가 분산되어 관리:

```javascript
// 현재: 분산된 할인 상태 관리
let lightningQty = 0;
let suggestDay = null;
let selectedItemId = null;

// 번개세일 타이머가 여러 곳에서 관리
let saleTimer = null;
setInterval(() => {
  // 복잡한 번개세일 로직
}, 30000);

// 화요일 할인 체크가 분산
function isTuesDiscountDay() {
  // 날짜 계산 로직
}

// 추천할인 상태 추적 어려움
function applySuggestDiscount() {
  // 상태 변경 추적 불가
}
```

### 문제점 분석

1. **타이밍 불일치**: 각 할인 이벤트의 시작/종료 시점 추적 어려움
2. **상태 분산**: 할인 정보가 여러 전역 변수에 흩어져 있음
3. **동시성 문제**: 여러 할인이 동시에 적용될 때 우선순위 불명확
4. **추적 불가**: 할인 적용 이력과 원인 파악 어려움

## Solution

### 새로운 구조: `src/basic/state/DiscountState.js`

```javascript
export class DiscountState {
  // 할인 상태 관리
  static getState()
  static startFlashSale(productId)
  static endFlashSale()
  static startRecommendDiscount(productId)
  static endRecommendDiscount()
  static checkTuesdayDiscount()

  // 선택자 (Selectors)
  static getActiveDiscounts()
  static getFlashSaleInfo()
  static getRecommendDiscountInfo()
  static isTuesdayDiscountActive()
  static getDiscountForProduct(productId)

  // 이벤트 및 구독
  static subscribe(listener)
  static unsubscribe(listener)
}
```

## Detailed Acceptance Criteria

### Task 1: DiscountState 기본 구조 생성

- [ ] `src/basic/state/DiscountState.js` 파일 생성
- [ ] 내부 상태 객체 정의 (flashSale, recommendDiscount, tuesdayDiscount)
- [ ] Observer 패턴 기본 구조 구현
- [ ] 할인 타이머 관리 시스템

### Task 2: 번개세일 상태 관리

- [ ] `startFlashSale(productId)` 메서드 구현
  - 번개세일 상품 설정
  - 30초 타이머 시작
  - 기존 번개세일 종료 처리
- [ ] `endFlashSale()` 메서드 구현
  - 번개세일 상태 초기화
  - 타이머 정리
  - 상품 상태 복원
- [ ] 번개세일 자동 종료 메커니즘
- [ ] 번개세일 중복 방지 로직

### Task 3: 추천할인 상태 관리

- [ ] `startRecommendDiscount(productId)` 메서드 구현
  - 추천할인 상품 설정
  - 기간 설정 (기본 60초)
  - 추천할인 상태 업데이트
- [ ] `endRecommendDiscount()` 메서드 구현
  - 추천할인 상태 초기화
  - 관련 타이머 정리
- [ ] 추천할인 자동 관리
- [ ] 추천할인 우선순위 처리

### Task 4: 화요일 할인 상태 관리

- [ ] `checkTuesdayDiscount()` 메서드 구현
  - 현재 날짜가 화요일인지 확인
  - 할인 적용 가능 여부 반환
- [ ] 화요일 할인 자동 감지
- [ ] 날짜 변경 시 상태 업데이트

### Task 5: 할인 선택자 구현

- [ ] `getActiveDiscounts()` 선택자 구현
  - 현재 활성화된 모든 할인 반환
- [ ] `getFlashSaleInfo()` 선택자 구현
  - 번개세일 정보 및 남은 시간
- [ ] `getRecommendDiscountInfo()` 선택자 구현
  - 추천할인 정보 및 대상 상품
- [ ] `getDiscountForProduct(productId)` 선택자 구현
  - 특정 상품에 적용 가능한 할인

### Task 6: 할인 우선순위 및 조합

- [ ] 할인 적용 우선순위 정의
  - 번개세일 > 추천할인 > 화요일 할인
- [ ] 할인 중복 적용 규칙
- [ ] 최대 할인율 제한

### Task 7: 타이머 시스템 구현

- [ ] 번개세일 30초 타이머
- [ ] 추천할인 60초 타이머
- [ ] 실시간 남은 시간 계산
- [ ] 타이머 정리 및 메모리 관리

### Task 8: main.basic.js 통합

- [ ] DiscountState import 추가
- [ ] 기존 할인 관련 전역 변수 제거
- [ ] 기존 할인 함수들 DiscountState 사용으로 변경
- [ ] 타이머 관련 코드 DiscountState로 이전

### Task 9: UI 컴포넌트 구독 설정

- [ ] ProductSelector에서 할인 상태 구독
- [ ] OrderSummary에서 할인 정보 구독
- [ ] 할인 알림 자동 표시

### Task 10: 단위 테스트 작성

- [ ] `src/basic/__tests__/DiscountState.test.js` 생성
- [ ] 번개세일 라이프사이클 테스트
- [ ] 추천할인 라이프사이클 테스트
- [ ] 할인 우선순위 테스트

## Technical Requirements

### 상태 구조 설계

```javascript
// DiscountState 내부 상태 구조
const state = {
  flashSale: {
    isActive: false,
    productId: null,
    startedAt: null,
    duration: 30000, // 30초
    timerId: null,
    remainingTime: 0,
  },
  recommendDiscount: {
    isActive: false,
    productId: null,
    startedAt: null,
    duration: 60000, // 60초
    timerId: null,
    remainingTime: 0,
  },
  tuesdayDiscount: {
    isActive: false,
    checkedAt: null,
    discountRate: 0.1, // 10%
  },
  settings: {
    flashSaleDuration: 30000,
    recommendDuration: 60000,
    flashSaleInterval: 30000,
    maxDiscountRate: 0.5,
  },
};
```

### API 설계

```javascript
// 사용 예시
import { DiscountState } from './state/DiscountState.js';

// 번개세일 시작
DiscountState.startFlashSale('p1');

// 활성 할인 조회
const activeDiscounts = DiscountState.getActiveDiscounts();
const flashSaleInfo = DiscountState.getFlashSaleInfo();

// 상품별 할인 확인
const discount = DiscountState.getDiscountForProduct('p1');
```

### Dependencies

- Epic 3 완료 (DiscountEngine)
- EventTimings.js (타이밍 설정)
- DiscountPolicies.js (할인 정책)

### Performance

- 효율적인 타이머 관리
- 불필요한 날짜 계산 최소화
- 할인 계산 캐싱

## Definition of Done

- [ ] DiscountState 클래스 완성
- [ ] 모든 할인 이벤트 액션 구현
- [ ] 타이머 시스템 정상 동작
- [ ] main.basic.js 할인 관련 전역 변수 제거
- [ ] 674개 기존 테스트 모두 통과
- [ ] DiscountState 단위 테스트 작성
- [ ] 할인 이벤트 추적 가능

## Edge Cases & Special Handling

### 타이머 관리 시나리오

1. **페이지 이탈**: 사용자가 페이지를 벗어날 때 타이머 정리
2. **브라우저 최소화**: 백그라운드에서도 정확한 시간 계산
3. **동시 할인**: 여러 할인이 동시에 활성화되는 경우
4. **타이머 오차**: 시스템 지연으로 인한 타이머 오차 보정

### 할인 적용 시나리오

1. **할인 전환**: 한 할인에서 다른 할인으로 바뀔 때
2. **할인 중복**: 여러 할인 조건을 만족하는 경우
3. **할인 만료**: 할인 종료 시점의 정확한 처리
4. **재고 부족**: 할인 상품이 품절된 경우

### 날짜/시간 처리

- 시간대 변경 대응
- 서버 시간과 클라이언트 시간 동기화
- 자정 넘김 시 화요일 할인 처리

## Implementation Notes

- 모든 타이머는 정확한 시간 계산을 위해 Date 객체 사용
- 할인 상태 변경은 원자적 연산으로 처리
- 브라우저 탭 비활성화 시에도 정확한 할인 관리
- 할인 이벤트 로깅 기능 포함

## Test Scenarios

### 단위 테스트 시나리오

1. **번개세일 라이프사이클**: 시작/종료 및 자동 만료
2. **추천할인 관리**: 활성화/비활성화 및 타이머
3. **화요일 할인**: 날짜 확인 및 할인 적용
4. **할인 우선순위**: 여러 할인 동시 적용 시 우선순위
5. **타이머 정확성**: 정확한 남은 시간 계산

### 통합 테스트 시나리오

1. **DiscountEngine 연동**: 할인 상태에 따른 가격 계산
2. **UI 업데이트**: 할인 상태 변경 시 화면 반영
3. **실시간 업데이트**: 타이머에 따른 실시간 상태 변경

## Integration Points

### 기존 코드와의 연동

```javascript
// Before: 분산된 할인 관리
lightningQty = 1;
setInterval(lightningInterval, 30000);

// After: DiscountState 액션 사용
DiscountState.startFlashSale(selectedProductId);
```

### 컴포넌트 구독 패턴

```javascript
// ProductSelector.js
export class ProductSelector {
  static init() {
    DiscountState.subscribe((action, state) => {
      if (action.type === 'FLASH_SALE_STARTED') {
        this.updateDiscountDisplay();
      }
    });
  }
}
```

## Risks & Mitigation

- **위험**: 타이머 동기화 문제로 인한 할인 오류
- **완화**: 서버 시간 기준 동기화 및 오차 보정

- **위험**: 메모리 누수 (타이머 정리 누락)
- **완화**: 자동 정리 메커니즘 및 페이지 언로드 이벤트 처리

## Related Stories

- Story 5.1: 장바구니 상태 관리 (할인 가격 연동)
- Story 5.2: 상품 및 재고 상태 관리 (할인 상품 정보)
- Story 5.5: 상태 통합 및 옵저버 패턴

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 3 DiscountEngine
- EventTimings, DiscountPolicies
- Observer 패턴 구현

### Success Criteria

- 할인 이벤트 중앙 관리 구현
- 정확한 타이머 시스템 동작
- 674개 테스트 통과 유지
