# Story 4.1: 상품 선택 컴포넌트

## Story Overview

**As a** 사용자  
**I want** 직관적인 상품 선택 드롭다운  
**So that** 원하는 상품을 쉽게 찾고 장바구니에 추가할 수 있다

## Story Points: 6

## Epic: Epic 4 - UI 컴포넌트화 및 DOM 분리

## Problem Statement

### 현재 문제

`main.basic.js`에서 상품 드롭다운 생성이 복잡하고 혼재:

```javascript
// 현재: main.basic.js 내 복잡한 드롭다운 생성
sel = document.createElement('select');
sel.id = 'product-select';

// 복잡한 옵션 생성 로직
for (let pIdx = 0; pIdx < prodList.length; pIdx++) {
  let optionEl = document.createElement('option');
  let curProduct = prodList[pIdx];

  // 복잡한 아이콘 및 상태 표시 로직
  if (curProduct.onSale) {
    optionEl.textContent = '⚡ ' + curProduct.name + ' - ' + curProduct.val + '원';
  } else if (curProduct.suggestSale) {
    optionEl.textContent = '💝 ' + curProduct.name + ' - ' + curProduct.val + '원';
  } else {
    optionEl.textContent = curProduct.name + ' - ' + curProduct.val + '원';
  }

  if (curProduct.q === 0) {
    optionEl.textContent += ' (품절)';
    optionEl.disabled = true;
  }

  sel.appendChild(optionEl);
}
```

### 문제점 분석

1. **DOM 조작과 비즈니스 로직 혼재**: 상품 상태와 UI 생성이 함께 처리
2. **재사용 불가능**: 다른 곳에서 상품 선택기를 사용할 수 없음
3. **테스트 어려움**: UI 로직이 메인 함수에 포함되어 분리 테스트 불가
4. **확장성 부족**: 새로운 상품 상태나 스타일 추가 시 메인 로직 수정 필요

## Solution

### 새로운 구조: `src/basic/components/ProductSelector.js`

```javascript
export class ProductSelector {
  // 상품 선택기 렌더링
  static render(products, options = {})

  // 옵션 HTML 생성
  static generateOption(product, stockInfo)

  // 상품 상태별 아이콘 처리
  static getProductIcon(product)

  // 재고 상태 메시지
  static getStockMessage(product)
}
```

## Detailed Acceptance Criteria

### Task 1: ProductSelector 컴포넌트 기본 구조 생성

- [ ] `src/basic/components/ProductSelector.js` 파일 생성
- [ ] 컴포넌트 클래스 및 JSDoc 타입 정의
- [ ] 기본 render() 메서드 스켈레톤 구현
- [ ] `src/basic/components/` 디렉토리 생성

### Task 2: render() 메서드 구현

- [ ] `render(products, options)` 메서드 구현
  - 입력: `products` 배열, `options` 설정 객체
  - 출력: 완전한 `<select>` HTML 요소
  - 기존 드롭다운과 100% 동일한 구조 생성

### Task 3: 상품 옵션 생성 로직 구현

- [ ] `generateOption(product, stockInfo)` 메서드 구현
  - 상품별 `<option>` HTML 생성
  - 가격 포맷팅 (예: "100,000원")
  - 품절 상품 disabled 속성 적용
  - 옵션 value 설정 (상품 ID)

### Task 4: 상품 상태 아이콘 처리

- [ ] `getProductIcon(product)` 메서드 구현
  - 번개세일: ⚡ 아이콘
  - 추천할인: 💝 아이콘
  - 일반 상품: 아이콘 없음
  - 아이콘과 상품명 조합 반환

### Task 5: 재고 상태 메시지 처리

- [ ] `getStockMessage(product)` 메서드 구현
  - 품절: " (품절)" 메시지 추가
  - 재고 부족: " (재고 부족)" 메시지 (옵션)
  - 정상 재고: 메시지 없음
  - StockCalculator 활용

### Task 6: 이벤트 핸들러 분리

- [ ] 컴포넌트에서 이벤트 핸들러 props 수용
- [ ] `onChange` 콜백 지원
- [ ] main.basic.js와의 인터페이스 정의

### Task 7: main.basic.js 통합

