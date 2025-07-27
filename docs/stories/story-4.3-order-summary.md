# Story 4.3: 주문 요약 컴포넌트

## Story Overview

**As a** 사용자  
**I want** 최종 주문 금액과 할인 내역이 명확한 요약  
**So that** 결제 전 모든 정보를 확인할 수 있다

## Story Points: 6

## Epic: Epic 4 - UI 컴포넌트화 및 DOM 분리

## Problem Statement

### 현재 문제

`main.basic.js`에서 주문 요약 정보 생성이 복잡하고 분산:

```javascript
// 현재: main.basic.js 내 복잡한 주문 요약 생성
// 소계 표시
summaryDetails.innerHTML = `
  <div class="bg-white border border-gray-200 p-6 rounded-lg space-y-4">
    <div class="flex justify-between text-base">
      <span>소계</span>
      <span>₩${subTot.toLocaleString()}</span>
    </div>
    ${itemDiscounts
      .map(
        discount => `
      <div class="flex justify-between text-sm text-green-600">
        <span>${discount.name} 할인</span>
        <span>-₩${discount.amount.toLocaleString()}</span>
      </div>
    `
      )
      .join('')}
    <!-- 복잡한 할인 표시 로직 -->
  </div>
`;

// 포인트 표시
loyaltyPointsDiv.innerHTML = `
  <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
  <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
`;

// 할인 정보 표시
discountInfoDiv.innerHTML = `
  <div class="bg-green-500/20 rounded-lg p-3">
    <div class="flex justify-between items-center mb-1">
      <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
      <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
    </div>
    <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
  </div>
`;
```

### 문제점 분석

1. **분산된 UI 업데이트**: 소계, 할인, 포인트가 각각 다른 곳에서 처리
2. **복잡한 템플릿**: 긴 innerHTML 문자열로 가독성 저하
3. **상태 동기화 어려움**: 여러 요소의 일관성 유지 복잡
4. **할인 로직 혼재**: UI 생성과 할인 계산이 함께 처리
5. **중복 코드**: 비슷한 가격 포맷팅 로직 반복

## Solution

### 새로운 구조: `src/basic/components/OrderSummary.js`

```javascript
export class OrderSummary {
  // 전체 주문 요약 렌더링
  static render(orderData, options = {})

  // 소계 및 할인 내역
  static generatePricingDetails(orderData)

  // 포인트 적립 정보
  static generatePointsInfo(pointsData)

  // 화요일 특별 할인 배너
  static generateTuesdayBanner(isTuesday, discountInfo)

  // 최종 주문 금액 요약
  static generateFinalSummary(orderData)
}
```

## Detailed Acceptance Criteria

### Task 1: OrderSummary 컴포넌트 기본 구조 생성

- [ ] `src/basic/components/OrderSummary.js` 파일 생성
- [ ] OrderSummary 클래스 및 JSDoc 타입 정의
- [ ] 주문 데이터 구조 정의
- [ ] 기본 render() 메서드 구현

### Task 2: 가격 상세 정보 생성

- [ ] `generatePricingDetails(orderData)` 메서드 구현
  - 소계 표시
  - 개별 상품 할인 내역
  - 대량 구매 할인
  - 화요일 할인
  - 특별 할인 (번개세일, 추천할인)

### Task 3: 포인트 적립 정보 생성

- [ ] `generatePointsInfo(pointsData)` 메서드 구현
  - 적립 예정 포인트 총액
  - 적립 내역 상세 (기본, 화요일, 세트, 수량 보너스)
  - PointsCalculator 결과 활용

### Task 4: 화요일 특별 할인 배너

- [ ] `generateTuesdayBanner(isTuesday, discountInfo)` 메서드 구현
  - 화요일 감지 및 배너 표시
  - 할인 금액 및 비율 표시
  - 시각적 강조 스타일

### Task 5: 최종 주문 금액 요약

- [ ] `generateFinalSummary(orderData)` 메서드 구현
  - 최종 결제 금액
  - 총 절약 금액
  - 총 할인율
  - 세금 정보 (향후 확장)

### Task 6: 전체 렌더링 메서드 구현

- [ ] `render(orderData, options)` 메서드 구현
  - 모든 하위 컴포넌트 조합
  - 반응형 레이아웃
  - 접근성 고려

### Task 7: Epic 3 계산 엔진 통합

- [ ] PriceCalculator 결과 연동
- [ ] PointsCalculator 결과 연동
- [ ] DiscountEngine 결과 연동 (특별 할인)
- [ ] 계산 결과를 UI 형태로 변환

### Task 8: main.basic.js 통합

