[GitHub - Youngerjesus/refactoring-2nd-edition: 마틴 파울러 님의 리팩토링을 읽고 정리한 레파지토리입니다.](https://github.com/Youngerjesus/refactoring-2nd-edition?tab=readme-ov-file)

[Refactoring and Design Patterns](https://refactoring.guru/)

[Catalog of Refactorings](https://refactoring.com/catalog/)

# 클린코드 개요

클린코드란 가독성이 높고, 이해하기 쉬우며, 유지보수가 용이한 코드를 의미합니다. 마틴 파울러의 "리팩토링" 책에서는 이를 "냄새 나는 코드"를 제거하고 코드의 품질을 향상시키는 과정으로 설명합니다.

# 왜 해야 하는가

<aside>
💡 **짧게 정리**

- 유지보수성 향상: 클린코드는 다른 개발자들이 쉽게 이해하고 수정할 수 있게 합니다.
- 버그 감소: 명확하고 간결한 코드는 버그를 줄이고 디버깅을 용이하게 합니다.
- 개발 속도 향상: 장기적으로 볼 때, 클린코드는 개발 속도를 높이고 프로젝트의 수명을 연장합니다.
- 협업 개선: 팀 내에서 일관된 코드 스타일을 유지하여 협업을 원활하게 합니다.
</aside>

## 유지보수성 향상

- 코드 이해 시간 단축: 클린 코드는 직관적이고 자체 설명적이어서, 새로운 개발자가 프로젝트에 참여하거나 기존 개발자가 오래된 코드를 revisit할 때 빠르게 이해할 수 있습니다.
- 변경 용이성: 잘 구조화된 코드는 새로운 기능 추가나 기존 기능 수정 시 영향 범위를 최소화하며, 예측 가능한 방식으로 변경할 수 있습니다.
- 기술 부채 감소: 클린 코드 작성은 시간이 지나도 코드의 품질을 유지하여, 향후 대규모 리팩토링의 필요성을 줄입니다.

## 버그 감소

- 가독성 향상: 명확한 코드는 논리적 오류를 쉽게 발견할 수 있게 합니다.
- 부작용 최소화: 함수의 책임을 명확히 하고 부수 효과를 줄임으로써, 예기치 않은 버그 발생을 방지합니다.
- 테스트 용이성: 클린 코드는 단위 테스트 작성을 쉽게 만들어, 버그를 사전에 발견하고 수정할 수 있습니다.
- 디버깅 효율성: 문제 발생 시, 명확한 구조와 네이밍으로 인해 버그의 원인을 빠르게 추적할 수 있습니다.

## 개발 속도 향상

- 초기 개발 속도 vs 장기적 이익: 클린 코드 작성에 초기에는 시간이 더 걸릴 수 있지만, 장기적으로는 유지보수와 기능 추가가 쉬워져 전체적인 개발 속도가 향상됩니다.
- 재사용성 증가: 잘 설계된 모듈과 함수는 다른 부분에서 쉽게 재사용될 수 있어, 중복 작업을 줄이고 개발 속도를 높입니다.
- 리팩토링 시간 감소: 지속적으로 클린 코드를 유지하면, 대규모 리팩토링에 들이는 시간을 줄일 수 있습니다.
- 문서화 필요성 감소: 자체 설명적인 코드는 별도의 문서화 필요성을 줄여, 문서 작성과 유지보수에 드는 시간을 절약합니다.

## 협업 개선

- 코드 리뷰 효율성: 클린 코드는 리뷰 과정을 더 효율적으로 만들어, 팀원 간의 피드백과 지식 공유를 촉진합니다.
- 일관성 유지: 팀 내에서 합의된 코딩 표준을 따르면, 여러 개발자가 작성한 코드도 일관성을 유지할 수 있습니다.
- 의사소통 개선: 명확한 네이밍과 구조는 코드를 통한 의사소통을 원활하게 하여, 팀원 간의 이해도를 높입니다.
- 온보딩 시간 단축: 새로운 팀원이 프로젝트에 참여할 때, 클린 코드는 빠른 적응을 도와 생산성을 높입니다.
- 책임 소재 명확화: 잘 구조화된 코드는 각 부분의 책임이 명확해져, 문제 발생 시 해당 부분을 담당하는 팀원을 쉽게 식별할 수 있습니다.

이러한 세부적인 이점들이 모여 전체적인 소프트웨어 개발 프로세스의 효율성과 품질을 크게 향상시킵니다. 클린 코드는 단순히 "좋은 습관"이 아니라, **프로젝트의 성공과 팀의 생산성에 직접적인 영향을 미치는 중요한 실천 사항**입니다.

# 무엇을 해야 하는가

<aside>
💡 **짧게 정리**

- 의미 있는 이름 사용
- 함수를 작고 단일 책임을 가지도록 만들기
- 중복 코드 제거
- 주석 대신 자체 설명적인 코드 작성
- 일관된 포맷팅 유지
- 복잡한 조건문 단순화
- 적절한 추상화 수준 유지
</aside>

## 의미 있는 이름 사용

- 변수, 함수, 클래스에 그 목적과 역할을 명확히 나타내는 이름을 부여합니다.
- 약어나 모호한 단어 사용을 피하고, 구체적이고 서술적인 이름을 선택합니다.
- 네이밍 컨벤션을 일관성 있게 유지합니다 (예: camelCase, PascalCase).
- 컨텍스트를 고려하여 불필요한 정보는 제거합니다.
  예: `getUserInfo()` 대신 `fetchUserProfile()`

## 함수를 작고 단일 책임을 가지도록 만들기

- 각 함수는 한 가지 작업만 수행하도록 합니다.
- 함수의 길이를 20-30줄 이내로 유지합니다.
- 함수의 매개변수 수를 3개 이하로 제한합니다.
- 부수 효과(side effects)를 최소화하고, 있다면 명확히 표현합니다.
- 추상화 수준을 일관되게 유지합니다.
  예: 큰 함수를 여러 개의 작은 함수로 분리하여 각각의 역할을 명확히 합니다.

## 중복 코드 제거

- DRY (Don't Repeat Yourself) 원칙을 적용합니다.
- 반복되는 코드 패턴을 식별하고 공통 함수나 모듈로 추출합니다.
- 상속, 컴포지션, 고차 함수 등을 활용하여 코드 재사용성을 높입니다.
- 유틸리티 함수나 헬퍼 클래스를 만들어 공통 기능을 모듈화합니다.
  예: 여러 곳에서 사용되는 날짜 포맷팅 로직을 하나의 유틸리티 함수로 만듭니다.

## 주석 대신 자체 설명적인 코드 작성

- 코드 자체로 의도와 동작을 명확히 표현합니다.
- 복잡한 알고리즘이나 비즈니스 로직의 경우에만 주석을 사용합니다.
- 주석 대신 함수 이름이나 변수 이름으로 의도를 표현합니다.
- 주석이 필요한 경우, 'why'에 초점을 맞춥니다.
  예: `// 사용자 나이 계산` 주석 대신 `calculateUserAge()` 함수 사용

## 일관된 포맷팅 유지

- 팀 내에서 합의된 코딩 스타일 가이드를 따릅니다.
- 들여쓰기, 중괄호 위치, 공백 사용 등을 일관되게 유지합니다.
- 자동 포맷터(예: Prettier)를 사용하여 일관성을 강제합니다.
- 파일, 클래스, 함수의 구조를 일관되게 유지합니다.
  예: 모든 import 문을 파일 상단에 그룹화하고, 알파벳 순으로 정렬합니다.

## 복잡한 조건문 단순화

- 깊은 중첩을 피하고, early return을 활용합니다.
- 복잡한 불리언 표현식을 명명된 함수로 추출합니다.
- 스위치 문 대신 객체 리터럴이나 Map을 사용합니다.
- 다형성을 활용하여 조건부 로직을 대체합니다.
  예: `if (isValidUser && hasPermission && !isLocked)` 대신 `canAccessResource()` 함수 사용

## 적절한 추상화 수준 유지

- 비즈니스 로직과 저수준 구현 세부사항을 분리합니다.
- 인터페이스와 구현을 명확히 구분합니다.
- 과도한 추상화를 피하고, 필요한 만큼만 추상화합니다.
- 동일한 수준의 추상화를 한 곳에서 다룹니다.
- SOLID 원칙을 적용하여 모듈 간 결합도를 낮추고 응집도를 높입니다.
  예: 데이터베이스 쿼리 로직을 Repository 패턴을 사용하여 추상화합니다.

이러한 실천 사항들을 일관되게 적용하면, 코드의 가독성, 유지보수성, 확장성이 크게 향상됩니다. 각 항목은 서로 연관되어 있으며, 종합적으로 적용될 때 가장 효과적인 결과를 얻을 수 있습니다.

# 어떻게 해야 하는가

- 코드 리뷰 실시
- 지속적인 리팩토링 수행
- 단위 테스트 작성
- 정적 코드 분석 도구 사용 (예: ESLint)
- 코드 포맷터 사용 (예: Prettier)
- 디자인 패턴 및 SOLID 원칙 적용
- 페어 프로그래밍 또는 모브 프로그래밍 실천

# 예제 (10가지)

## 의미 있는 변수명 사용:

```jsx
// Bad
const d = new Date();
// Good
const currentDate = new Date();
```

## 함수 추출:

```jsx
// Bad
function calculateTotalPrice(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total * 1.1; // 10% tax
}

// Good
function calculateSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function applyTax(amount, taxRate = 0.1) {
  return amount * (1 + taxRate);
}

function calculateTotalPrice(items) {
  const subtotal = calculateSubtotal(items);
  return applyTax(subtotal);
}
```

## 매직 넘버 제거:

```jsx
// Bad
if (employee.age > 65) {
  // retire
}

// Good
const RETIREMENT_AGE = 65;
if (employee.age > RETIREMENT_AGE) {
  // retire
}
```

## 조건문 단순화:

```jsx
// Bad
if (isActive === true) {
  // do something
}

// Good
if (isActive) {
  // do something
}
```

## 중복 제거:

```jsx
// Bad
function validateName(name) {
  if (name.length < 2) {
    throw new Error("Name is too short");
  }
}

function validateEmail(email) {
  if (email.length < 2) {
    throw new Error("Email is too short");
  }
  // other validations...
}

// Good
function validateMinLength(value, minLength, fieldName) {
  if (value.length < minLength) {
    throw new Error(`${fieldName} is too short`);
  }
}

function validateName(name) {
  validateMinLength(name, 2, "Name");
}

function validateEmail(email) {
  validateMinLength(email, 2, "Email");
  // other validations...
}
```

## 함수 인자 개수 줄이기:

```jsx
// Bad
function createUser(name, age, city, country, email) {
  // create user
}

// Good
function createUser(userInfo) {
  const { name, age, city, country, email } = userInfo;
  // create user
}
```

## 부수 효과 제거:

```jsx
// Bad
let total = 0;
function addToTotal(value) {
  total += value;
}

// Good
function addToTotal(currentTotal, value) {
  return currentTotal + value;
}
```

## 널 객체 패턴 사용:

```jsx
// Bad
function getUser(id) {
  const user = findUser(id);
  if (user == null) {
    return { name: "Guest", permissions: [] };
  }
  return user;
}

// Good
const NULL_USER = { name: "Guest", permissions: [] };
function getUser(id) {
  return findUser(id) || NULL_USER;
}
```

## 조건부 로직을 다형성으로 대체:

```jsx
// Bad
function calculateArea(shape) {
  if (shape.type === "circle") {
    return Math.PI * shape.radius ** 2;
  } else if (shape.type === "rectangle") {
    return shape.width * shape.height;
  }
}

// Good
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  calculateArea() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  calculateArea() {
    return this.width * this.height;
  }
}
```

## 예외 처리:

```jsx
// Bad
function divide(a, b) {
  if (b !== 0) {
    return a / b;
  }
}

// Good
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
```

# ESLint와 Prettier 소개 및 사용 방법

## ESLint

ESLint는 JavaScript 코드의 품질을 향상시키는 강력한 정적 코드 분석 도구입니다. 코드 스타일 문제, 잠재적 버그, 안티 패턴 등을 식별하고 수정할 수 있습니다.

## Prettier

Prettier는 코드 포맷터로, 일관된 코드 스타일을 자동으로 적용합니다. 들여쓰기, 줄 바꿈, 공백 등의 스타일 문제를 자동으로 해결해줍니다.

## 설치 및 초기 설정

```bash
# ESLint와 Prettier 설치
npm install eslint prettier --save-dev

# ESLint 설정 초기화
npx eslint --init

# ESLint와 Prettier 통합을 위한 추가 패키지 설치
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

```

## 사용 방법

ESLint:

```bash
# 특정 파일 린팅
npx eslint yourfile.js

# 프로젝트 전체 npx eslint yourfile.js린팅
npx eslint .

# 자동 수정 가능한 문제 수정
npx eslint . --fix

```

Prettier:

```bash
# 특정 파일 포맷팅
npx prettier --write yourfile.js

# 프로젝트 전체 포맷팅
npx prettier --write .

# 포맷팅이 필요한 파일 확인
npx prettier --check .

```

## 설정 파일

ESLint: `.eslintrc.js` 또는 `.eslintrc.json`

```jsx
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    // 여기에 custom 규칙 추가
  },
};
```

Prettier: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 유용한 ESLint 플러그인

- eslint-plugin-jest: Jest 테스트 관련 린팅 규칙
- eslint-plugin-node: Node.js 관련 린팅 규칙
- eslint-plugin-security: 보안 관련 린팅 규칙
- eslint-plugin-sonarjs: SonarJS에서 제공하는 버그 및 코드 스멜 탐지 규칙
- eslint-plugin-unicorn: 추가적인 코드 품질 향상을 위한 규칙 모음
- eslint-plugin-compat: 브라우저 호환성 체크
- eslint-plugin-prettier: ESLint와 Prettier 통합

## 유용한 Prettier 플러그인

- @prettier/plugin-php: PHP 코드 포맷팅
- prettier-plugin-solidity: Solidity 코드 포맷팅
- prettier-plugin-packagejson: package.json 파일 포맷팅
- prettier-plugin-java: Java 코드 포맷팅

## 유명한 ESLint 규칙 및 설정

- airbnb 스타일 가이드: `eslint-config-airbnb`
- Google 스타일 가이드: `eslint-config-google`
- Standard 스타일 가이드: `eslint-config-standard`

## 주요 ESLint 규칙:

- `no-unused-vars`: 사용되지 않는 변수 검출
- `no-console`: console.log() 사용 제한
- `eqeqeq`: === 및 !== 연산자 사용 강제
- `prefer-const`: 재할당되지 않는 변수에 const 사용 강제
- `no-var`: var 대신 let 또는 const 사용 강제
- `curly`: 모든 제어문에 중괄호 사용 강제
- `max-len`: 최대 줄 길이 제한
- `no-multiple-empty-lines`: 연속된 빈 줄 제한
- `camelcase`: 카멜케이스 네이밍 강제
- `no-shadow`: 변수 섀도잉 방지

## ESLint와 Prettier 통합

`.eslintrc.js`에 다음 설정 추가:

```jsx
{
  "extends": [
    "plugin:prettier/recommended"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}

```

이렇게 설정하면 ESLint가 Prettier 규칙을 적용하고, 스타일 관련 문제를 자동으로 수정할 수 있습니다.

## IDE 통합

대부분의 현대적인 IDE와 텍스트 에디터(VS Code, WebStorm, Sublime Text 등)는 ESLint와 Prettier를 플러그인 형태로 지원합니다. 이를 통해 코드 작성 시 실시간으로 문제를 확인하고 수정할 수 있습니다.

이러한 도구와 설정을 활용하면 코드 품질을 크게 향상시키고, 팀 내에서 일관된 코딩 스타일을 유지할 수 있습니다.
