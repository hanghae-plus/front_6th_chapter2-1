# Chapter 2-1. 클린코드와 리팩토링 - 선언형 프로그래밍 패러다임

## 기본과제: 더티코드 개선

이번 과제는 더티코드를 클린코드의 형태로 개선을 하는 과제입니다. 주어진 테스트를 통과하면서 원래 기능과 동일한 동작을 하는 코드를 만들어주세요. basic과제는 제공되는 더티코드를 클린코드와 리팩토링 원칙에 입각해서 더 나은 코드로 만들어보세요. 주어진 테스트를 참고삼아 좋은 이름, 좋은 모양, 좋은 구조를 가지는 코드로 만들어 보세요.

[목표]
- /basic 디렉토리에 있는 더티코드를 클린코드로 리팩토링
- 바닐라스크립트를 사용해서 작성된 코드를 클린코드와 리팩토링 원칙에 입각해서 더 나은 코드로 개선
- 추후 React + Typescript로 고도화 리팩토링을 할 예정이니 이를 꼭 염두에 두고 React로 바꿔도 코드가 많이 변경되지 않도록 리팩토링

[필수조건]

- Prettier와 ESLint를 설치해서 적용할 것
- 테스트 코드 모두 통과할 것
- = 기존 기능과 동일하게 동작할 것
- = 어플리케이션 요구사항을 모두 만족할 것 (/docs/PRD.md 참고)

[과제의 취지]
- 나쁜 코드를 몸으로 충분히 느껴보고, 왜 나쁜 코드를 쓰는 것이 나쁜지 이해하기
- 나쁘지 않은 코드만으로 충분하지 않다는 것을 이해하기
- 더 좋은 코드란 무엇인지를 고민하며 나의 코드 취향과 코드 감각 이해하기


## 심화과제: 유지보수 하기 좋은 코드만들기 - 선언형 프로그래밍 패러다임

심화과제는 **기본과제에서 작성한 코드를 기술고도화를 하는 것입니다.** 바닐라 자바스크립트로 되어 있는 코드를 유지보수하기에 유리한 기술스택(React + Typescript)으로 고도화 리팩토링을 진행해주세요. 특히 **선언형 프로그래밍 패러다임**을 적용하여 "무엇을" 해결할지에 집중하는 깔끔한 코드를 작성합니다.

우리의 목표는 앞으로 유지보수를 더 잘할 수 있도록 하기 위함입니다. 최소 React와 Typescript를 이용한 코드로 개선해주세요. 그 밖의 기술선택과 폴더/파일 구조, 테스트 코드등은 자유입니다.

[목표]
- /advanced 디렉토리에 있는 기본과제 코드를 React + Typescript로 고도화 리팩토링
- /basic 기본과제에서 작성한 코드를 복사해서 /advanced 디렉토리에서 고도화 리팩토링 진행
- 기본과제에서 작성한 코드를 React + Typescript로 고도화 리팩토링
- **선언형 프로그래밍 패러다임 적용**: "무엇을" 해결할지에 집중하는 함수형 프로그래밍

[선언형 프로그래밍 패러다임 적용]
- **"무엇을" 해결할지에 집중**: 함수명과 목적이 명확히 표현
- **"어떻게" 해결할지는 추상화**: 복잡한 로직을 작은 순수 함수들로 분해
- **함수형 프로그래밍 패턴**: reduce, map, filter, 삼항 연산자 활용
- **불변성과 순수성**: const 사용, 부수 효과 없는 함수
- **높은 수준의 추상화**: 재사용 가능한 순수 함수들

[과제의 취지]
- React가 어떻게 유지보수하기 좋은 코드로 만들어주는지 이해하기
- Typescript가 어떻게 유지보수하기 좋은 코드로 만들어주는지 이해하기
- **선언형 프로그래밍이 어떻게 코드의 가독성과 유지보수성을 향상시키는지 이해하기**
- 내가 추구하는 좋은 코드와 React가 추구하는 코드와 어떻게 다른지 이해하기

