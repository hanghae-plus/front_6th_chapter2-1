# Story 3.4: 재고 관리 및 상태 계산

## Story Overview

**As a** 시스템  
**I want** 재고 상태를 정확히 계산하는 로직  
**So that** 재고 부족이나 품절 상황을 올바르게 처리할 수 있다

## Story Points: 6

## Epic: Epic 3 - 비즈니스 로직 분리 및 순수 함수화

## Problem Statement

### 현재 문제

재고 관리 로직이 여러 함수에 분산:

- `onGetStockTotal()`: 전체 재고 합계 계산
- `handleStockInfoUpdate()`: 재고 상태 메시지 업데이트
- `handleCalculateCartStuff()`: 재고 부족 아이템 체크
- DOM 조작과 비즈니스 로직 혼재

### 문제점 분석

```javascript
// 현재: 재고 로직이 여러 곳에 분산
// 1. 전체 재고 계산
function onGetStockTotal() {
  let sum = 0;
  for (let i = 0; i < prodList.length; i++) {
    sum += prodList[i].q;
  }
  return sum;
}

// 2. 재고 상태 업데이트 (DOM 조작 포함)
var handleStockInfoUpdate = function () {
  prodList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg; // DOM 조작
};

// 3. 장바구니 계산 시 재고 체크
for (idx = 0; idx < prodList.length; idx++) {
  if (prodList[idx].q < 5 && prodList[idx].q > 0) {
    lowStockItems.push(prodList[idx].name);
  }
}
```

## Solution

### 새로운 구조: `src/basic/calculations/StockCalculator.js`

```javascript
export class StockCalculator {
  // 재고 가용성 확인
  static checkStockAvailability(productId, quantity, products)

  // 재고 업데이트 계산
  static updateStock(productId, quantity, products)

  // 재고 상태 반환
  static getStockStatus(product)

  // 재고 부족 판단
  static isLowStock(quantity, threshold)

  // 전체 재고 통계
  static getStockSummary(products)

  // 재고 경고 메시지 생성
  static generateStockWarnings(products)
}
```

## Detailed Acceptance Criteria

### Task 1: StockCalculator 모듈 생성

- [ ] `src/basic/calculations/StockCalculator.js` 파일 생성
- [ ] 재고 상태 상수 정의 (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`)
- [ ] 재고 임계값 상수 정의 (부족: 5개 미만, 경고: 30개 미만)
- [ ] JSDoc 타입 정의 추가

### Task 2: 재고 가용성 확인 함수 구현

- [ ] `checkStockAvailability(productId, quantity, products)` 구현
  - 특정 상품의 구매 가능 수량 확인
  - 재고 부족 시 대안 수량 제안
  - 출력: `{available: boolean, maxQuantity: number, status: string}`

### Task 3: 재고 상태 판단 함수 구현

- [ ] `getStockStatus(product)` 구현
  - 개별 상품의 재고 상태 분류
  - 재고 수량에 따른 상태 반환
  - 출력: `{status: 'IN_STOCK'|'LOW_STOCK'|'OUT_OF_STOCK', quantity: number}`

### Task 4: 재고 부족 판단 함수 구현

- [ ] `isLowStock(quantity, threshold = 5)` 구현
  - 재고 부족 기준 판단 (기본 5개 미만)
  - 설정 가능한 임계값
  - 출력: `{isLow: boolean, remaining: number}`

### Task 5: 전체 재고 통계 함수 구현

- [ ] `getStockSummary(products)` 구현
  - 전체 재고 합계 계산 (`onGetStockTotal` 대체)
  - 재고 상태별 분류 (정상, 부족, 품절)
  - 출력:
    ```javascript
    {
      totalStock: number,
      inStock: number,
      lowStock: number,
      outOfStock: number,
      totalProducts: number,
      criticalLevel: boolean // 전체 재고 30개 미만
    }
    ```

### Task 6: 재고 경고 메시지 생성 함수 구현

- [ ] `generateStockWarnings(products)` 구현
  - `handleStockInfoUpdate` 로직을 순수 함수로 분리
  - UIConstants.js의 재고 메시지 활용
  - 출력: `{warnings: [{productName, status, quantity, message}], summary: string}`

### Task 7: 재고 업데이트 계산 함수 구현

- [ ] `updateStock(productId, quantity, products)` 구현
  - 구매 후 재고 감소 계산
  - 재고 부족 시 오류 처리
  - 출력: `{success: boolean, newStock: number, error?: string}`

### Task 8: main.basic.js 리팩터링

- [ ] `onGetStockTotal()` 제거, StockCalculator 사용
- [ ] `handleStockInfoUpdate()`에서 계산 로직 제거
- [ ] `handleCalculateCartStuff()`에서 재고 체크 로직 분리
- [ ] DOM 조작만 main.basic.js에 유지
- [ ] 674개 테스트 모두 통과 확인

## Technical Requirements

### 재고 상태 관리 설계

```javascript
// 재고 상태 상수
export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK', // 5개 이상
  LOW_STOCK: 'LOW_STOCK', // 1-4개
  OUT_OF_STOCK: 'OUT_OF_STOCK', // 0개
};

