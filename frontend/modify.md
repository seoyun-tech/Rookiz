# 온보딩 변경 내역 정리

---
@onboard.md 실행
## 1. `src/main.jsx` (라우터 변경)

| 라인 | 내용 |
|------|------|
| **10** | `OnboardingPage` import 추가 |
| **17** | `path: "/"` → `<OnboardingPage />` (기존 메인 대신 온보딩이 루트) |

---

## 2. `src/pages/OnboardingPage.jsx` (신규 - 메인 페이지)

| 라인 | 내용 |
|------|------|
| **1-9** | import: `useState`, `useNavigate`, `twMerge`, FontAwesome 아이콘, 공통 컴포넌트 4종 |
| **12-50** | **StepIntro** — Step 1 계정 생성 (이름/이메일/비밀번호 입력 + "시작하기" 버튼) |
| **53-68** | **AGE_CARDS** 데이터 — 키즈(4~7세) / 주니어(8~12세) 카드 정보 |
| **70-119** | **AgeCard** — 연령 선택 카드 UI (선택 상태 border·체크 색상 변경) |
| **121-131** | **BackBtn** — 이전 버튼 (Step 2부터 표시) |
| **133-164** | **StepAgeSelect** — Step 2 연령 선택 (카드 2장 + "다음" 버튼) |
| **167-190** | **StepGreeting** — Step 3 AI 인사 (키즈→"아기 루", 주니어→"꼬마 루" + 페이지네이션 도트) |
| **193-246** | **OnboardingPage** — 3단계 스텝 관리, 배경 그라디언트 조건 분기 (Step3: 키즈=green-100, 주니어=blue-100, 기본=primary-100), 완료 시 `/home` 또는 `/junior`로 네비게이트 |

---

## 3. `src/components/common/LoginBtn.jsx` (신규)

| 라인 | 내용 |
|------|------|
| **5-22** | `LoginBtn` — `active` 상태에 따른 활성/비활성 스타일, `showArrow` 옵션으로 화살표 아이콘 표시 |

---

## 4. `src/components/common/LoginCharacter.jsx` (신규)

| 라인 | 내용 |
|------|------|
| **6-10** | props: `title` (기본값: "Rookiz에 오신 걸 환영해요!"), `subtitle` (기본값: "계정을 만들고...") |
| **12-30** | 루 캐릭터 이미지(`/roo-character.png`) + 반투명 카드(backdrop-blur) 위에 제목/부제목 표시 |

---

## 5. `src/components/common/LoginInput.jsx` (신규)

| 라인 | 내용 |
|------|------|
| **4-18** | `LoginInput` — label + input 조합, `focus:border-primary-500` 포커스 스타일, `Typography`의 `Label` 사용 |

---

## 6. `src/components/common/StepIndicator.jsx` (신규)

| 라인 | 내용 |
|------|------|
| **5** | 3단계 정의: `["계정 생성", "연령 선택", "AI 인사"]` |
| **7-57** | 현재 스텝 하이라이트(primary-500 + shadow), 완료 스텝 체크 아이콘, 미완료 스텝 회색 처리, 스텝 간 연결선 |

---

## 7. `public/roo-character.png` (신규 에셋)

루 캐릭터 이미지 파일 추가

---

## 플로우 요약

```
/ (루트) → OnboardingPage
  Step 1: 계정 생성 (이름·이메일·비밀번호)
  Step 2: 연령 선택 (키즈 / 주니어 카드)
  Step 3: AI 인사 (선택에 따른 배경색·멘트 분기)
  완료 → 키즈: /home | 주니어: /junior
```