## 📊 현재 진행 상황

### Phase 1: 기반 구조 설정 ✅
- [x] TypeScript 환경 설정 및 타입 시스템 구축
- [x] 선언형 유틸리티 함수 구현 (calculations, discounts, points, formatters, validators)
- [x] 함수형 프로그래밍 패턴 적용
- [x] 76개 테스트 모두 통과

### Phase 2: 핵심 로직 마이그레이션 ✅
- [x] 선언형 계산 함수 구현
- [x] 선언형 할인 계산 함수 구현
- [x] 선언형 포인트 계산 함수 구현
- [x] 선언형 포맷팅 및 검증 함수 구현

### Phase 3: UI 컴포넌트 마이그레이션 🔄
- [ ] 선언형 React 컴포넌트 구현
- [ ] 선언형 Hook 구현
- [ ] 선언형 Context API 구현

### Phase 4: 테스트 및 최적화 🔄
- [ ] 선언형 컴포넌트 테스트
- [ ] 선언형 성능 최적화
- [ ] 선언형 코드 품질 검증

## 🎯 선언형 프로그래밍 패러다임의 핵심

### "무엇을" 해결할지에 집중
```typescript
// 명령형 (기존)
function calculateDiscount(totalAmount: number, policies: DiscountPolicy[]): number {
  let totalDiscount = 0;
  for (const policy of policies) {
    if (totalAmount >= (policy.minAmount || 0)) {
      let discount = 0;
      if (policy.type === "percentage") {
        discount = totalAmount * (policy.value / 100);
      } else {
        discount = policy.value;
      }
      if (policy.maxDiscount) {
        discount = Math.min(discount, policy.maxDiscount);
      }
      totalDiscount += discount;
    }
  }
  return totalDiscount;
}

// 선언형 (변환 후)
const calculatePolicyDiscount = (totalAmount: number, policy: DiscountPolicy): number => {
  if (totalAmount < (policy.minAmount || 0)) return 0;
  const discount = policy.type === "percentage" 
    ? totalAmount * (policy.value / 100)
    : policy.value;
  return policy.maxDiscount ? Math.min(discount, policy.maxDiscount) : discount;
};

export const calculateTotalDiscount = (
  totalAmount: number,
  policies: DiscountPolicy[],
): number => policies.reduce(
  (total, policy) => total + calculatePolicyDiscount(totalAmount, policy),
  0,
);
```

### 함수형 프로그래밍 패턴 적용
```typescript
// 조건문 → 삼항 연산자
export const calculateBulkDiscount = (totalQuantity: number): number => 
  totalQuantity >= 30 ? 0.25 : 0;

// for 루프 → reduce
export const calculateCartTotals = (items: CartItem[]) => ({
  subtotal: items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0),
  discount: items.reduce((sum, item) => sum + calculateItemDiscount(item), 0),
});

// 복잡한 로직 → 작은 순수 함수들로 분해
const determineDiscountType = (...) => { /* 로직 */ };
const applyTuesdayDiscount = (...) => { /* 로직 */ };
export const calculateFinalDiscount = ({...}) => {
  // "무엇을" 계산할지만 명시
};
```

## 요청사항

과제를 진행할 떄 AI를 쓰는 것은 자유입니다. 오히려 AI를 활용하는 연습을 해야하는게 시대의 흐름이겠지요.
다만 AI를 쓰더라도 최대한 조금씩 조금씩 이전 코드와 지금 코드를 그대로 유지하면서 리팩토링하는 감각을 기르기 위함이나,
AI에게 최대한 조금씩 그러나 구체적으로 요청하며 한번에 많은 코드를 바꾸지 않도록 하는 연습을 해보세요.

**특히 선언형 프로그래밍 패러다임을 적용할 때는 "무엇을" 해결할지에 집중하여 점진적으로 코드를 개선해보세요.**
