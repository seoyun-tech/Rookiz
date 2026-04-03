import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import { Nav } from '../components/common/Nav';
import { Footer } from '../components/common/Footer';
import { Searchbar } from '../components/common/Searchbar';
import { ContentRow } from '../components/common/ContentRow';
import { Card } from '../components/common/Card';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const location = useLocation();
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const isJuniorPath = window.location.pathname.includes('junior');
  const currentMode = isJuniorPath ? 'junior' : 'kids';

  useEffect(() => {
    setResults([]);
    setQuery('');
    setSelectedMovie(null);
  }, [location.pathname]);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm?.trim()) return;
    setIsLoading(true);
    setQuery(searchTerm);
    setSelectedMovie(null);

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: { 
          api_key: API_KEY, 
          query: searchTerm, 
          language: 'ko-KR', 
          include_adult: false,
          region: 'KR'
        }
      });

      const forbiddenGenres = [18, 10749, 27, 80, 53, 9648];
      
      const filtered = response.data.results.filter(movie => {
        const hasForbidden = movie.genre_ids.some(id => forbiddenGenres.includes(id));
        const isAnimation = movie.genre_ids.includes(16);
        const isFamily = movie.genre_ids.includes(10751);

        if (currentMode === 'kids') {
          return !hasForbidden && isAnimation && isFamily;
        } else {
          return !hasForbidden;
        }
      });

      setResults(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (movie) => {
    setSelectedMovie(movie);
    setIsLoading(true);
    
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar`, {
        params: { api_key: API_KEY, language: 'ko-KR' }
      });

      const forbiddenGenres = [18, 10749, 27, 80, 53, 9648];
      const filteredRelated = response.data.results.filter(m => {
        const hasForbidden = m.genre_ids.some(id => forbiddenGenres.includes(id));
        const isAnimation = m.genre_ids.includes(16);
        const isFamily = m.genre_ids.includes(10751);

        if (currentMode === 'kids') {
          return !hasForbidden && isAnimation && isFamily;
        } else {
          return !hasForbidden;
        }
      });

      setResults(filteredRelated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Nav activeTab="main" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-10 md:py-20 flex flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-3xl md:text-5xl font-black text-gray-800">
            {currentMode === 'junior' ? '무엇을 찾고 있나요?' : '무엇을 찾고 있나요?'}
          </h1>
          <Searchbar className="w-full max-w-[1000px]" onSearch={handleSearch} />
        </div>

        {selectedMovie && (
          <div className="bg-gray-50 rounded-[48px] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-gray-100">
            <img 
              src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/500'} 
              className="w-48 md:w-64 rounded-[32px] shadow-xl"
              alt={selectedMovie.title}
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className={`px-4 py-1 rounded-full font-bold text-sm border ${
                  currentMode === 'junior' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-primary-50 border-primary-200 text-primary-600'
                }`}>
                  {currentMode === 'junior' ? '🎒 주니어 8~12세 안심 시청' : '🐥 키즈 4~7세 안심 시청'}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black">{selectedMovie.title}</h2>
              <p className="text-gray-600 text-lg leading-6 md:leading-8 max-w-2xl">
                {selectedMovie.overview || "상세 정보가 준비되지 않았습니다."}
              </p>
              
              <button 
                onClick={() => { setSelectedMovie(null); handleSearch(query); }} 
                className="w-fit px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-500 hover:text-primary-600 cursor-pointer shadow-sm"
              >
                검색 결과로 돌아가기 ✕
              </button>
            </div>
          </div>
        )}

        <ContentRow title={selectedMovie ? "추천 연관 영상" : (query ? `'${query}' 검색 결과` : "인기 영상")}>
          {isLoading ? (
            <div className="w-full py-20 text-center font-bold text-gray-400 text-2xl">검색 중...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {results.length > 0 ? (
                results.map(movie => (
                  <Card 
                    key={movie.id}
                    title={movie.title}
                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500'}
                    onClick={() => handleCardClick(movie)}
                    className="cursor-pointer aspect-[3/4] rounded-[48px]"
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