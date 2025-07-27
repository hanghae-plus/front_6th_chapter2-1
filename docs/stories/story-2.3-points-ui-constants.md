# Story 2.3: 포인트 정책 및 UI 상수화

## Story Overview

**Epic**: 2 - 상수 및 데이터 구조 정리  
**Story ID**: 2.3  
**Story Name**: 포인트 정책 및 UI 상수화  
**Priority**: High  
**Estimation**: 13 Story Points  
**Status**: ⚠️ **Partially Complete**

**선행 조건**: Story 2.1, 2.2 완료 ✅

## User Story

**As a** 개발자  
**I want** 포인트 적립 규칙과 UI 관련 상수가 분리된 구조  
**So that** 정책 변경과 UI 변경을 독립적으로 관리할 수 있다

## Problem Statement

현재 포인트 계산 로직과 UI 메시지들이 main.basic.js 전체에 하드코딩되어 있어 정책 변경 시 코드 여러 곳을 수정해야 합니다:

```javascript
// 하드코딩된 포인트 계산
basePoints = Math.floor(totalAmt / 1000); // 0.1% 적립률
finalPoints = finalPoints + 50; // 세트 보너스
pointsDetail.push('키보드+마우스 세트 +50p'); // UI 메시지

// 하드코딩된 UI 템플릿
loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
```

## Acceptance Criteria

### 🔧 **Technical Requirements**

- [ ] `src/basic/constants/PointsPolicies.js` 생성
- [ ] `src/basic/constants/UIConstants.js` 생성
- [ ] `src/basic/constants/EventTimings.js` 생성
- [ ] 모든 하드코딩된 포인트 계산 로직 상수화
- [ ] 모든 UI 메시지 템플릿화
- [ ] 이용 안내 매뉴얼 데이터 기반 생성

### 🎯 **Functional Requirements**

#### **포인트 정책 상수화**

- [ ] **기본 적립률**: 0.1% (1000원당 1포인트) 상수화
- [ ] **보너스 포인트**: 세트(+50p), 풀세트(+100p), 대량구매 보너스 상수화
- [ ] **화요일 배수**: 2배 적립 상수화
- [ ] **대량구매 임계값**: 10개, 20개, 30개 상수화

#### **UI 메시지 템플릿화**

- [ ] **포인트 표시**: "적립 포인트: {points}p", "기본: {points}p" 템플릿화
- [ ] **할인 표시**: "🎉 대량구매 할인 ({threshold}개 이상)" 템플릿화
- [ ] **재고 메시지**: "재고 부족 ({count}개 남음)", "품절" 템플릿화
- [ ] **장바구니**: "🛍️ {count} items in cart" 템플릿화

#### **이용 안내 데이터화**

- [ ] **할인 정책 설명**: 데이터 기반으로 자동 생성
- [ ] **포인트 정책 설명**: 데이터 기반으로 자동 생성
- [ ] **다국어 지원 준비**: 메시지 키-값 구조

### ✅ **Validation Requirements**

- [ ] 86개 기존 테스트 모두 통과
- [ ] 포인트 계산 정확성 유지
- [ ] UI 표시 정상 작동
- [ ] 이용 안내 내용 정확성

## Tasks

### Task 1: PointsPolicies.js 생성

- [ ] TypeScript 인터페이스 정의
- [ ] 기본 적립률 및 보너스 정책 상수 정의
- [ ] 포인트 계산 유틸 함수 생성

### Task 2: UIConstants.js 생성

- [ ] 메시지 템플릿 상수 정의
- [ ] 이모지 및 스타일 클래스 상수화
- [ ] 숫자 포매팅 템플릿 정의

### Task 3: EventTimings.js 생성

- [ ] 번개세일, 추천할인 타이밍 설정
- [ ] 요일별 특별 혜택 설정
- [ ] 재고 경고 임계값 설정

### Task 4: 포인트 계산 로직 리팩터링

- [ ] doRenderBonusPoints() 함수 상수 적용
- [ ] 하드코딩된 포인트 수치 제거
- [ ] 메시지 생성 로직 템플릿화

### Task 5: UI 메시지 시스템 리팩터링

- [ ] 할인 정보 표시 템플릿화
- [ ] 재고 정보 표시 템플릿화
- [ ] 장바구니 상태 표시 템플릿화

### Task 6: 이용 안내 시스템 리팩터링

