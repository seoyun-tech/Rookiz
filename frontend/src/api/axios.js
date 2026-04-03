import axios from "axios";

// 1. 기존 TMDB API 설정 (영화 데이터용)
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "ko-KR",
    region: "KR",
  },
});

// 2. 우리 팀 백엔드 API 설정 (AI 챗봇용) - 추가된 부분
// .env에 저장한 VITE_API_URL(https://my-chatbot-xxxx.onrender.com)을 불러옵니다.
export const chatApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;