# 반복패턴 최적화

## 🚨 코드 스멜

### **반복적인 검색 로직**

```javascript
// 10개 위치에서 동일한 for 루프 반복
for (let i = 0; i < prodList.length; i++) {
  if (prodList[i].id === productId) {
    return prodList[i];
  }
}
```

- 동일한 검색 로직이 여러 곳에 중복
- 검색 방식 변경 시 모든 위치 수정 필요

### **중첩된 if-else 구조**

```javascript
// 5단계 중첩으로 가독성 저하
if (curItem.id === KEYBOARD_ID) {
  disc = DISCOUNT_RATES.PRODUCT.KEYBOARD;
} else {
  if (curItem.id === MOUSE_ID) {
    disc = DISCOUNT_RATES.PRODUCT.MOUSE;
  } else {
    // ... 3단계 더 중첩
  }
}
```

- 깊은 중첩으로 코드 흐름 파악 어려움
- 새로운 조건 추가 시 복잡도 증가

### **반복적인 계산 로직**

```javascript
// 동일한 계산이 여러 곳에 반복
const q = parseInt(qtyElem.textContent);
const currentQty = parseInt(qtyElem.textContent);
totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
```

- 동일한 변환/포맷팅 로직 중복
- 일관성 없는 결과 발생 가능

## ⚠️ 문제 시나리오

### **검색 로직 변경 시 모든 위치 수정**

```javascript
// prodList 검색 방식을 변경해야 할 때
// 10개 위치를 모두 찾아서 수정해야 함
function handleCalculateCartStuff() {
  for (let i = 0; i < prodList.length; i++) {
    if (prodList[i].id === cartItems[i].id) {
      // 수정 필요
    }
  }
}

function doRenderBonusPoints() {
  for (let i = 0; i < prodList.length; i++) {
    if (prodList[i].id === productId) {
      // 수정 필요
    }
  }
}
// ... 8개 더
```

### **중첩 조건문으로 인한 버그 발생**

```javascript
// 새로운 상품 추가 시 중첩 구조 수정이 불편함
if (curItem.id === KEYBOARD_ID) {
  disc = DISCOUNT_RATES.PRODUCT.KEYBOARD;
} else {
  if (curItem.id === MOUSE_ID) {
    disc = DISCOUNT_RATES.PRODUCT.MOUSE;
  } else {
    if (curItem.id === NEW_PRODUCT_ID) {
      // 새로 추가
      disc = DISCOUNT_RATES.PRODUCT.NEW_PRODUCT;
    }
  }
}
```

## ✅ 개선 후 효과

### **유틸리티 함수로 통합**

```javascript
// 검색 로직 통합
const findProductById = (productId) =>
  prodList.find((product) => product.id === productId);

// 할인율 계산 통합
const getProductDiscount = (productId) => {
  const discountMap = {
    [KEYBOARD_ID]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [MOUSE_ID]: DISCOUNT_RATES.PRODUCT.MOUSE,
  };
  return discountMap[productId] || 0;
};

// 포인트 계산 통합
const getBulkBonus = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES.BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  }
  // ...
  return null;
};
```

### **코드 중복 제거**

- 14개 위치에서 반복 로직 통합
- 로직 변경 시 한 곳만 수정하면 됨

### **가독성 및 유지보수성 향상**

- 복잡한 중첩 → 간단한 함수 호출
- 새로운 기능 추가 시 확장 용이
- 테스트 및 디버깅 용이