- [ ] 매뉴얼 콘텐츠 데이터화
- [ ] 동적 매뉴얼 생성 함수 구현
- [ ] 정책 변경 시 자동 업데이트

### Task 7: 테스트 및 검증

- [ ] 포인트 계산 정확성 검증
- [ ] UI 메시지 표시 정확성 검증
- [ ] 매뉴얼 내용 정확성 검증

## Definition of Done

- [ ] 모든 매직넘버 제거 (0.1%, 50p, 100p 등)
- [ ] PointsPolicies.js, UIConstants.js, EventTimings.js 완성
- [ ] 이용 안내 매뉴얼 데이터 기반 생성
- [ ] 86개 테스트 모두 통과
- [ ] UI/UX 정책 변경 가이드라인 문서화

## Implementation Notes

### 현재 하드코딩된 위치들

#### **포인트 계산 (9개 위치)**

1. **Line 461**: `Math.floor(totalAmt / 1000)` - 기본 적립률
2. **Line 470**: `basePoints * 2` - 화요일 배수
3. **Line 484**: `+50` - 키보드+마우스 세트 보너스
4. **Line 488**: `+100` - 풀세트 보너스
5. **Line 492**: `+100` - 30개 이상 대량구매
6. **Line 495**: `+50` - 20개 이상 대량구매
7. **Line 498**: `+20` - 10개 이상 대량구매
8. **Line 484**: `'키보드+마우스 세트 +50p'` - 메시지
9. **Line 488**: `'풀세트 구매 +100p'` - 메시지

#### **UI 메시지 (15+ 위치)**

1. **Line 466**: `'적립 포인트: ' + points + 'p'`
2. **Line 469**: `'기본: ' + basePoints + 'p'`
3. **Line 471**: `'화요일 2배'`
4. **Line 433**: `'🎉 대량구매 할인 (30개 이상)'`
5. **Line 447**: `'🌟 화요일 추가 할인'`
6. **Line 505**: `stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n'`
7. **Line 507**: `stockMsg + item.name + ': 품절\n'`

#### **이용 안내 매뉴얼 (Line 125-183)**

- 전체 HTML 콘텐츠 100+ 라인 하드코딩

### 제안된 구조

```javascript
// PointsPolicies.js
export const POINTS_RATES = {
  BASE_RATE: 0.001, // 0.1% (1000원당 1포인트)
  TUESDAY_MULTIPLIER: 2,
  BONUS_POINTS: {
    KEYBOARD_MOUSE_SET: 50,
    FULL_SET: 100,
    BULK_10: 20,
    BULK_20: 50,
    BULK_30: 100,
  },
};

// UIConstants.js
export const UI_MESSAGES = {
  POINTS: {
    EARNED: '적립 포인트: {points}p',
    BASE: '기본: {points}p',
    TUESDAY_DOUBLE: '화요일 2배',
    SET_BONUS: '키보드+마우스 세트 +{points}p',
  },
  DISCOUNT: {
    BULK_PURCHASE: '🎉 대량구매 할인 ({threshold}개 이상)',
    TUESDAY_SPECIAL: '🌟 화요일 추가 할인',
  },
  STOCK: {
    LOW_STOCK: '재고 부족 ({count}개 남음)',
    OUT_OF_STOCK: '품절',
  },
};

// EventTimings.js
export const EVENT_SETTINGS = {
  FLASH_SALE: { startTime: 40000, duration: 40000 },
  RECOMMENDATION: { startTime: 80000, duration: 40000 },
  STOCK_WARNING_THRESHOLD: 5,
  BULK_THRESHOLDS: [10, 20, 30],
};
```

### 매뉴얼 데이터 구조

```javascript
export const MANUAL_DATA = {
  discountPolicies: [
    { type: 'individual', products: [...], threshold: 10 },
    { type: 'bulk', threshold: 30, rate: 25 },
    { type: 'special', name: '화요일', rate: 10 }
  ],
  pointsPolicies: [
    { type: 'base', rate: 0.1 },
    { type: 'tuesday', multiplier: 2 },
    { type: 'set', bonus: 50 }
  ]
};
```

## Business Value

- **정책 변경 유연성**: 포인트 정책 변경 시 코드 수정 없이 설정만 변경
- **UI 일관성**: 모든 메시지가 템플릿 기반으로 일관된 형식
- **다국어 준비**: 메시지 키-값 구조로 다국어 지원 기반 마련
- **유지보수성**: UI와 비즈니스 로직 완전 분리

