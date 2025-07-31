# VSCode 워크스페이스 설정 가이드

## 🚀 자동 설정된 기능들

### ✅ Format on Save
- **JavaScript/TypeScript 파일** 저장 시 **Prettier**로 자동 포맷팅
- **JSON 파일** 저장 시 **Prettier**로 자동 포맷팅
- **ESLint** 자동 수정 (저장 시)

### ✅ 권장 확장 프로그램
프로젝트 열면 자동으로 다음 확장 프로그램 설치를 권장합니다:
- **Prettier** - 코드 포맷터
- **ESLint** - 코드 품질 검사
- **TypeScript** - TypeScript 지원
- **GitLens** - Git 히스토리
- **Tailwind CSS** - CSS 자동완성

### ✅ VSCode 작업 (Tasks)
`Ctrl+Shift+P` → `Tasks: Run Task`에서 선택:

- **🧪 Run Tests (Basic)** - 기본 테스트 실행
- **🔍 ESLint Check** - 코드 품질 검사
- **🔧 ESLint Fix** - 자동 수정 가능한 문제 해결
- **🎨 Format Code** - 전체 코드 포맷팅
- **🔎 Type Check** - TypeScript 타입 검사
- **🚀 Dev Setup (All)** - 모든 검사 실행

## 💡 사용 팁

### Format on Save 활성화 확인
1. `Ctrl+,` (설정 열기)
2. `format on save` 검색
3. ✅ 체크되어 있는지 확인

### ESLint 문제 자동 수정
- **저장 시 자동**: 설정되어 있음
- **수동 실행**: `Ctrl+Shift+P` → `ESLint: Fix all auto-fixable Problems`

### Prettier 설정 확인
- 프로젝트 루트의 `.prettierrc` 파일 사용
- VSCode 기본 포맷터보다 우선 적용

## 🔧 문제 해결

### Format on Save가 작동하지 않는 경우
1. **Prettier 확장 설치 확인**
2. **기본 포맷터 설정 확인**:
   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode"
   ```
3. **Prettier 설정 파일 존재 확인**: `.prettierrc`

### ESLint가 작동하지 않는 경우
1. **ESLint 확장 설치 확인**
2. **프로젝트 루트에서 VSCode 열기**
3. **ESLint 설정 파일 확인**: `eslint.config.js`

## 📝 설정 파일 위치

- **워크스페이스 설정**: `.vscode/settings.json`
- **권장 확장**: `.vscode/extensions.json`
- **작업 정의**: `.vscode/tasks.json`
- **Prettier 설정**: `.prettierrc`
- **ESLint 설정**: `eslint.config.js`
- **TypeScript 설정**: `tsconfig.json` 