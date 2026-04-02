import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import App from "./App.jsx";
import MainPage from "./pages/MainPage";
import MainPageJunior from "./pages/MainPageJunior";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import DetailPage from "./pages/DetailPage";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/",              element: <MainPage /> },
      { path: "/junior",        element: <MainPageJunior /> },
      { path: "/search",        element: <SearchPage /> },
      { path: "/mypage",        element: <MyPage /> },
      { path: "/movie/:movieId",element: <DetailPage /> },
      { path: "*",              element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
