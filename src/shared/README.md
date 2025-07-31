# Shared 폴더

이 폴더는 Basic과 Advanced 앱에서 공통으로 사용되는 로직을 포함합니다.

## 구조

```
shared/
├── constants/     # 상수 데이터 (상품 정보, 비즈니스 규칙 등)
├── utils/         # 유틸리티 함수들
└── types/         # TypeScript 타입 정의
```

## 사용법

### Basic 앱에서 사용

```javascript
import { PRODUCT_DATA } from '../shared/constants/product-data.js';
import { calculateDiscount } from '../shared/utils/cart-helpers.js';
```

### Advanced 앱에서 사용

```typescript
import { PRODUCT_DATA } from '../../shared/constants/product-data.js';
import { calculateDiscount } from '../../shared/utils/cart-helpers.js';
```

## 주의사항

- 모든 공통 로직은 이 폴더에서 관리됩니다.
- Basic과 Advanced 앱 간의 데이터 일관성을 보장합니다.
- 변경 시 두 앱 모두에 영향을 주므로 신중하게 수정해야 합니다.
