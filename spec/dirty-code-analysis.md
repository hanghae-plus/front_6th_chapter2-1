# 더티코드 분석 보고서

## 개요
본 문서는 `/src/basic/main.basic.js` 파일의 클린코드 관점에서의 문제점들을 상세히 분석한 결과입니다.

## 코드 현황
- **전체 라인 수**: 787줄
- **전역 변수**: 14개
- **함수 수**: 8개
- **가장 긴 함수**: `main()` (235줄), `handleCalculateCartStuff()` (240줄)

## 문제점 분석

### 1. 네이밍 문제점

#### 1.1 일관성 없는 변수명
**문제 코드 (라인 9-13):**
```javascript
var PRODUCT_ONE = 'p1'  // 대문자 스네이크 케이스
var p2 = 'p2'           // 소문자
var product_3 = 'p3'    // 스네이크 케이스  
var p4 = "p4"           // 소문자 (다른 따옴표)
var PRODUCT_5 = `p5`    // 백틱 사용
```

**영향:**
- 코드 일관성 부족으로 가독성 저하
- 팀 개발 시 혼란 야기
- 실수 유발 가능성 증가

#### 1.2 의미 불명확한 변수명
**문제 코드:**
```javascript
// 라인 242, 106: 역할이 불분명
var sum  // 무엇의 합계인지 알 수 없음
sum = rightColumn.querySelector('#cart-total');

// 라인 250, 259: 임시 변수명
var _p = prodList[idx];  // 언더스코어 접두사
var opt;                 // 축약형

// 라인 624: 무의미한 변수명  
var totalCount = 0, j = 0;
```

**영향:**
- 코드 이해도 저하
- 디버깅 시 변수 역할 파악 어려움
- 코드 리뷰 효율성 감소

#### 1.3 축약형 남용
**문제 코드:**
```javascript
var sel, addBtn, cartDisp, prodList, itemCnt, totalAmt, subTot, disc, qtyElem, curItem
```

**영향:**
- 가독성 저하
- 새로운 개발자의 코드 이해 시간 증가
- IDE 자동완성 효과 감소

### 2. 함수 설계 문제점

#### 2.1 거대한 함수들
**문제 코드:**
```javascript
// 라인 15-250: main() 함수 (235줄)
function main() {
  // DOM 요소 생성, 이벤트 리스너, 타이머 설정, 초기화 등
  // 모든 것을 한 함수에서 처리
}

// 라인 288-528: handleCalculateCartStuff() 함수 (240줄)  
function handleCalculateCartStuff() {
  // 장바구니 계산, DOM 업데이트, 할인 적용, 포인트 계산 등
  // 여러 책임을 하나의 함수에서 처리
}
```

**영향:**
- 단일 책임 원칙(SRP) 위반
- 테스트 작성 어려움
- 함수 이해도 저하
- 버그 발생 시 디버깅 복잡성 증가

#### 2.2 매개변수 없는 함수들
**문제 코드:**
```javascript
// 라인 252, 297, 529: 전역 변수에 의존
function onUpdateSelectOptions() { /* 전역 변수 사용 */ }
function handleCalculateCartStuff() { /* 전역 변수 사용 */ }
var doRenderBonusPoints = function() { /* 전역 변수 사용 */ }
```

**영향:**
- 함수의 입출력이 명확하지 않음
- 테스트 시 전역 상태 모킹 필요
- 부작용(side effect) 예측 어려움
- 함수 재사용성 저하

### 3. 코드 구조 문제점

#### 3.1 전역 변수 남용
**문제 코드 (라인 1-14):**
```javascript
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var sel
var addBtn
var totalAmt = 0
// ... 총 14개의 전역 변수
```

**영향:**
- 전역 네임스페이스 오염
- 변수 충돌 위험성
- 의존성 관리 복잡성
- 메모리 누수 가능성

#### 3.2 DOM 조작과 비즈니스 로직 혼재
**문제 코드 (라인 355-379):**
```javascript
if (q >= 10) {
  if (curItem.id === PRODUCT_ONE) {
    disc = 10 / 100;  // 비즈니스 로직
  }
  // DOM 조작이 비즈니스 로직과 섞여있음
  elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
}
```

**영향:**
- 관심사 분리 원칙 위반
- 테스트 어려움 (DOM 모킹 필요)
- 비즈니스 로직 재사용 불가
- 유지보수성 저하

#### 3.3 중복 코드
**문제 코드 - 상품 검색 로직이 여러 곳에 중복:**
```javascript
// 라인 333-337, 413-417, 661-665, 756-760
for (var j = 0; j < prodList.length; j++) {
  if (prodList[j].id === cartItems[i].id) {
    curItem = prodList[j];
    break;
  }
}
```

