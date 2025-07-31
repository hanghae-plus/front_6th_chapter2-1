# var → let/const 변환

## 🚨 코드 스멜

### **전역 변수 오염**

```javascript
// 모든 변수가 전역에 노출
var prodList;
var bonusPts = 0;
var stockInfo;
var itemCnt;
var lastSel;
...
```

- 모든 변수가 전역에 노출되어 다른 스크립트와 충돌 가능
- 어디서든 접근 가능해서 의도치 않은 변경 위험

### **var의 재선언이 가능한 특징**

```javascript
function main() {
  var root, header, gridContainer;
  // ... 50줄 후 ...
  var root = document.getElementById('app');
}
```

- 같은 변수를 여러 번 선언하는 패턴이 가능하여 최초 선언인지 아닌지 구분이 어려움
- 변수 선언과 사용이 멀리 떨어져서 코드 흐름 파악 어려움

### **호이스팅**

- 전역 변수가 이미 window에 등록되어 있어서 선언 전 출력 시에도 에러가 아닌 undefined 반환

## ⚠️ 문제 시나리오

### **. 팀원간 동일 변수명 선언으로 인해 꼬이는것**

```javascript
// main.js (팀원A)
var totalPrice = 1000;
var discountRate = 0.1;

// cart.js (팀원B)
var totalPrice = 500; // main.js의 totalPrice를 덮어씀!
var discountRate = 0.2; // 기존 할인율도 덮어씀!
```

### **. 상수를 var로 선언하여 재할당되는 상황**

```javascript
// 상수로 사용해야 할 값이 변경됨
var TAX_RATE = 0.1;
var SHIPPING_FEE = 3000;

// 실수로 재할당
TAX_RATE = 'invalid'; // 타입 변경으로 계산 오류 발생
SHIPPING_FEE = 0; // 배송비가 0원이 되어버림
```

## ✅ 개선 후 효과

### **스코프 통일할 수 있음**

- var, let, const 혼용으로 인한 스코프 혼동 방지

### **재선언을 감시할 필요가 없음**

- let/const 재선언 시 즉시 에러로 실수 사전 방지
- 팀원 간 변수명 충돌 문제 근본 해결

### **호이스팅에 대한 고민을 할 필요가 없음**

- 선언 전 접근 시 명확한 에러로 디버깅 용이
- 코드 실행 순서가 선언 순서와 일치하여 가독성 향상
