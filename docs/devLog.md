# 클린코드와 리팩토링

## 트러블 슈팅

1. 함수 선언부, 호출부 순서 혼재로 인한 이슈

```js
function main() {
  // ...
  const rightColumn = document.createElement('div');
  rightColumn.innerHTML = `<div id="cart-total>...</div>`;
  // ...
}

const sum = document.querySelector('#cart-total');

main();
```

위 코드 순서 때문에 테스트 통과를 못해 어디가 문제인지 30분 동안 찾았다.
선언부와 호출부 등이 혼잡한 코드는 생성되지도 않은 DOM에 접근하려고 애쓰게 만드는구나.