- [ ] ProductSelector import 추가
- [ ] 기존 드롭다운 생성 로직 제거
- [ ] ProductSelector.render() 호출로 대체
- [ ] 674개 테스트 모두 통과 확인

### Task 8: 단위 테스트 작성

- [ ] `src/basic/__tests__/ProductSelector.test.js` 생성
- [ ] render() 메서드 테스트
- [ ] 상품 상태별 옵션 생성 테스트
- [ ] 재고 상태 처리 테스트

## Technical Requirements

### 컴포넌트 API 설계

```javascript
// 사용 예시
const selectorHTML = ProductSelector.render(prodList, {
  id: 'product-select',
  className: 'product-dropdown',
  placeholder: '상품을 선택하세요',
  onChange: handleProductSelect,
});

// 예상 출력
const expectedOutput = `
<select id="product-select" class="product-dropdown">
  <option value="">상품을 선택하세요</option>
  <option value="p1">⚡ 무선 키보드 - 100,000원</option>
  <option value="p2">💝 무선 마우스 - 50,000원</option>
  <option value="p3" disabled>모니터암 - 80,000원 (품절)</option>
  <option value="p4">헤드폰 - 200,000원</option>
  <option value="p5">웹캠 - 70,000원</option>
</select>
`;
```

### Dependencies

- Epic 3 완료 (비즈니스 로직 분리)
- StockCalculator (재고 상태 확인용)

### Performance

- 상품 목록 변경 시만 리렌더링
- 불필요한 DOM 조작 최소화

## Definition of Done

- [ ] ProductSelector 컴포넌트 완성
- [ ] 기존 드롭다운과 100% 동일한 UI
- [ ] main.basic.js에서 독립적으로 사용 가능
- [ ] 674개 기존 테스트 모두 통과
- [ ] ProductSelector 단위 테스트 작성
- [ ] 상품 상태 및 재고 표시 정확성 검증

## Edge Cases & Special Handling

### 상품 상태 조합 시나리오

1. **번개세일 + 품절**: ⚡ 아이콘 + (품절) 메시지 + disabled
2. **추천할인 + 재고부족**: 💝 아이콘 + 정상 동작
3. **빈 상품 목록**: placeholder만 표시
4. **가격 없는 상품**: 가격 표시 생략

### 접근성 고려사항

- `aria-label` 속성 추가
- `disabled` 옵션에 대한 스크린 리더 지원
- 키보드 네비게이션 정상 동작

## Implementation Notes

- 기존 UI 동작과 100% 일치 우선
- 컴포넌트는 순수 함수로 구현 (부작용 없음)
- main.basic.js의 전역 변수 의존성 최소화
- HTML 문자열 생성 후 insertAdjacentHTML 활용

## Test Scenarios

### 단위 테스트 시나리오

1. **기본 렌더링**: 정상 상품 목록으로 드롭다운 생성
2. **아이콘 표시**: 번개세일/추천할인 상품의 아이콘 확인
3. **품절 처리**: 품절 상품의 disabled 상태 확인
4. **가격 포맷팅**: 천 단위 구분자 적용 확인
5. **빈 목록 처리**: 빈 배열 입력 시 placeholder만 표시

## Integration Points

### main.basic.js 연동

```javascript
// Before: 복잡한 드롭다운 생성 로직
for (let pIdx = 0; pIdx < prodList.length; pIdx++) {
  /* 복잡한 옵션 생성 */
}

// After: 간단한 컴포넌트 호출
import { ProductSelector } from './components/ProductSelector.js';

const selector = ProductSelector.render(prodList, {
  id: 'product-select',
  onChange: handleProductSelect,
});
selectorContainer.innerHTML = selector;
```

## Risks & Mitigation

- **위험**: 컴포넌트 분리 과정에서 기존 이벤트 핸들러 동작 변화
- **완화**: 기존 이벤트 바인딩 방식 정확히 재현

## Related Stories

- Story 4.2: 장바구니 디스플레이 컴포넌트
- Story 4.5: 재고 정보 및 알림 컴포넌트

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 3 StockCalculator 활용
- components/ 디렉토리 구조 설정

### Success Criteria

- 기존 상품 선택 UI와 100% 동일
- 독립적인 컴포넌트로 재사용 가능
- main.basic.js 복잡도 감소
