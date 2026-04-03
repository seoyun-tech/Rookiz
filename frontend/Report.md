# 중복 UI 요소 분석 리포트

## 1. 구조 변경 결과

`src/components/common/` 하위 19개 파일을 `src/components/`로 이동하고, 관련 import 경로를 전부 수정 완료.

```
변경 전: src/components/common/Nav.jsx
변경 후: src/components/Nav.jsx
```

영향 파일: `App.jsx`, `CategoryPage.jsx`, `OnboardingPage.jsx`, `DetailPage.jsx`, `MyPage.jsx`, `MainPageJunior.jsx`, `MainPage.jsx`, `SearchPage.jsx`

---

## 2. Pages 중복 UI 요소

### 2-1. Hero Banner (MainPage ↔ MainPageJunior — 거의 동일)

두 페이지에서 동일한 마크업 구조 반복.

| 요소 | MainPage | MainPageJunior |
|------|----------|----------------|
| 배경 이미지 + 그라디언트 오버레이 | ✓ | ✓ |
| 신규 배지 (faStar + bg-primary-400) | ✓ | ✓ |
| 제목/설명 텍스트 영역 | ✓ | ✓ |
| "보러가기" 버튼 (bg-primary-500) | ✓ | ✓ |
| "더보기" 버튼 (bg-white/20) | ✓ | ✓ |

**제안**: `HeroBanner` 컴포넌트로 분리 (`title`, `desc`, `onPlay`, `onDetail` props)

---

### 2-2. 프리미엄 배너 (MainPage ↔ MainPageJunior — 완전 동일)

두 파일에서 마크업이 픽셀 단위로 동일함.

```jsx
// 두 파일 동일
<div className="mx-4 md:mx-10 min-h-[120px] md:h-[160px] bg-blue-900 rounded-2xl md:rounded-4xl ...">
  프리미엄으로 구독하세요!
</div>
```

**제안**: `PremiumBanner` 컴포넌트로 분리

---

### 2-3. 포스터 인라인 카드 (MainPage, MainPageJunior — 반복)

아래 패턴이 두 페이지의 여러 ContentRow 안에서 반복됨 (총 5회 이상):

```jsx
<div className="aspect-[3/4] md:h-[360px] rounded-2xl md:rounded-[50px] overflow-hidden relative group cursor-pointer shadow-sm"
  onClick={...}>
  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 ..." />
  <div className="absolute bottom-4 left-4 ... text-white font-black line-clamp-2">{title}</div>
  {/* 배지 */}
</div>
```

등장 위치:
- MainPage: 인기 콘텐츠, 최신 콘텐츠, 글로벌 루키즈
- MainPageJunior: 인기 콘텐츠, 주니어 드라마, 최신 콘텐츠, 글로벌 루키즈

**제안**: `PosterCard` 컴포넌트로 분리 (`image`, `title`, `badge`, `onClick` props), 기존 `Card` 컴포넌트와 역할 구분 필요

---

### 2-4. 평점 배지 (MainPage ↔ MainPageJunior — 동일)

```jsx
// 두 파일 동일
<div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 text-yellow-400 text-xs md:text-sm font-bold px-2 py-0.5 md:py-1 rounded-full">
  <FontAwesomeIcon icon={faStar} /> {movie.vote_average?.toFixed(1)}
</div>
```

**제안**: `RatingBadge` 컴포넌트 또는 `PosterCard` 내부 prop으로 통합

---

### 2-5. AgeButton 탭 영역 (MainPage ↔ MainPageJunior — 대칭 구조)

두 페이지에서 동일한 두 개의 AgeButton을 active만 바꿔 사용:

```jsx
// MainPage
<AgeButton label="키즈 4~7세" active />
<AgeButton label="주니어 8~12세" onClick={() => navigate("/junior")} />

// MainPageJunior
<AgeButton label="키즈 4~7세" onClick={() => navigate("/home")} />
<AgeButton label="주니어 8~12세" active variant="junior" />
```

**제안**: `AgeTabGroup` 컴포넌트로 분리 (`activeMode` prop으로 active 제어)

---