- [ ] OrderSummary import 추가
- [ ] 기존 주문 요약 생성 로직 제거
- [ ] 계산 엔진 결과를 OrderSummary에 전달
- [ ] 674개 테스트 모두 통과 확인

### Task 9: 단위 테스트 작성

- [ ] `src/basic/__tests__/OrderSummary.test.js` 생성
- [ ] 다양한 할인 시나리오 테스트
- [ ] 포인트 적립 시나리오 테스트
- [ ] 빈 장바구니 처리 테스트

## Technical Requirements

### 주문 데이터 구조

```javascript
// OrderSummary 입력 데이터 구조
const orderData = {
  pricing: {
    subtotal: 300000,
    finalAmount: 240000,
    totalSavings: 60000,
    discountRate: 0.2,
    discounts: {
      individual: [
        { productName: '무선 키보드', amount: 20000, rate: 0.1 }
      ],
      bulk: { applied: true, amount: 30000, rate: 0.25 },
      tuesday: { applied: true, amount: 10000, rate: 0.1 },
      special: [
        { type: 'flash', productName: '헤드폰', amount: 40000, rate: 0.2 }
      ]
    }
  },
  points: {
    total: 350,
    breakdown: {
      base: { points: 100, calculation: '100,000원 × 0.1% = 100p' },
      tuesday: { points: 200, multiplier: 2, isTuesday: true },
      setBonus: { points: 150, details: [...] },
      quantityBonus: { points: 100, threshold: '30개 이상' }
    },
    messages: ['기본: 100p', '화요일 2배', '풀세트 구매 +100p']
  },
  context: {
    isTuesday: true,
    hasSpecialDiscounts: true,
    itemCount: 35
  }
};
```

### 컴포넌트 API 설계

```javascript
// OrderSummary 사용 예시
const summaryHTML = OrderSummary.render(orderData, {
  showDetailedBreakdown: true,
  highlightSavings: true,
  showPointsPreview: true,
  onCheckout: handleCheckout,
});

// 개별 섹션 생성
const pricingHTML = OrderSummary.generatePricingDetails(orderData.pricing);
const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
const bannerHTML = OrderSummary.generateTuesdayBanner(true, orderData.pricing);
```

### 예상 HTML 출력

```html
<!-- OrderSummary 출력 예시 -->
<div class="order-summary bg-white border border-gray-200 p-6 rounded-lg">
  <!-- 화요일 특별 배너 -->
  <div class="tuesday-banner bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
    <div class="flex items-center">
      <span class="text-blue-600 mr-2">🌟</span>
      <span class="text-blue-800 font-medium">화요일 추가 할인</span>
      <span class="ml-auto text-blue-600">-₩10,000</span>
    </div>
  </div>

  <!-- 가격 상세 내역 -->
  <div class="pricing-details space-y-3 mb-6">
    <div class="flex justify-between text-base">
      <span>소계</span>
      <span>₩300,000</span>
    </div>

    <div class="discount-items space-y-2">
      <div class="flex justify-between text-sm text-green-600">
        <span>무선 키보드 할인 (10%)</span>
        <span>-₩20,000</span>
      </div>
      <div class="flex justify-between text-sm text-green-600">
        <span>대량 구매 할인 (25%)</span>
        <span>-₩30,000</span>
      </div>
      <div class="flex justify-between text-sm text-blue-600">
        <span>화요일 특별 할인 (10%)</span>
        <span>-₩10,000</span>
      </div>
    </div>

    <hr class="border-gray-200" />

    <div class="flex justify-between text-lg font-semibold">
      <span>최종 금액</span>
      <span>₩240,000</span>
    </div>
  </div>

  <!-- 총 절약 정보 -->
  <div class="savings-info bg-green-50 rounded-lg p-4 mb-6">
    <div class="flex justify-between items-center">
      <span class="text-sm text-green-700">총 절약 금액</span>
      <span class="text-lg font-bold text-green-600">₩60,000 (20%)</span>
    </div>
  </div>

  <!-- 포인트 적립 정보 -->
  <div class="points-info bg-purple-50 rounded-lg p-4 mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm text-purple-700">적립 예정 포인트</span>
      <span class="text-lg font-bold text-purple-600">350p</span>
    </div>
    <div class="text-xs text-purple-600">기본: 100p, 화요일 2배, 풀세트 구매 +100p</div>
  </div>

  <!-- 체크아웃 버튼 -->
  <button
    class="checkout-btn w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
  >
    Proceed to Checkout
  </button>
</div>
```

## Definition of Done

