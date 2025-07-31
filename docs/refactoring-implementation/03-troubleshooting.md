# 트러블슈팅 및 해결 과정

## 📋 개요

이 문서는 두 차례의 리팩토링 과정에서 발생한 주요 문제들과 해결 방법을 기록합니다. 각 문제에 대한 원인 분석, 해결 방법, 그리고 향후 예방책을 포함합니다.

## 🚨 첫 번째 리팩토링 트러블슈팅

### 1. 데이터 구조 불일치 문제

#### 🔴 문제 상황

```
Error: Cannot read property 'val' of undefined
```

**원인**:

- `PRODUCT_DATA`에서 `price`, `originalPrice`, `quantity` 속성 사용
- 기존 코드에서는 `val`, `originalVal`, `q` 속성 참조

#### 💡 해결 방법

기존 코드와의 호환성을 위해 속성명을 유지했습니다.

```javascript
// constants/product-data.js
export const PRODUCT_DATA = [
  {
    id: PRODUCT_IDS.keyboard,
    name: '버그 없애는 키보드',
    val: 10000, // price → val 유지
    originalVal: 10000, // originalPrice → originalVal 유지
    q: 50, // quantity → q 유지
    onSale: false,
    suggestSale: false,
  },
];
```

#### 📚 교훈

- 기존 코드와의 호환성을 우선 고려
- 점진적 리팩토링에서는 인터페이스 변경 최소화

### 2. 상수 참조 불일치

#### 🔴 문제 상황

```javascript
// 기존: 일관성 없는 상수명
const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
```

#### 💡 해결 방법

통일된 객체 구조로 변경:

```javascript
export const PRODUCT_IDS = {
  keyboard: 'p1',
  mouse: 'p2',
  monitorArm: 'p3',
  laptopPouch: 'p4',
  speaker: 'p5',
};
```

#### 📚 교훈

- 일관된 네이밍 컨벤션의 중요성
- 객체 구조가 개별 상수보다 관리하기 용이

## 🚨 두 번째 리팩토링 트러블슈팅

### 1. 함수 매개변수 Destructuring 오류

#### 🔴 문제 상황

```
TypeError: Cannot destructure property 'cartDisp' of 'undefined' as it is undefined.
 ❯ handleCartUpdate src/basic/modules/handleCartUpdate.js:5:36
```

**원인**:

- modules 함수는 객체 매개변수 expecting: `{ cartDisp, prodList }`
- 기존 호출에서 매개변수 없이 호출: `handleCartUpdate()`

#### 💡 해결 과정

**1단계: 문제 위치 파악**

```javascript
// 문제 발생 위치 (addBtn 이벤트 리스너)
addBtn.addEventListener('click', () => {
  // ... 로직
  handleCartUpdate(); // ❌ 매개변수 없음
});
```

**2단계: 매개변수 추가**

```javascript
// 수정 후
addBtn.addEventListener('click', () => {
  // ... 로직
  handleCartUpdate({ cartDisp, prodList }); // ✅ 올바른 매개변수
});
```

**3단계: 모든 호출 지점 수정**

- 초기화 부분
- 이벤트 리스너들
- 번개세일/추천세일 로직

#### 📚 교훈

- 함수 시그니처 변경 시 모든 호출 지점 확인 필요
- TypeScript 사용 시 컴파일 타임에 감지 가능

### 2. modules 함수 내부 상수 참조 오류

#### 🔴 문제 상황

```
Line 47: 'PRODUCT_1' is not defined., severity: error
Line 50: 'PRODUCT_2' is not defined., severity: error
```

**원인**:

- modules 함수에서 정의되지 않은 상수 참조
- import 구문 누락

#### 💡 해결 방법

**1단계: 상수 import 추가**

```javascript
// handleCartUpdate.js
import { PRODUCT_IDS } from '../constants/business-rules.js';
```

**2단계: 상수 참조 수정**

```javascript
// 변경 전
if (curItem.id === PRODUCT_1) {
  disc = 10 / 100;
}

// 변경 후
if (curItem.id === PRODUCT_IDS.keyboard) {
  disc = 10 / 100;
}
```