## Risks & Mitigation

- **위험**: 포인트 계산 로직 변경 시 적립 오류
- **완화**: 포인트 관련 테스트 케이스로 즉시 검증
- **위험**: UI 메시지 템플릿 오류로 표시 문제
- **완화**: UI 표시 관련 테스트로 검증

## Dependencies

- Story 2.1, 2.2 완료 (Products.js, DiscountPolicies.js)
- 포인트 관련 테스트 케이스 (86개 중 포인트 관련 15개)

## Success Metrics

- 하드코딩된 포인트 수치 제거율: 100%
- UI 메시지 템플릿화율: 100%
- 매뉴얼 데이터화율: 100%
- 테스트 통과율: 100% 유지

## Change Log

- 2024-12-19: Story 생성 및 현황 분석 완료
- 2024-12-19: ✅ **Tasks 1-3 완료** - 상수 파일 3개 생성 (PointsPolicies, UIConstants, EventTimings)
- 2024-12-19: ✅ **Task 4 부분 완료** - 포인트 계산 로직 함수화 2개 완료, 86개 테스트 통과

## Dev Agent Record

### Agent Model Used

- Claude 3.5 Sonnet (Senior Frontend Developer - Juno)

### Tasks Progress

- [x] Task 1: PointsPolicies.js 상수 파일 생성 ✅ **완료**
- [x] Task 2: UIConstants.js 상수 파일 생성 ✅ **완료**  
- [x] Task 3: EventTimings.js 상수 파일 생성 ✅ **완료**
- [x] **Task 4: 포인트 계산 로직 리팩터링** ⚠️ **부분 완료**
- [ ] Task 5: UI 메시지 시스템 리팩터링
- [ ] Task 6: 이용 안내 시스템 리팩터링
- [ ] Task 7: 테스트 및 검증

### Debug Log References

- 기준선 테스트: 86 passed | 16 skipped (102 total)
- ✅ **Tasks 1-3 완료**: 3개 상수 파일 생성 (567개 라인 추가)
- ✅ **Task 4 부분 완료**: 기본 포인트 계산 함수화
  - Step 1: `Math.floor(totalAmt / 1000)` → `calculateBasePoints(totalAmt)` ✅
  - Step 2: `basePoints * 2` → `calculateTuesdayPoints(basePoints)` ✅
- ✅ **안전한 단계별 리팩터링**: 각 단계마다 86개 테스트 통과 확인

### Completion Notes

**현재 상태**: ⚠️ **부분 완료 (Tasks 1-4 부분)**

**성공적으로 완료된 작업**:

1. ✅ **PointsPolicies.js** 생성 완료 (194 라인)
   - 포인트 적립률, 보너스 정책, 메시지 템플릿 상수 정의
   - calculateBasePoints, calculateTuesdayPoints, calculateTotalPoints 함수
   - TypeScript JSDoc 인터페이스 완비

2. ✅ **UIConstants.js** 생성 완료 (200+ 라인) 
   - POINTS_UI, DISCOUNT_UI, STOCK_UI, CART_UI 메시지 템플릿
   - formatMessage, formatCurrency, formatPoints 유틸 함수
   - 다국어 준비 기반 구조

3. ✅ **EventTimings.js** 생성 완료 (170+ 라인)
   - EVENT_TIMINGS, SPECIAL_DAYS, STOCK_THRESHOLDS 상수
   - getCurrentSpecialDay, isEventActive 유틸 함수

4. ✅ **포인트 계산 로직 부분 리팩터링**:
   - 하드코딩된 기본 포인트 계산 → `calculateBasePoints()` 함수 ✅  
   - 하드코딩된 화요일 2배 계산 → `calculateTuesdayPoints()` 함수 ✅
   - 86개 테스트 통과 유지 ✅

**남은 하드코딩 항목들**:
- 보너스 포인트: +50 (키보드+마우스), +100 (풀세트), +20/+50/+100 (대량구매)
- UI 메시지: '기본:', '화요일 2배', '키보드+마우스 세트 +50p' 등
- 이용 안내 매뉴얼: 100+ 라인 하드코딩된 HTML

**Git Commits**:
- `f730944`: feat(basic): create points and UI constants structure (567+ insertions)
- `21cb1b3`: refactor(basic): replace hardcoded point calculations with functions (17 insertions, 2 deletions)
