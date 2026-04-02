import axios from "axios";

// TMDB API 설정
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "ko-KR",
    region: "KR",
  },
});

export default api;