### 2-6. 로딩 화면 (DetailPage — 인라인)

DetailPage에 로딩 UI가 인라인으로 구현되어 있음. 다른 페이지에서도 로딩 패턴이 필요할 수 있음.

```jsx
<div className="bg-white flex flex-col items-center justify-center gap-6 min-h-screen">
  <div className="size-48 bg-primary-300 rounded-full ... animate-bounce">
    <img src="/Airoo-circle.png" ... />
  </div>
  <p className="text-3xl font-black text-primary-600 animate-pulse">로딩중...</p>
</div>
```

**제안**: `LoadingScreen` 컴포넌트로 분리

---

## 3. Components 중복 UI 요소

### 3-1. EyeGuard ↔ EyeGuardWidget — 로직 완전 중복

두 파일이 MediaPipe 얼굴 감지 로직을 독립적으로 구현:

| 중복 항목 | EyeGuard.jsx | EyeGuardWidget.jsx |
|-----------|-------------|-------------------|
| `WARN_RATIO = 0.38` | ✓ | ✓ |
| `CAUTION_RATIO = 0.28` | ✓ | ✓ |
| `FPS = 8` | ✓ | ✓ |
| `judge()` 함수 | ✓ | ✓ |
| `start()` / `stop()` / `detect()` 패턴 | ✓ | ✓ |
| MediaPipe 모델 URL | ✓ | ✓ |

`EyeGuard`는 전체 페이지 레이아웃, `EyeGuardWidget`은 드래그 가능 오버레이 위젯. 현재 앱에서는 `EyeGuardWidget`만 사용됨 (`App.jsx`).

**제안**: 감지 로직을 `useEyeGuard` 커스텀 훅으로 추출, 두 컴포넌트가 공유

---

### 3-2. ContentRow ↔ CharacterRow — 섹션 구조 유사

두 컴포넌트 모두 `Header` + 스크롤 영역의 패턴:

```jsx
// ContentRow
<div className="w-full flex flex-col gap-7 className">
  <Header title={title} ... />
  <div>{children}</div>
</div>

// CharacterRow
<div className="w-full flex flex-col gap-7 px-4 md:px-10">
  <Header title="인기 있는 캐릭터" />
  <div className="flex gap-4 md:gap-10 overflow-x-auto pb-4 scrollbar-hide">
    {children}
  </div>
</div>
```

**제안**: `CharacterRow`를 `ContentRow`로 통합하거나, `ContentRow`에 `scrollable` prop 추가

---

### 3-3. Chatbot.jsx — 미사용 컴포넌트

`Chatbot.jsx`가 존재하지만 어떤 페이지에서도 import되지 않음. 챗봇 기능은 `AiRooSticky.jsx`에 통합되어 있음.

**제안**: `Chatbot.jsx` 제거 검토

---

### 3-4. Typography.jsx — 미사용 컴포넌트

`Typography.jsx`가 존재하지만 어떤 페이지에서도 import되지 않음.

**제안**: 사용 여부 확인 후 제거 또는 적용 검토

---

## 4. 요약

| 우선순위 | 항목 | 유형 | 제안 |
|---------|------|------|------|
| 높음 | 프리미엄 배너 | pages 완전 중복 | `PremiumBanner` 컴포넌트 분리 |
| 높음 | EyeGuard 감지 로직 | components 완전 중복 | `useEyeGuard` 훅 추출 |
| 높음 | Chatbot.jsx | 미사용 파일 | 제거 검토 |
| 높음 | Typography.jsx | 미사용 파일 | 제거 검토 |
| 중간 | 포스터 인라인 카드 | pages 반복 패턴 | `PosterCard` 컴포넌트 분리 |
| 중간 | Hero Banner | pages 구조 중복 | `HeroBanner` 컴포넌트 분리 |
| 중간 | AgeButton 탭 그룹 | pages 대칭 중복 | `AgeTabGroup` 컴포넌트 분리 |
| 낮음 | CharacterRow | components 유사 구조 | `ContentRow`와 통합 검토 |
| 낮음 | 로딩 화면 | pages 인라인 | `LoadingScreen` 컴포넌트 분리 |