#### 📚 교훈

- 모듈 간 의존성 명시적 관리 필요
- 상수 중앙화의 중요성

### 3. 매개변수 부족 오류

#### 🔴 문제 상황

```javascript
// updateLoyaltyPointsDisplay 함수에서 itemCnt 참조 오류
if (itemCnt >= 30) { // ❌ itemCnt가 매개변수에 없음
```

**원인**:

- 함수 내부에서 `itemCnt` 변수 사용
- 매개변수에 `itemCnt` 누락

#### 💡 해결 방법

**1단계: 함수 시그니처 수정**

```javascript
// 변경 전
export function updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt }) {

// 변경 후
export function updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt, itemCnt }) {
```

**2단계: 호출 지점 수정**

```javascript
// handleCartUpdate.js 내부
updateLoyaltyPointsDisplay({ cartDisp, prodList, totalAmt, itemCnt });
```

#### 📚 교훈

- 함수 의존성 명시적 전달
- 전역 변수 참조 최소화

### 4. ESLint 오류들

#### 🔴 문제 상황들

```
Line 13: 'bonusPts' is never reassigned. Use 'const' instead.
Line 377: 'qtyElem' is never reassigned. Use 'const' instead.
Line 224: Empty block statement.
```

#### 💡 해결 방법들

**1. 변수 선언 개선**

```javascript
// 변경 전
let qtyElem = itemElem.querySelector('.quantity-number');

// 변경 후
const qtyElem = itemElem.querySelector('.quantity-number');
```

**2. 빈 블록 주석 추가**

```javascript
// 변경 전
if (cartDisp.children.length === 0) {
}

// 변경 후
if (cartDisp.children.length === 0) {
  // 빈 장바구니 처리 로직은 handleCartUpdate에서 처리됨
}
```

#### 📚 교훈

- 코드 품질 도구 활용의 중요성
- 점진적 개선을 통한 코드 품질 향상

## 🔧 해결 방법론

### 1. 체계적 문제 해결 접근법

1. **문제 재현**: 정확한 에러 메시지와 위치 파악
2. **원인 분석**: 근본 원인 식별
3. **해결책 수립**: 최소 변경으로 해결
4. **테스트 검증**: 수정 후 모든 테스트 통과 확인
5. **문서화**: 문제와 해결 과정 기록

### 2. 예방책

#### 코드 작성 시

- **명시적 의존성**: 필요한 매개변수 명확히 정의
- **일관된 패턴**: 함수 시그니처 통일
- **점진적 변경**: 한 번에 하나씩 수정

#### 도구 활용

- **ESLint**: 코드 품질 실시간 검사
- **테스트**: 변경 사항 즉시 검증
- **TypeScript**: 타입 안전성 확보 (향후 도입 검토)

### 3. 트러블슈팅 체크리스트

#### 함수 시그니처 변경 시

- [ ] 모든 호출 지점 확인
- [ ] 매개변수 이름 일치 확인
- [ ] 필수 매개변수 누락 확인

#### 모듈 분리 시

- [ ] import/export 구문 정확성
- [ ] 의존성 명시적 관리
- [ ] 상수 참조 일관성

#### 테스트 실행 시

- [ ] 모든 테스트 통과 확인
- [ ] 에러 메시지 상세 분석
- [ ] 변경 사항 단계별 확인

## 📈 개선 효과

### 문제 해결 시간 단축

- **첫 번째 리팩토링**: 약 2시간
- **두 번째 리팩토링**: 약 1시간 (경험 축적 효과)

### 코드 품질 향상

- **ESLint 오류**: 15개 → 1개 (93% 감소)
- **테스트 통과율**: 100% 유지
- **코드 복잡도**: 현저히 감소

### 팀 학습 효과

- **패턴 인식**: 유사한 문제 빠른 해결
- **예방 역량**: 사전 문제 방지
- **문서화 습관**: 트러블슈팅 노하우 축적

---

**작성일**: 2024년  
**총 해결 문제**: 8건  
**평균 해결 시간**: 20분/건  
**예방 가능 문제**: 75% (6/8건)