**영향:**
- DRY 원칙 위반
- 수정 시 여러 곳 변경 필요
- 버그 발생 시 모든 중복 부분 확인 필요
- 코드 부피 증가

### 4. 가독성 문제점

#### 4.1 복잡한 중첩 조건문
**문제 코드 (라인 355-374):**
```javascript
if (q >= 10) {
  if (curItem.id === PRODUCT_ONE) {
    disc = 10 / 100;
  } else {
    if (curItem.id === p2) {
      disc = 15 / 100;
    } else {
      if (curItem.id === product_3) {
        disc = 20 / 100;
      } else {
        if (curItem.id === p4) {
          disc = 5 / 100;
        } else {
          if (curItem.id === PRODUCT_5) {
            disc = 25 / 100;
          }
        }
      }
    }
  }
}
```

**영향:**
- 가독성 현저히 저하
- 실수 발생 가능성 높음
- 새로운 조건 추가 시 복잡성 증가
- 코드 리뷰 어려움

#### 4.2 매직넘버와 하드코딩
**문제 코드:**
```javascript
// 라인 214, 220: 의미 불분명한 숫자들
luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);  // 20% 할인을 80%로 표현
setTimeout(..., 30000);  // 30초
setTimeout(..., 60000);  // 60초

// 라인 291, 282: 임계값들
if (totalStock < 50) {    // 50개
if (item.q < 5) {         // 5개

// 할인율 하드코딩
disc = 10 / 100;   // 키보드 할인율
disc = 15 / 100;   // 마우스 할인율
if (today.getDay() === 2) {  // 화요일 (2)
```

**영향:**
- 비즈니스 규칙 변경 시 코드 전체 수정 필요
- 숫자의 의미 파악 어려움
- 설정 변경 시 개발자 개입 필요
- 실수로 인한 버그 발생 가능성

#### 4.3 일관성 없는 코딩 스타일
**문제 코드:**
```javascript
// 따옴표 사용 불일치
var p2 = 'p2'           // 작은따옴표
var p4 = "p4"           // 큰따옴표  
var PRODUCT_5 = `p5`    // 백틱

// 객체 접근 방식 불일치
leftColumn['className'] = '...'  // 대괄호 표기법
qtyElem.textContent             // 점 표기법
```

**영향:**
- 코드 일관성 부족
- 팀 개발 시 혼란
- 코드 품질 저하

### 5. 유지보수성 문제점

#### 5.1 테스트하기 어려운 구조
**문제점:**
- 전역 변수 의존으로 단위 테스트 어려움
- `setTimeout`, `setInterval` 등 비동기 코드로 테스트 복잡성 증가
- DOM 조작과 로직이 혼재되어 모킹 필요
- 거대한 함수들로 인한 테스트 케이스 작성 어려움

#### 5.2 의존성 문제
**문제점:**
- 모든 함수가 전역 변수에 의존
- DOM 요소에 직접 의존
- 타이머와 이벤트 리스너가 복잡하게 얽혀있음
- 순환 의존성 가능성

#### 5.3 확장성 제약
**문제점:**
- 새 상품 추가 시 여러 곳 수정 필요
- 할인 정책 변경 시 하드코딩된 값들 일일이 수정
- 새 기능 추가 시 기존 거대한 함수들 수정 불가피
- 코드 재사용성 매우 낮음

#### 5.4 무의미한 코드
**문제 코드:**
```javascript
// 라인 217, 224, 631, 610, 758, 783: 빈 if 블록들
if (cartDisp.children.length === 0) {
  // 빈 블록
}
if (totalStock < 30) {
  // 빈 블록  
}
```

**영향:**
- 코드 이해 혼란
- 불필요한 조건문으로 성능 저하
- 미완성 코드로 인한 버그 가능성

## 심각도 평가

### 🔴 높음 (즉시 해결 필요)
- 거대한 함수들 (main, handleCalculateCartStuff)
- 전역 변수 남용 (14개)
- 중복 코드 (상품 검색 로직)

### 🟡 중간 (우선적 해결 권장)  
- 매직넘버 하드코딩
- 복잡한 중첩 조건문
- DOM과 비즈니스 로직 혼재

### 🟢 낮음 (점진적 개선)
- 네이밍 일관성
- 코딩 스타일 통일
- 무의미한 빈 블록 제거

## 결론
현재 코드는 클린코드 원칙을 거의 준수하지 않는 전형적인 더티코드입니다. 특히 함수 분리, 전역 변수 제거, 중복 코드 제거가 가장 시급한 개선 사항입니다. 전면적인 리팩토링을 통해 유지보수성, 테스트 용이성, 확장성을 크게 개선할 수 있을 것으로 판단됩니다.