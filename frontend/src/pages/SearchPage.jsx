import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { searchMovies, getImageUrl } from '../api/api';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Searchbar } from '../components/Searchbar';
import { ContentRow } from '../components/ContentRow';
import { Card } from '../components/Card';
import { useMovieModal } from '../context/MovieModalContext';

const GENRE_DRAMA = 18;
const GENRE_ROMANCE = 10749;
const GENRE_HORROR = 27;
const GENRE_CRIME = 80;
const GENRE_THRILLER = 53;
const GENRE_MYSTERY = 9648;
const FORBIDDEN_GENRES = [GENRE_DRAMA, GENRE_ROMANCE, GENRE_HORROR, GENRE_CRIME, GENRE_THRILLER, GENRE_MYSTERY];

function filterByAge(movies, mode) {
  return movies.filter((movie) => {
    const hasForbidden = movie.genre_ids.some((id) => FORBIDDEN_GENRES.includes(id));
    if (hasForbidden) return false;
    if (mode === "kids") {
      return movie.genre_ids.includes(16) && movie.genre_ids.includes(10751);
    }
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