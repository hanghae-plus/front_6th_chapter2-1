# 상수화 & 마법 숫자 정리

## 🚨 코드 스멜

### **. 하드코딩된 값들**

```javascript
// 할인율, 수량 기준, 타이머 값들이 코드 곳곳에 산재
if (q >= 10) {
  if (curItem.id === 'p1') {
    disc = 10 / 100; // 키보드 10%
  } else if (curItem.id === 'p2') {
    disc = 15 / 100; // 마우스 15%
  }
}
if (itemCnt >= 30) {
  totalAmt = (subTot * 75) / 100;
}
points = Math.floor(totalAmt / 1000);
lightningDelay = Math.random() * 10000;
setInterval(function () {
  /* ... */
}, 30000);
```

- 특정 값 변경 시 여러 곳을 수정해야 함
- 30, 75, 1000, 10000 등의 숫자가 무엇을 의미하는지 불분명
- 실수로 다른 값을 변경할 위험

## ⚠️ 문제 시나리오

### **: 마법 숫자로 인한 실수**

```javascript
// 30개 기준을 25개로 변경하려고 했는데
if (itemCnt >= 30) {
  /* ... */
} // 여기를 25로 변경
// 다른 곳에 있는 30은 놓침
if (totalCnt >= 30) {
  /* ... */
} // 이 30은 다른 의미인데 실수로 변경
```

## ✅ 해결 방법

### **. 상수 모듈화**

```javascript
// src/constants/shopPolicy.js
export const DISCOUNT_RATES = {
  PRODUCT: {
    KEYBOARD: 0.1,
    MOUSE: 0.15,
    MONITOR_ARM: 0.2,
    LAPTOP_POUCH: 0.05,
    SPEAKER: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
  LIGHTNING: 0.2,
  SUGGEST: 0.05,
};

export const QUANTITY_THRESHOLDS = {
  ...
};

export const POINT_RATES = {
  ...
};

export const STOCK_THRESHOLDS = {
  ...
};

export const TIMER_DELAYS = {
  ...
};
```

### **. Product IDs 분리**

```javascript
// src/constants/productId.js
const KEYBOARD_ID = 'p1';
const MOUSE_ID = 'p2';
const MONITOR_ID = 'p3';
const HEADPHONE_ID = 'p4';
const SPEAKER_ID = 'p5';
```

## ✅ 개선 후 효과

### **유지보수성 향상**

- 할인율 변경 시 `constants/shopPolicy.js` 한 곳만 수정
- 새로운 상품 추가 시 `constants/productId.js`에만 추가

### **코드 가독성 향상**

- 마법 숫자 제거로 의미 명확화
- 상수명으로 기능별 구분 강화

### **실수 방지**

- 의도치 않은 값 변경 방지
- 중복된 값 정의로 인한 불일치 문제 해결

### **확장성 향상**

- 새로운 정책 추가 시 상수 파일에만 추가
- 다른 모듈에서도 동일한 상수 재사용 가능