// 재고 임계값
export const STOCK_THRESHOLDS = {
  LOW_STOCK: 5, // 5개 미만 시 재고 부족
  CRITICAL: 30, // 전체 재고 30개 미만 시 긴급
  WARNING: 1, // 1개 이하 시 경고
};

// 재고 경고 결과 구조
const stockWarnings = {
  warnings: [
    {
      productName: '무선 키보드',
      status: 'LOW_STOCK',
      quantity: 3,
      message: '무선 키보드: 재고 부족 (3개 남음)',
    },
    {
      productName: '무선 마우스',
      status: 'OUT_OF_STOCK',
      quantity: 0,
      message: '무선 마우스: 품절',
    },
  ],
  summary: '재고 부족 상품 2개',
};
```

### Dependencies

- Epic 2 UIConstants.js (재고 메시지)
- Epic 2 Products.js (상품 정보)

### Performance

- 재고 계산 최적화
- 불필요한 순회 방지

## Definition of Done

- [ ] StockCalculator 모듈 완성
- [ ] 모든 재고 관련 로직이 순수 함수로 분리
- [ ] main.basic.js에서 재고 계산 로직 제거
- [ ] 재고 상태 판단 로직 체계화
- [ ] 674개 기존 테스트 모두 통과
- [ ] StockCalculator 단위 테스트 작성
- [ ] 재고 경고 메시지 정확성 검증

## Edge Cases & Special Handling

### 재고 관리 시나리오

1. **품절 상품 구매 시도**: 오류 처리 및 대안 제안
2. **재고 부족 상품**: 최대 구매 가능 수량 제한
3. **전체 재고 부족**: 시스템 경고 상태
4. **재고 업데이트 실패**: 롤백 및 오류 메시지

### 재고 상태 우선순위

1. **품절** (0개): 최우선 표시
2. **재고 부족** (1-4개): 경고 표시
3. **정상** (5개 이상): 일반 상태

## Implementation Notes

- 기존 재고 관련 로직의 동작을 정확히 보존
- UIConstants.js의 재고 메시지 적극 활용
- DOM 조작은 main.basic.js에서만 수행
- 재고 임계값은 설정 가능하도록 구현

## Test Scenarios

### 단위 테스트 시나리오

1. **재고 가용성**: 다양한 재고 수량별 구매 가능성 테스트
2. **재고 상태**: 임계값별 상태 분류 테스트
3. **경고 메시지**: 재고 상태별 메시지 생성 테스트
4. **재고 통계**: 전체 재고 요약 정보 테스트
5. **업데이트 계산**: 구매 후 재고 변경 테스트

## Integration Points

### main.basic.js 연동

```javascript
// Before: 복잡한 재고 관리 로직
function onGetStockTotal() {
  /* 복잡한 계산 */
}
var handleStockInfoUpdate = function () {
  /* DOM 조작 포함 */
};

// After: 간단한 호출
import { StockCalculator } from './calculations/StockCalculator.js';

// 재고 요약 정보 얻기
const stockSummary = StockCalculator.getStockSummary(prodList);

// 재고 경고 메시지 생성
const warnings = StockCalculator.generateStockWarnings(prodList);
stockInfo.textContent = warnings.summary; // DOM 조작만 남김
```

## Risks & Mitigation

- **위험**: 재고 상태 판단 로직 변경으로 인한 UI 표시 오류
- **완화**: 기존 재고 메시지와 동일한 결과 보장

## Related Stories

- Story 3.1: 가격 및 할인 계산 엔진 (완료 필요)
- Story 3.2: 할인 엔진 및 정책 적용 (완료 필요)
- Story 3.3: 포인트 계산 시스템 (완료 필요)
