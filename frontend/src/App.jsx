import { Outlet } from "react-router";
import { EyeGuardWidget } from "./components/EyeGuardWidget";

/**
 * App — 전역 레이아웃 브릿지
 * 공용 상태, 전역 컨텍스트, 공통 레이아웃을 여기서 제공하고
 * 각 페이지는 <Outlet />으로 렌더링된다.
 */
export default function App() {
  return (
    <div className="relative min-h-screen">
      <Outlet />
      <EyeGuardWidget />
    </div>
  );
}
