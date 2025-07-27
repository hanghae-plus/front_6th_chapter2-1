# Epic 3: 비즈니스 로직 분리 - 스토리 인덱스

## 📊 Epic 3 전체 개요

### 🎯 목표

main.basic.js의 복잡한 비즈니스 로직을 테스트 가능한 순수 함수로 분리하여 유지보수성과 안정성 향상

### 📈 총 Story Points: 36 (완료: 36 SP / 100% 완료!) 🎉

- Story 3.1: 8 SP ✅ **완료**
- Story 3.2: 10 SP ✅ **완료**
- Story 3.3: 12 SP ✅ **완료**
- Story 3.4: 6 SP ✅ **완료**

---

## 📋 Stories 목록

### [Story 3.1: 가격 및 할인 계산 엔진](./story-3.1-price-calculator.md)

**Story Points: 8** | **Status: 완료됨** ✅

**목표**: `handleCalculateCartStuff()` 함수의 가격 계산 로직을 순수 함수로 분리

**핵심 작업**:

- ✅ `PriceCalculator.js` 모듈 생성 (235줄)
- ✅ 소계, 개별할인, 대량할인, 화요일할인 계산 함수 분리
- ✅ 통합 가격 계산 엔진 구현
- ✅ 12개 단위 테스트 작성 및 통과

**산출물**: `src/basic/calculations/PriceCalculator.js`, `src/basic/__tests__/PriceCalculator.test.js`

---

### [Story 3.2: 할인 엔진 및 정책 적용](./story-3.2-discount-engine.md)

**Story Points: 10** | **Status: 완료됨** ✅

**목표**: 복잡한 할인 중복 적용 로직을 체계적인 엔진으로 분리

**핵심 작업**:

- ✅ `DiscountEngine.js` 모듈 생성 (354줄)
- ✅ 할인 조합 규칙 엔진화 (번개세일+추천할인=25%)
- ✅ 할인 우선순위 및 최적 조합 알고리즘
- ✅ 14개 단위 테스트 작성 및 통과
- ✅ 할인 우선순위 및 중복 적용 로직 체계화

**산출물**: `src/basic/calculations/DiscountEngine.js`, `src/basic/__tests__/DiscountEngine.test.js`

---

### [Story 3.3: 포인트 계산 시스템](./story-3.3-points-calculator.md)

**Story Points: 12** | **Status: 완료됨** ✅

**목표**: `doRenderBonusPoints()` 함수의 계산 로직을 순수 함수로 분리

**핵심 작업**:

- ✅ `PointsCalculator.js` 모듈 생성 (295줄)
- ✅ 기본/화요일/세트/수량 모든 포인트 계산 함수 분리
- ✅ 기존 중복 적용 로직 보존 (풀세트 구매 시 +150p)
- ✅ 15개 단위 테스트 작성 및 통과
- ✅ main.basic.js doRenderBonusPoints 함수 리팩터링

**산출물**: `src/basic/calculations/PointsCalculator.js`, `src/basic/__tests__/PointsCalculator.test.js`

---

### [Story 3.4: 재고 관리 및 상태 계산](./story-3.4-stock-calculator.md)

**Story Points: 6** | **Status: 완료됨** ✅

**목표**: 분산된 재고 관리 로직을 통합된 계산 모듈로 분리

**핵심 작업**:

- ✅ `StockCalculator.js` 모듈 생성 (335줄)
- ✅ 재고 상태 체계화 (IN_STOCK/LOW_STOCK/OUT_OF_STOCK)
- ✅ 기존 onGetStockTotal, handleStockInfoUpdate 함수들 대체
- ✅ 22개 단위 테스트 작성 및 통과
- ✅ main.basic.js 재고 관련 함수들 리팩터링

**산출물**: `src/basic/calculations/StockCalculator.js`, `src/basic/__tests__/StockCalculator.test.js`

---

## 🎉 Epic 3 완료 요약

### 📈 **전체 성과**

- **Story Points**: 36/36 (100% 완료)
- **새로운 모듈**: 4개 (PriceCalculator, DiscountEngine, PointsCalculator, StockCalculator)
- **단위 테스트**: 59개 (15+14+15+22)
- **기존 테스트 호환성**: 86개 테스트 100% 유지
- **코드 분리**: main.basic.js에서 1000+ 줄의 비즈니스 로직 분리

### 🏗️ **아키텍처 성취**

```javascript
// Epic 3로 구축된 비즈니스 로직 아키텍처
src/basic/calculations/
├── PriceCalculator.js     // 가격 및 할인 계산 엔진
├── DiscountEngine.js      // 복잡한 할인 정책 관리 엔진
├── PointsCalculator.js    // 포인트 적립 계산 엔진
└── StockCalculator.js     // 재고 관리 및 상태 계산 엔진

// 순수 함수 기반 → 테스트 가능 → 유지보수 용이
```

### 🎯 **주요 개선점**

1. **계산 로직 완전 분리**: DOM 조작과 비즈니스 로직 분리
2. **순수 함수 아키텍처**: 입력이 같으면 항상 같은 결과
3. **테스트 커버리지**: 모든 비즈니스 로직에 대한 단위 테스트
4. **재사용성**: 각 모듈을 독립적으로 사용 가능
5. **확장성**: 새로운 비즈니스 규칙 추가 용이