- [ ] OrderSummary 컴포넌트 완성
- [ ] Epic 3 계산 엔진 결과 완벽 연동
- [ ] 기존 주문 요약 UI와 100% 동일
- [ ] 모든 할인 시나리오 정확 표시
- [ ] 포인트 적립 내역 상세 표시
- [ ] 674개 기존 테스트 모두 통과
- [ ] OrderSummary 단위 테스트 작성

## Edge Cases & Special Handling

### 할인 조합 시나리오

1. **할인 없음**: 소계와 최종 금액 동일
2. **단일 할인**: 개별/대량/화요일 중 하나만
3. **복합 할인**: 여러 할인이 조합된 경우
4. **특별 할인**: 번개세일, 추천할인, 콤보할인
5. **최대 할인**: 모든 할인이 적용된 극한 시나리오

### 포인트 적립 시나리오

1. **기본 적립**: 1000원당 1포인트만
2. **화요일 2배**: 기본 포인트 배수 적용
3. **보너스 적립**: 세트, 수량 보너스 포함
4. **적립 없음**: 최소 금액 미달 시

### UI 상태 처리

1. **빈 장바구니**: 요약 정보 숨김 또는 안내 메시지
2. **계산 중**: 로딩 스피너 또는 스켈레톤
3. **에러 상태**: 계산 실패 시 에러 메시지
4. **업데이트**: 장바구니 변경 시 애니메이션

## Implementation Notes

- Epic 3 계산 엔진 결과를 직접 활용
- 컴포넌트는 순수한 뷰 역할만 담당
- 모든 계산은 상위에서 완료 후 전달
- CSS 클래스는 기존과 동일하게 유지

## Test Scenarios

### 단위 테스트 시나리오

1. **기본 주문**: 할인 없는 단순 주문 요약
2. **복합 할인**: 여러 할인 적용된 복잡한 주문
3. **화요일 주문**: 화요일 할인과 포인트 2배 적용
4. **특별 할인**: 번개세일, 추천할인 시나리오
5. **최대 혜택**: 모든 할인과 보너스가 적용된 경우

## Integration Points

### Epic 3 계산 엔진 연동

```javascript
// main.basic.js에서 계산 엔진 결과 수집
const priceResult = PriceCalculator.calculateFinalPrice(cartItems, new Date());
const pointsResult = PointsCalculator.getTotalPoints(cartItems, priceResult.finalAmount, {
  date: new Date(),
});
const discountResult = DiscountEngine.applyDiscountPolicies(cartItems, { date: new Date() });

// OrderSummary에 전달할 데이터 구성
const orderData = {
  pricing: {
    subtotal: priceResult.subtotal,
    finalAmount: priceResult.finalAmount,
    totalSavings: priceResult.totalSavings,
    discounts: {
      individual: priceResult.individualDiscounts,
      bulk: priceResult.bulkDiscount,
      tuesday: priceResult.tuesdayDiscount,
      special: discountResult.specialDiscounts,
    },
  },
  points: pointsResult,
  context: {
    isTuesday: new Date().getDay() === 2,
    hasSpecialDiscounts: discountResult.specialDiscounts.length > 0,
  },
};

// OrderSummary 렌더링
const summaryHTML = OrderSummary.render(orderData);
summaryContainer.innerHTML = summaryHTML;
```

## Performance Considerations

- 계산 결과 캐싱으로 불필요한 재계산 방지
- 템플릿 문자열 최적화
- 조건부 렌더링으로 불필요한 DOM 생성 방지

## Accessibility Features

- 금액 정보에 적절한 ARIA 라벨
- 키보드 네비게이션 지원
- 스크린 리더를 위한 구조화된 마크업
- 고대비 모드에서도 할인 정보 구분 가능

## Risks & Mitigation

- **위험**: Epic 3 계산 엔진 결과 구조 변경 시 UI 깨짐
- **완화**: 타입 정의와 유닛 테스트로 인터페이스 안정성 확보

- **위험**: 복잡한 할인 조합 시 UI 가독성 저하
- **완화**: 할인 항목을 우선순위에 따라 정렬 및 그룹화

## Related Stories

- Story 4.2: 장바구니 디스플레이 컴포넌트 (아이템 정보 연동)
- Epic 3 완료 필수: PriceCalculator, PointsCalculator, DiscountEngine

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 3 PriceCalculator 완료 (완료됨 ✅)
- Epic 3 PointsCalculator 완료 (완료됨 ✅)
- Epic 3 DiscountEngine 완료 (완료됨 ✅)

### Success Criteria

- Epic 3 계산 엔진과 완벽한 연동
- 복잡한 할인 시나리오 명확한 표시
- 기존 주문 요약 UI와 100% 동일
- 포인트 적립 내역 상세 표시
- 사용자 친화적인 금액 정보 제공
