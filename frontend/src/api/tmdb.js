import axios from 'axios';

// 환경 변수 읽기 (VITE_ 가 반드시 붙어있어야 함)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 1. 키가 제대로 읽히는지 콘솔에 찍어보세요 (확인 후 삭제)
console.log("API KEY 확인:", API_KEY ? "읽기 성공" : "읽기 실패(빈값)");

export const getImageUrl = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

// 키즈 콘텐츠 가져오기 (백엔드 절대 안 거침)
export const fetchKidsMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'ko-KR',
        with_genres: '16,10751',
        certification_country: 'US',
        'certification.lte': 'G',
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("키즈 로드 실패:", error);
    return [];
  }
};

// 트렌딩 가져오기
export const fetchTrending = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY,
        language: 'ko-KR'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("트렌딩 로드 실패:", error);
    return [];
  }
};