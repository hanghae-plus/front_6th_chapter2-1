# Story 3.3: 포인트 계산 시스템

## Story Overview

**As a** 고객  
**I want** 투명하고 정확한 포인트 적립 계산  
**So that** 예상한 만큼의 포인트를 정확히 받을 수 있다

## Story Points: 12

## Epic: Epic 3 - 비즈니스 로직 분리 및 순수 함수화

## Problem Statement

### 현재 문제

`doRenderBonusPoints()` 함수가 다음을 모두 처리:

- 포인트 계산 로직 (기본, 화요일, 세트, 대량구매)
- DOM 요소 조작 및 UI 렌더링
- 장바구니 데이터 파싱
- 복잡한 중첩된 조건문

### 문제점 분석

```javascript
// 현재: 계산과 렌더링이 혼재된 함수
var doRenderBonusPoints = function () {
  // 복잡한 DOM 파싱
  const cartItemsForBonus = [];
  const cartNodes = cartDisp.children;

  // 포인트 계산 로직
  basePoints = calculateBasePoints(totalAmt);

  // 세트 보너스 하드코딩
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
  }

  // UI 업데이트
  ptsTag.innerHTML = '...';
};
```

## Solution

### 새로운 구조: `src/basic/calculations/PointsCalculator.js`

```javascript
export class PointsCalculator {
  // 통합 포인트 계산
  static getTotalPoints(cart, finalAmount, context)

  // 기본 포인트 계산
  static calculateBasePoints(finalAmount)

  // 보너스 포인트 계산
  static calculateBonusPoints(cart, context)

  // 세트 구매 보너스
  static calculateSetBonus(cartItems)

  // 수량 보너스 (대량구매)
  static calculateQuantityBonus(totalQuantity)

  // 화요일 포인트 배수
  static calculateTuesdayMultiplier(basePoints, date)
}
```

## Detailed Acceptance Criteria

### Task 1: PointsCalculator 모듈 생성

- [ ] `src/basic/calculations/PointsCalculator.js` 파일 생성
- [ ] 포인트 타입 상수 정의 (`BASE`, `TUESDAY`, `SET_BONUS`, `QUANTITY_BONUS`)
- [ ] JSDoc 타입 정의 추가

### Task 2: 기본 포인트 계산 함수 구현

- [ ] `calculateBasePoints(finalAmount)` 구현
  - PointsPolicies.js의 `calculateBasePoints` 활용
  - 1000원당 1포인트 기본 정책
  - 출력: `{points: number, rate: number}`

### Task 3: 화요일 포인트 배수 계산 구현

- [ ] `calculateTuesdayMultiplier(basePoints, date)` 구현
  - PointsPolicies.js의 `calculateTuesdayPoints` 활용
  - 화요일 2배 적용
  - 출력: `{points: number, multiplier: number, isTuesday: boolean}`

### Task 4: 세트 구매 보너스 계산 구현

- [ ] `calculateSetBonus(cartItems)` 강화
  - 현재 PointsPolicies.js의 `calculateSetBonus` 기반
  - 키보드+마우스 세트: +50p
  - 풀세트 (키보드+마우스+모니터암): +100p
  - 중복 적용 로직 (기존 동작 보존)

### Task 5: 수량 보너스 계산 구현

- [ ] `calculateQuantityBonus(totalQuantity)` 구현
  - PointsPolicies.js의 `calculateBulkBonus` 활용
  - 10개 이상: +20p
  - 20개 이상: +50p
  - 30개 이상: +100p

### Task 6: 통합 포인트 계산 엔진 구현

- [ ] `getTotalPoints(cart, finalAmount, context)` 구현
  - 입력:
    ```javascript
    cart: [{id, quantity, price, product}]
    finalAmount: number
    context: {date, userTier?, specialEvents?}
    ```
  - 모든 포인트 계산을 통합
  - 상세 내역과 함께 반환

### Task 7: 보너스 포인트 통합 계산 구현

- [ ] `calculateBonusPoints(cart, context)` 구현
  - 세트 보너스 + 수량 보너스 통합
  - 보너스 중복 적용 규칙 처리
  - 상세 내역 제공

