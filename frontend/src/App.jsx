import { useLocation, Routes, Route, Outlet } from "react-router";
import { Suspense, lazy } from "react";
import { EyeGuardWidget } from "./components/common/EyeGuardWidget";

const DetailPage = lazy(() => import("./pages/DetailPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const MainPageJunior = lazy(() => import("./pages/MainPageJunior"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const AironPage = lazy(() => import("./pages/AironPage"));

/**
 * App — 전역 레이아웃 및 모달 라우팅 관리
 */
export default function App() {
  const location = useLocation();
  
  // 모달을 띄울 때 배경으로 사용할 위치 (state.background)
  const background = location.state && location.state.background;

  return (
    <div className="relative min-h-screen">
      {/* 1. 배경 레이어: background가 있으면 해당 위치를, 없으면 현재 위치를 렌더링 */}
      <div className={background ? "fixed inset-0 overflow-hidden" : ""}>
        <Routes location={background || location}>
          <Route path="/home"           element={<Suspense><MainPage /></Suspense>} />
          <Route path="/junior"        element={<Suspense><MainPageJunior /></Suspense>} />
          <Route path="/search"        element={<Suspense><SearchPage /></Suspense>} />
          <Route path="/mypage"        element={<Suspense><MyPage /></Suspense>} />
          <Route path="/airon"         element={<Suspense><AironPage /></Suspense>} />
          {/* 직접 접근 시에도 상세페이지가 보여야 함 */}
          {!background && (
            <Route path="/movie/:movieId" element={<Suspense><DetailPage /></Suspense>} />
          )}
        </Routes>
      </div>

      {/* 2. 모달 레이어: background가 있을 때만 상세페이지를 위에 띄움 */}
      {background && (
        <Routes>
          <Route 
            path="/movie/:movieId" 
            element={
              <Suspense>
                <DetailPage isModal={true} />
              </Suspense>
            } 
          />
        </Routes>
      )}

      <EyeGuardWidget />
    </div>
  );
}


