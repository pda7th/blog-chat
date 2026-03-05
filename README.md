# blog-chat

pda7th 미니 프로젝트 blog-chat

## 🤝 Convention

### 🏷️ Naming Convention

- **Directories & Assets**
  - `kebab-case` (e.g., `user-profile/`, `main-logo.png`)
- **Components**
  - `PascalCase` (e.g., `UserProfile.tsx`)
- **Functions / Variables**
  - `camelCase` (e.g., `getUserData`)
- **Classes**
  - `PascalCase`
- **Constants**
  - `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

### 🌿 Branch Naming Convention

- **Format**
  - `type/issue-number-description`
  - e.g., `chore/9-git-convention`
- **Main Branches**
  - `main`: 프로덕션 배포 브랜치
  - `develop`: 개발 통합 브랜치
- **Supporting Branches**
  - `feature/`: 신규 기능 개발
  - `fix/`: 버그 수정
  - `hotfix/`: 긴급 운영 버그 수정
  - `refactor/`: 코드 리팩토링 (기능 변화 없음)
  - `chore/`: 빌드 설정, 패키지 설치, 단순 가독성 수정 등
  - `docs/`: README 등 문서 수정 및 추가
  - `test/`: 테스트 코드 작성 및 수정
  - `design/`: UI/UX 디자인 요소 수정 (CSS, Asset 등)

### ✉️ Commit Convention

| Tag          | Description                                  |
| :----------- | :------------------------------------------- |
| **feat**     | 새로운 기능 추가                             |
| **fix**      | 버그 수정                                    |
| **hotfix**   | 급박한 운영/QA 버그 수정                     |
| **build**    | 빌드 시스템, 패키지 매니저 설정 변경         |
| **chore**    | 설정 변경, 단순 수정 (로직 영향 없음)        |
| **style**    | 코드 포맷팅, 세미콜론 누락 등 (UI 수정 아님) |
| **docs**     | 문서 수정 (README, 주석 등)                  |
| **test**     | 테스트 코드 추가 및 수정                     |
| **refactor** | 기능 변화 없는 코드 구조 개선                |

### 💻 Coding Convention

- **Intent**: 코드를 작성한 의도와 목적을 명확하게 드러냅니다.
- **Variables**: 축약어를 사용하지 않습니다.
- **Methods**: `camelCase`를 사용하며, 동사나 전치사로 시작합니다. (e.g., `fetchUserInfo()`)
- **Database Columns**: `snake_case`를 사용합니다. (e.g., `member_id`)
- **End Points**: RESTful API 규칙을 준수합니다.
  - 명사 사용, 복수형 권장 (e.g., `GET /users/1`)
  - 소문자 및 하이픈(`-`) 사용

### 🔄 Branch Flow

본 프로젝트는 **GitHub Flow**를 기반으로 하되, 안정적인 배포 관리를 위해 **`develop`** 브랜치를 운영합니다.

- **초기 개발 단계**: `develop` 브랜치를 중심으로 작업을 진행합니다.
  - 모든 기능 개발과 리팩토링은 `feature/` 또는 `refactor/` 브랜치에서 진행 후 `develop`으로 **PR**(Pull Request)을 보냅니다.
- **배포 단계 (Production)**: 제품화 시점에 `main` 브랜치를 활성화합니다.
  - `develop`에서 검증이 완료된 코드를 `main`에 병합(Merge)하여 배포합니다.
  - 배포 시점의 `main` 브랜치에는 **Tag**(e.g., `v1.0.0`)를 생성하여 관리합니다.
- **긴급 수정 (Hotfix)**: 배포된 버전에서 발생한 심각한 문제는 `hotfix/` 브랜치를 생성하여 처리 후 `main`과 `develop` 모두에 반영합니다.