### Task 8: main.basic.js 리팩터링

- [ ] `doRenderBonusPoints()`에서 계산 로직 제거
- [ ] PointsCalculator 사용하도록 변경
- [ ] DOM 조작 및 UI 렌더링만 유지
- [ ] 674개 테스트 모두 통과 확인

## Technical Requirements

### 포인트 계산 엔진 설계

```javascript
// 통합 포인트 계산 결과 구조
const pointsResult = {
  total: 150,
  breakdown: {
    base: {
      points: 50,
      calculation: '50,000원 / 1000 = 50p',
    },
    tuesday: {
      points: 50,
      multiplier: 2,
      calculation: '화요일 2배: 50p → 100p',
    },
    setBonus: {
      points: 150, // 50p + 100p (중복 적용)
      details: [
        { type: 'keyboard_mouse', points: 50 },
        { type: 'full_set', points: 100 },
      ],
    },
    quantityBonus: {
      points: 100,
      threshold: '30개 이상',
      calculation: '대량구매 보너스',
    },
  },
  messages: [
    '기본: 50p',
    '화요일 2배',
    '키보드+마우스 세트 +50p',
    '풀세트 구매 +100p',
    '대량구매(30개+) +100p',
  ],
};
```

### Dependencies

- Epic 2 PointsPolicies.js 활용
- Story 3.1 PriceCalculator (최종 금액 계산)

### Performance

- 포인트 계산 성능 최적화
- 불필요한 재계산 방지

## Definition of Done

- [ ] PointsCalculator 모듈 완성
- [ ] 모든 포인트 계산 로직이 순수 함수로 분리
- [ ] main.basic.js에서 포인트 계산 로직 제거
- [ ] 기존 중복 적용 로직 정확히 보존
- [ ] 674개 기존 테스트 모두 통과
- [ ] PointsCalculator 단위 테스트 작성
- [ ] 포인트 계산 정확성 검증

## Edge Cases & Special Handling

### 포인트 중복 적용 시나리오

1. **세트 보너스 중복**: 키보드+마우스(+50p) + 풀세트(+100p) = +150p
2. **화요일 + 보너스**: 기본 포인트만 2배, 보너스는 그대로
3. **최소 포인트**: 1000원 미만 구매 시 0포인트
4. **포인트 반올림**: 소수점 처리 규칙

### 기존 동작 보존 필수

```javascript
// 현재 동작: 세트 보너스 중복 적용 (논리적으로 잘못되었지만 기존 테스트 통과를 위해 보존)
if (hasKeyboard && hasMouse) {
  finalPoints += 50; // 키보드+마우스 세트
}
if (hasKeyboard && hasMouse && hasMonitorArm) {
  finalPoints += 100; // 풀세트 (위의 50p와 중복 적용)
}
// 결과: 풀세트 구매 시 총 +150p (50p + 100p)
```

## Implementation Notes

- Epic 2에서 생성된 PointsPolicies.js의 함수들을 최대한 활용
- 기존 `calculateSetBonus`의 중복 적용 로직 보존
- 포인트 표시 메시지는 UIConstants.js 활용
- DOM 파싱 로직을 main.basic.js에서 PointsCalculator로 전달하는 방식

## Test Scenarios

### 단위 테스트 시나리오

1. **기본 포인트**: 다양한 금액대별 포인트 계산
2. **화요일 보너스**: 화요일/평일 구분 계산
3. **세트 보너스**: 각 세트 조합별 포인트 계산
4. **수량 보너스**: 수량 구간별 보너스 계산
5. **통합 계산**: 모든 보너스가 조합된 복잡한 시나리오

## Risks & Mitigation

- **위험**: 포인트 중복 적용 로직 변경으로 인한 기존 테스트 실패
- **완화**: 기존 로직을 정확히 분석하여 동일한 결과 보장

## Related Stories

- Story 3.1: 가격 및 할인 계산 엔진 (완료 필요)
- Story 3.2: 할인 엔진 및 정책 적용 (완료 필요)
- Story 3.4: 재고 관리 및 상태 계산
