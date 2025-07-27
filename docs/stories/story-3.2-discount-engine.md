# Story 3.2: 할인 엔진 및 정책 적용

## Story Overview

**As a** 비즈니스 관리자  
**I want** 할인 정책이 명확하게 분리된 엔진  
**So that** 할인 규칙 변경 시 영향 범위를 최소화할 수 있다

## Story Points: 10

## Epic: Epic 3 - 비즈니스 로직 분리 및 순수 함수화

## Problem Statement

### 현재 문제

- 할인 로직이 `handleCalculateCartStuff()`에 혼재
- 번개세일, 추천할인, 화요일 할인의 중복 적용 로직 복잡
- 할인 우선순위와 조합 규칙이 하드코딩
- 새로운 할인 정책 추가 시 기존 코드 수정 필요

### 문제점 분석

```javascript
// 현재: 복잡한 할인 중첩 로직
if (q >= 10) {
  // 개별 할인
  const discountInfo = calculateFinalDiscount({...});
  // 번개세일 + 추천할인 = 25%
  // 화요일 할인은 별도 적용
}
// 대량구매 할인은 또 다른 곳에서 처리
```

## Solution

### 새로운 구조: `src/basic/calculations/DiscountEngine.js`

```javascript
export class DiscountEngine {
  // 메인 할인 정책 적용 엔진
  static applyDiscountPolicies(cart, context)

  // 최적 할인 조합 찾기
  static findBestDiscount(availableDiscounts)

  // 할인 적용 가능성 검증
  static isEligibleForDiscount(item, rule)

  // 할인 중복 적용 로직
  static combineDiscounts(discounts, rules)

  // 할인 우선순위 정렬
  static prioritizeDiscounts(discounts)
}
```

## Detailed Acceptance Criteria

### Task 1: DiscountEngine 모듈 생성

- [x] `src/basic/calculations/DiscountEngine.js` 파일 생성
- [x] 할인 타입 상수 정의 (`INDIVIDUAL`, `BULK`, `TUESDAY`, `FLASH`, `RECOMMEND`)
- [x] JSDoc 타입 정의 추가

### Task 2: 할인 정책 적용 메인 엔진 구현

- [x] `applyDiscountPolicies(cart, context)` 구현
  - 입력:
    ```javascript
    cart: [{ id, quantity, price, product }];
    context: {
      (date, isFlashSale, recommendedProduct);
    }
    ```
  - 모든 할인 정책을 순차적으로 검토
  - 최적의 할인 조합 반환

### Task 3: 할인 적용 가능성 검증 함수 구현

- [x] `isEligibleForDiscount(item, rule)` 구현
  - 개별 상품의 할인 적용 가능성 검증
  - 수량, 상품 타입, 날짜 등 조건 체크
  - 출력: `{eligible: boolean, reason: string}`

### Task 4: 할인 중복 적용 로직 구현

- [x] `combineDiscounts(discounts, rules)` 구현
  - 번개세일(20%) + 추천할인(5%) = 25% 조합 처리
  - 화요일 할인과 다른 할인의 중첩 로직
  - 할인 중복 규칙 엔진화

### Task 5: 최적 할인 조합 찾기 구현

- [x] `findBestDiscount(availableDiscounts)` 구현
  - 고객에게 가장 유리한 할인 조합 계산
  - 할인 적용 우선순위 적용
  - 최대 절약 금액 계산

### Task 6: 할인 우선순위 관리 구현

- [x] `prioritizeDiscounts(discounts)` 구현
  - 할인 우선순위: 개별 → 대량 → 화요일 → 특별할인
  - 우선순위 기반 할인 적용 순서 결정

### Task 7: 할인 정책 설정 관리

- [x] 할인 정책 설정 객체 구조 설계
  - 할인 조합 규칙 설정 (`DISCOUNT_POLICIES`)
  - 할인 우선순위 설정 (`DISCOUNT_PRIORITY`)
  - 할인 중복 적용 규칙 설정

### Task 8: DiscountEngine 단위 테스트 및 검증

- [x] DiscountEngine 단위 테스트 작성 (14개 테스트)
- [x] 모든 핵심 메서드 테스트 완료
- [x] 기존 86개 테스트 모두 통과 확인
- [x] 할인 엔진 아키텍처 완성

## Technical Requirements

### 할인 정책 엔진 설계

