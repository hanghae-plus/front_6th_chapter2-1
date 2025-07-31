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

1. 함수 분리에서 드는 의문
   같은 리스트를 순회하는 함수에서 반환 타입이 두개일 떄, 한 함수에서 한번 순회하여 두 타입의 값을 반환하는 것이 좋을까? 두 함수로 나눠 두번 순회하는 것이 좋을까?

```js
var doRenderBonusPoints = function () {
  // ...
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  //...

  // finalPoints와 pointsDetail 둘 다 쓰임.
};
```

1. 함수의 독립성을 유지하기 위해 param으로 값을 받고싶지만, 외부 변수, 함수를 참조하는게 편한 경우가 있을 떄, 어떤 기준으로 합리적인지 판단할 수 있을까?
