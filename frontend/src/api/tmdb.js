import axios from "axios";

// 환경 변수 읽기 (VITE_ 가 반드시 붙어있어야 함)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 1. 키가 제대로 읽히는지 콘솔에 찍어보세요 (확인 후 삭제)
console.log("API KEY 확인:", API_KEY ? "읽기 성공" : "읽기 실패(빈값)");

export const getImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

// 키즈 콘텐츠 가져오기 (백엔드 절대 안 거침)
export const fetchKidsMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        with_genres: "16,10751",
        certification_country: "US",
        "certification.lte": "G",
        sort_by: "popularity.desc",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("키즈 로드 실패:", error);
    return [];
  }
};

// 주니어 콘텐츠 (8-12세, 어드벤처+애니+가족)
export const fetchJuniorMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        with_genres: "12,16,10751",
        certification_country: "US",
        "certification.lte": "PG",
        sort_by: "popularity.desc",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("주니어 로드 실패:", error);
    return [];
  }
};

// 주니어 드라마 (드라마+가족)
export const fetchJuniorDrama = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        with_genres: "18,10751",
        certification_country: "US",
        "certification.lte": "PG",
        sort_by: "vote_average.desc",
        "vote_count.gte": 100,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("주니어 드라마 로드 실패:", error);
    return [];
  }
};

// 최신 키즈 콘텐츠 (개봉일 최신순)
export const fetchLatestKidsMovies = async () => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        with_genres: "16,10751",
        certification_country: "US",
        "certification.lte": "G",
        sort_by: "release_date.desc",
        "primary_release_date.lte": today,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("최신 키즈 로드 실패:", error);
    return [];
  }
};

// 최신 주니어 콘텐츠 (개봉일 최신순)
export const fetchLatestJuniorMovies = async () => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        with_genres: "12,16,10751",
        certification_country: "US",
        "certification.lte": "PG",
        sort_by: "release_date.desc",
        "primary_release_date.lte": today,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("최신 주니어 로드 실패:", error);
    return [];
  }
};

// 트렌딩 가져오기
export const fetchTrending = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("트렌딩 로드 실패:", error);
    return [];
  }
};

// 영어 글로벌 키즈 콘텐츠
export async function fetchEnglishKidsContent() {
  const res = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      with_genres: "16,10762",
      original_language: "en",
      sort_by: "popularity.desc",
      language: "ko-KR",
    },
  });
  return res.data.results.filter((item) => item.original_language === "en");
}