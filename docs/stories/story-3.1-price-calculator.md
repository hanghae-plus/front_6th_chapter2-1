# Story 3.1: 가격 및 할인 계산 엔진

## Story Overview

**As a** 개발자  
**I want** 가격과 할인을 계산하는 독립적인 엔진  
**So that** 복잡한 할인 정책을 안정적으로 처리할 수 있다

## Story Points: 8

## Epic: Epic 3 - 비즈니스 로직 분리 및 순수 함수화

## Problem Statement

### 현재 문제

`handleCalculateCartStuff()` 함수(251줄)가 다음을 모두 처리:

- 장바구니 아이템 순회 및 DOM 조작
- 개별 상품 가격 계산
- 할인 정책 적용 (개별, 대량, 화요일)
- UI 업데이트 (할인 표시, 요약 정보)

### 문제점

- 비즈니스 로직과 DOM 조작 강결합
- 테스트하기 어려운 구조
- 할인 정책 변경 시 UI까지 영향
- 복잡한 중첩 로직으로 인한 버그 위험

## Solution

### 새로운 구조: `src/basic/calculations/PriceCalculator.js`

```javascript
// 순수 함수로 가격 계산 로직 분리
export class PriceCalculator {
  // 소계 계산
  static calculateSubtotal(cartItems)

  // 개별 상품 할인 계산
  static calculateItemDiscount(item, quantity)

  // 대량구매 할인 계산
  static calculateBulkDiscount(totalQuantity, subtotal)

  // 화요일 할인 계산
  static calculateTuesdayDiscount(subtotal, date)

  // 최종 금액 계산 (모든 할인 적용)
  static calculateFinalPrice(cartItems, date)
}
```

## Detailed Acceptance Criteria

### Task 1: PriceCalculator 모듈 생성

- [ ] `src/basic/calculations/PriceCalculator.js` 파일 생성
- [ ] JSDoc 타입 정의 추가
- [ ] 기본 클래스 구조 설정

### Task 2: 소계 계산 함수 구현

- [ ] `calculateSubtotal(cartItems)` 구현
  - 입력: `[{id, quantity, price}]` 형태의 장바구니 아이템
  - 출력: `{subtotal: number, itemTotals: [{id, total}]}`
  - 개별 상품별 합계도 함께 반환

### Task 3: 개별 할인 계산 함수 구현

- [ ] `calculateItemDiscount(item, quantity)` 구현
  - DiscountPolicies.js의 `calculateFinalDiscount` 활용
  - 10개 이상 구매 시 할인 적용
  - 출력: `{discountRate: number, discountAmount: number}`

### Task 4: 대량구매 할인 계산 함수 구현

- [ ] `calculateBulkDiscount(totalQuantity, subtotal)` 구현
  - DiscountPolicies.js의 `calculateBulkDiscount` 활용
  - 30개 이상 시 25% 할인
  - 출력: `{discountRate: number, discountAmount: number}`

### Task 5: 화요일 할인 계산 함수 구현

- [ ] `calculateTuesdayDiscount(subtotal, date)` 구현
  - DiscountPolicies.js의 `calculateTuesdayDiscount` 활용
  - 화요일 10% 추가 할인
  - 출력: `{discountRate: number, discountAmount: number, isTuesday: boolean}`

### Task 6: 통합 가격 계산 함수 구현

- [ ] `calculateFinalPrice(cartItems, date)` 구현
  - 모든 할인을 순차적으로 적용
  - 할인 우선순위 처리 (개별 → 대량 → 화요일)
  - 출력:
    ```javascript
    {
      subtotal: number,
      individualDiscounts: [],
      bulkDiscount: {},
      tuesdayDiscount: {},
      finalAmount: number,
      totalSavings: number
    }
    ```

### Task 7: main.basic.js 리팩터링

- [ ] `handleCalculateCartStuff()`에서 계산 로직 제거
- [ ] PriceCalculator 사용하도록 변경
- [ ] DOM 조작 로직만 남기기
- [ ] 기존 동작 100% 보존

### Task 8: 테스트 및 검증

- [ ] PriceCalculator의 각 함수별 단위 테스트 작성
- [ ] 기존 674개 테스트 모두 통과 확인
- [ ] 계산 결과 정확성 검증

## Technical Requirements

### Dependencies

- Epic 2 완료 (DiscountPolicies.js 사용)
- 기존 테스트 호환성 보장

### Performance

- 계산 성능 기존 대비 동등하거나 향상
- 메모리 사용량 최적화

### Code Quality

- JSDoc 타입 정의 100%
- ESLint 규칙 준수
- 순수 함수 원칙 준수

## Definition of Done

- [ ] PriceCalculator 모듈 완성
- [ ] 모든 계산 로직이 순수 함수로 분리
- [ ] main.basic.js에서 계산 로직 제거 완료
- [ ] 674개 기존 테스트 모두 통과
- [ ] PriceCalculator 단위 테스트 작성 완료
- [ ] 코드 리뷰 완료

## Risks & Mitigation

- **위험**: 할인 적용 순서 변경으로 인한 계산 결과 차이
- **완화**: 기존 로직과 1:1 매핑되는 함수 구조 설계

## Implementation Notes

- 기존 `handleCalculateCartStuff()` 로직을 완전히 분석하여 동일한 계산 결과 보장
- 할인 중복 적용 로직 주의 (번개세일 + 추천할인 = 25%)
- DOM 요소 접근은 main.basic.js에서만 수행

## Related Stories

- Story 3.2: 할인 엔진 및 정책 적용
- Story 3.3: 포인트 계산 시스템
