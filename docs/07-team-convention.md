# 팀 컨벤션 및 심화과제 진행 가이드

## 1. tsconfig (TypeScript 설정)

- [타입스크립트 tsconfig 한국어 페이지](https://www.typescriptlang.org/ko/tsconfig/)
- 주요 옵션:
  - `target`: ES6
  - `lib`: ["es6", "dom", "dom.iterable", "scripthost"]
  - `jsx`: react-jsx
  - `module`: es2015
  - `moduleResolution`: bundler
  - `baseUrl`, `paths` (예: @components/_ → src/components/_)
  - `outDir`: ./build
  - `esModuleInterop`, `allowJs`, `checkJs`, `noEmit`, `strict` 등
- paths alias 관련:
  - 패키지 설치: `pnpm add -D tsconfig-paths tsc-alias`
  - ts-node 설정: `"ts-node": { "require": ["tsconfig-paths/register"] }`
  - 빌드 명령: `tsc && tsc-alias`
  - package.json 예시:
    ```json
    "scripts": {
      "build": "tsc --project tsconfig.json && npx tsc-alias -p tsconfig.json"
    }
    ```

## 2. Generic 코드 컨벤션

- `var` 사용 금지, let/const만 사용
- 문자열 내 변수: 템플릿 리터럴(``)
- 객체/배열: 리터럴 및 spread 문법 권장, 가능한 경우 속성의 단축 구문을 사용한다.
- 배열 복사: spread 사용
- 비교 연산: `===`, `!==`만 사용
- boolean 조건문: 비교 구문 생략
- 구조분해할당, 주석, 고차함수, if/함수 축약, arrow function, export 방식 등은 예시 참고

## 3. 네이밍 규칙

- 상수: 대문자+snake_case (예: DISCOUNT_RATE)
- 변수/함수: camelCase
- 컴포넌트: PascalCase
- 복수형: ~List
- boolean: is-/has- 접두사
- 축약어 금지, 명확한 argument 네이밍
- 이벤트 핸들러: handle+이벤트명

## 4. 폴더/파일명

- 폴더명: 케밥케이스 권장
- 파일명: 컨벤션에 맞게

## 5. package.json 예시

- dev/build/lint/pretty/test 등 스크립트
- React, TypeScript, ESLint, Prettier, Vitest 등 의존성

## 6. TypeScript 마이그레이션 전략

1. 패키지 설치: `pnpm add -D @types/react @types/react-dom typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin`
2. tsconfig.json 생성 및 설정
3. vite.config.ts 확장자 지원
4. ESLint 설정: @typescript-eslint, react, prettier 등
5. 점진적 파일 마이그레이션: js/jsx → ts/tsx, 타입 지정, 공통 타입 src/types에 정의
6. allowJs: true로 JS/TS 공존, strict 점진적 적용, any 임시 허용 후 리팩토링

---

이 문서는 팀의 심화과제 진행 및 코드 컨벤션 준수를 위한 가이드입니다. 변경/추가 사항은 자유롭게 논의 후 반영하세요.
