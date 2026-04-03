import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import App from "./App.jsx";
import "./styles/index.css";

const MainPage = lazy(() => import("./pages/MainPage"));
const MainPageJunior = lazy(() => import("./pages/MainPageJunior"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/",              element: <Suspense><MainPage /></Suspense> },
      { path: "/junior",        element: <Suspense><MainPageJunior /></Suspense> },
      { path: "/search",        element: <Suspense><SearchPage /></Suspense> },
      { path: "/mypage",        element: <Suspense><MyPage /></Suspense> },
      { path: "/movie/:movieId",element: <Suspense><DetailPage /></Suspense> },
      { path: "*",              element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
