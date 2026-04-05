import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { searchMovies, getImageUrl } from '../api/api';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Searchbar } from '../components/Searchbar';
import { ContentRow } from '../components/ContentRow';
import { Card } from '../components/Card';
import { useMovieModal } from '../context/MovieModalContext';

// 성인/청소년 대상 장르 — 키즈·주니어 모두 제외
const FORBIDDEN_GENRES = [
  18,    // 드라마
  10749, // 로맨스
  27,    // 공포
  80,    // 범죄
  53,    // 스릴러
  9648,  // 미스터리
  10752, // 전쟁
  36,    // 역사
];

// 키즈 전용 장르 — 애니메이션 / 가족 / 키즈(TV)
const KIDS_GENRES = [16, 10751, 10762];

function filterByAge(movies, mode) {
  return movies.filter((movie) => {
    const genres = movie.genre_ids ?? [];

    // 금지 장르 포함 시 전 연령 제외
    if (genres.some((id) => FORBIDDEN_GENRES.includes(id))) return false;

    if (mode === "kids") {
      // 키즈: 애니메이션·가족·키즈 장르 중 하나 이상 포함
      return genres.some((id) => KIDS_GENRES.includes(id));
    }

    // 주니어: 금지 장르 없으면 키즈 콘텐츠 포함 전부 허용
    return true;
  });
}

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { openMovie } = useMovieModal();

  const isJuniorPath = location.pathname.includes('junior');
  const currentMode = isJuniorPath ? 'junior' : 'kids';

  useEffect(() => {
    setResults([]);
    setQuery('');
  }, [location.pathname]);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm?.trim()) return;
    setIsLoading(true);
    setQuery(searchTerm);

    try {
      const movies = await searchMovies(searchTerm);
      setResults(filterByAge(movies, currentMode));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCardClick = (movie) => {
    const mediaType = movie.first_air_date ? "tv" : "movie";
    openMovie(movie.id, mediaType, currentMode);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Nav activeTab="main" />

      <main className="flex-1 w-full max-w-container mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-20 flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col gap-4 md:gap-6 items-center text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-800">
            무엇을 찾고 있나요?
          </h1>
          <Searchbar className="w-full max-w-searchbar" onSearch={handleSearch} />
        </div>

        <ContentRow title={query ? `'${query}' 검색 결과` : "인기 영상"}>
          {isLoading ? (
            <div className="w-full py-20 text-center font-bold text-gray-400 text-2xl">검색 중...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
              {results.length > 0 ? (
                results.map(movie => (
                  <Card
                    key={movie.id}
                    title={movie.title || movie.name}
                    image={getImageUrl(movie.poster_path)}
                    onClick={() => handleCardClick(movie)}
                    className="cursor-pointer aspect-[3/4] rounded-4xl"
                  />
                ))
              ) : (
                query && <div className="col-span-full py-20 text-center text-gray-400 font-bold text-2xl">
                  연령대에 맞는 관련 영상이 없습니다
                </div>
              )}
            </div>
          )}
        </ContentRow>
      </main>

      <Footer />
    </div>
  );
}