### 🔄 **Legacy Code 변환**

| **기존 (main.basic.js)** | **새로운 구조**  | **개선 효과**        |
| ------------------------ | ---------------- | -------------------- |
| 복잡한 중첩 계산 로직    | PriceCalculator  | 가독성 + 테스트 가능 |
| 하드코딩된 할인 규칙     | DiscountEngine   | 정책 관리 + 확장성   |
| 포인트 계산 혼재         | PointsCalculator | 중복 제거 + 일관성   |
| 분산된 재고 관리         | StockCalculator  | 통합 관리 + 안정성   |

Epic 3을 통해 **main.basic.js가 React 컴포넌트로 전환 가능한 상태**가 되었습니다! 🚀

---

## 🏗️ 아키텍처 변화

### Before (Epic 2 완료 후)

```
src/basic/
├── constants/          ✅ Epic 2 완료
│   ├── Products.js
│   ├── DiscountPolicies.js
│   ├── PointsPolicies.js
│   ├── UIConstants.js
│   └── EventTimings.js
└── main.basic.js       ⚠️ 여전히 비즈니스 로직 혼재 (785줄)
```

### After (Epic 3 완료 후)

```
src/basic/
├── constants/          ✅ Epic 2
├── calculations/       🆕 Epic 3
│   ├── PriceCalculator.js
│   ├── DiscountEngine.js
│   ├── PointsCalculator.js
│   └── StockCalculator.js
└── main.basic.js       ✅ UI/DOM 조작만 담당 (예상 ~400줄)
```

---

## 🎯 핵심 성공 지표

### 📊 코드 품질 목표

- **함수 분리율**: 100% (모든 비즈니스 로직 분리)
- **main.basic.js 크기**: 785줄 → ~400줄 (50% 감소)
- **단위 테스트 커버리지**: 95% 이상
- **기존 테스트 통과율**: 674개 테스트 100% 통과

### 🔧 기술적 목표

- 모든 계산 로직이 순수 함수
- DOM 조작과 비즈니스 로직 완전 분리
- 테스트 가능한 독립적 모듈 구조
- JSDoc 타입 정의 100%

---

## 📈 실행 순서 및 의존성

### Phase 1: 기반 계산 모듈 (Story 3.1)

**기간**: 2-3일 | **의존성**: Epic 2 완료

- PriceCalculator 생성 및 기본 가격 계산 로직 분리
- handleCalculateCartStuff 핵심 로직 추출

### Phase 2: 할인 엔진 구축 (Story 3.2)

**기간**: 3-4일 | **의존성**: Story 3.1 완료

- DiscountEngine 생성 및 복잡한 할인 조합 로직 체계화
- 할인 우선순위 및 중복 적용 규칙 엔진화

### Phase 3: 포인트 시스템 분리 (Story 3.3)

**기간**: 4-5일 | **의존성**: Story 3.1 완료

- PointsCalculator 생성 및 포인트 계산 로직 분리
- 기존 중복 적용 로직 정확히 보존

### Phase 4: 재고 관리 통합 (Story 3.4)

**기간**: 2-3일 | **의존성**: 없음 (독립적)

- StockCalculator 생성 및 재고 관리 로직 통합
- 분산된 재고 함수들 체계화

---

## ⚠️ 주요 리스크 및 완화 전략

### 🔥 Critical Risks

1. **계산 결과 변화**: 로직 분리 과정에서 기존과 다른 결과
   - **완화**: 기존 로직 1:1 매핑, 단계별 테스트 검증

2. **테스트 실패**: 674개 기존 테스트 중 일부 실패
   - **완화**: 각 Story 완료 시마다 전체 테스트 실행

3. **복잡한 할인 조합**: 번개세일+추천할인=25% 로직 오류
   - **완화**: 기존 동작 정확히 분석 후 엔진 설계

### 🛡️ 안전 장치

- 각 Story별 롤백 지점 설정
- 기존 로직과 신규 로직 병렬 테스트
- 점진적 마이그레이션 (기존 함수 유지하며 신규 함수 추가)

---

## 🚀 Epic 3 이후 전망

### Epic 4: UI 컴포넌트 분리

- 계산 로직이 분리되면 UI 컴포넌트 분리 용이
- 컴포넌트별 단위 테스트 가능

### Epic 5: 상태 관리 개선

- 순수 함수 기반으로 상태 관리 최적화
- Observer 패턴 도입 가능

### Epic 6: 테스트 및 검증

- 분리된 모듈별 단위 테스트 추가
- 통합 테스트 및 E2E 테스트 강화

---

## 📝 참고 문서

- [Epic 3: 비즈니스 로직 분리 및 순수 함수화](../epics/epic-03-business-logic.md)
- [Brownfield Architecture 문서](../brownfield-architecture.md)
- [Epic 2 완료 상태](./story-2.3-points-ui-constants.md)

---

**Last Updated**: Epic 3 스토리 작성 완료  
**Next Action**: Story 3.1 개발 시작