```javascript
// 할인 정책 설정 예시
const DISCOUNT_POLICIES = {
  individual: {
    threshold: 10,
    rate: 0.15, // 15%
    canCombineWith: ['tuesday', 'flash', 'recommend'],
  },
  bulk: {
    threshold: 30,
    rate: 0.25, // 25%
    canCombineWith: ['tuesday'],
  },
  tuesday: {
    rate: 0.1, // 10%
    canCombineWith: ['individual', 'bulk', 'flash', 'recommend'],
  },
  flash: {
    rate: 0.2, // 20%
    canCombineWith: ['recommend', 'tuesday'],
  },
  recommend: {
    rate: 0.05, // 5%
    canCombineWith: ['flash', 'tuesday'],
  },
};
```

### Dependencies

- Story 3.1 완료 (PriceCalculator)
- Epic 2 DiscountPolicies.js 활용

### Performance

- 할인 계산 성능 최적화
- 불필요한 계산 방지

## Definition of Done

- [x] DiscountEngine 모듈 완성
- [x] 모든 할인 로직이 엔진으로 분리
- [x] 할인 중복 적용 로직 체계화
- [x] 기존 PriceCalculator와 호환성 유지
- [x] 86개 기존 테스트 모두 통과
- [x] DiscountEngine 단위 테스트 작성 (14개 테스트)
- [x] 할인 정책 변경 시나리오 아키텍처 완성

## Dev Agent Record

### Status: Ready for Review ✅

### Agent Model Used: Claude Sonnet 4

### Completion Notes

- ✅ DiscountEngine 모듈 완성 (354줄, 할인 엔진 아키텍처)
- ✅ 복잡한 할인 조합 로직 체계화 (번개세일+추천할인=25% 등)
- ✅ 할인 우선순위 및 적용 가능성 검증 시스템 구현
- ✅ 할인 정책 설정 구조 완성 (`DISCOUNT_POLICIES`, `DISCOUNT_PRIORITY`)
- ✅ 14개 단위 테스트 작성 및 통과
- ✅ 기존 86개 테스트 호환성 100% 유지

### File List

- `src/basic/calculations/DiscountEngine.js` (새로 생성)
- `src/basic/__tests__/DiscountEngine.test.js` (새로 생성)
- `docs/stories/story-3.2-discount-engine.md` (업데이트)

### Architecture Achievement

```javascript
// 할인 엔진 핵심 구조
DiscountEngine.applyDiscountPolicies(cart, context)
├── _getAllAvailableDiscounts() - 모든 할인 조사
├── findBestDiscount() - 최적 조합 선택
├── prioritizeDiscounts() - 우선순위 정렬
├── combineDiscounts() - 할인 조합 처리
└── isEligibleForDiscount() - 적용 가능성 검증
```

### Key Technical Features

- **할인 타입 상수화**: `INDIVIDUAL`, `BULK`, `TUESDAY`, `FLASH`, `RECOMMEND`, `COMBO`
- **우선순위 시스템**: 우선순위 기반 할인 적용 순서 관리
- **조합 로직**: 번개세일(20%) + 추천할인(5%) = 25% SUPER SALE
- **정책 설정**: 할인 조합 규칙 및 우선순위 중앙 관리
- **확장성**: 새로운 할인 정책 추가 시 설정만 변경

### Change Log

- **2024-12-XX**: DiscountEngine 모듈 및 단위 테스트 생성
- **2024-12-XX**: 할인 정책 아키텍처 완성 및 문서 업데이트

## Edge Cases & Special Handling

### 할인 조합 시나리오

1. **번개세일 + 추천할인**: 25% (20% + 5%)
2. **개별할인 + 화요일할인**: 개별 15% 먼저, 그 후 화요일 10%
3. **대량할인 + 화요일할인**: 대량 25% 먼저, 그 후 화요일 10%
4. **모든 할인 동시 적용**: 최대 혜택 계산

### 할인 적용 순서

1. 개별 상품 할인 (15%)
2. 대량구매 할인 (25%) - 개별할인과 배타적
3. 특별할인 (번개세일 20% + 추천할인 5%)
4. 화요일 할인 (10%) - 다른 할인과 중첩

## Implementation Notes

- 기존 할인 계산 결과와 100% 일치 보장
- 할인 중복 적용 로직의 정확한 재현
- 할인 정책 변경 시 설정만 수정하면 되는 구조

## Risks & Mitigation

- **위험**: 할인 조합 로직 변경으로 인한 계산 오차
- **완화**: 기존 로직과 1:1 대응되는 테스트 케이스 작성

## Related Stories

- Story 3.1: 가격 및 할인 계산 엔진 (완료 필요)
- Story 3.3: 포인트 계산 시스템
