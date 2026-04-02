import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Nav } from "../components/common/Nav";
import { Footer } from "../components/common/Footer";
import { AgeButton } from "../components/common/AgeButton";
import { ContentRow } from "../components/common/ContentRow";
import { Card } from "../components/common/Card";
import { CharacterRow } from "../components/common/CharacterRow";
import { CharacterCard } from "../components/common/CharacterCard";
import { AiRoo } from "../components/common/AiRoo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlay,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { fetchTrending, fetchKidsMovies, fetchLatestKidsMovies, getImageUrl } from "../api/tmdb";

const CHARACTERS = [
  { id: 1, name: "뽀로로",   poster_path: "/nJG4ieTjuZZWHBeh4wqsKv5JGJM.jpg" },
  { id: 2, name: "티니핑",   poster_path: "/rY8QGWz7xdsBx6Em1WnpqQZ2oIU.jpg" },
  { id: 3, name: "스폰지밥", poster_path: "/m37FIo3qXvtNWqqqmveWWd1lJlH.jpg" },
  { id: 4, name: "포켓몬",   poster_path: "/vaXQOBNdQVtxUMN96cR4qQRxmoQ.jpg" },
  { id: 5, name: "핑구",     poster_path: "/mc1gBxnqdXCvwQSfNYrBzes5trp.jpg" },
];

export default function MainPage() {
  const [trending, setTrending] = useState([]);
  const [kidsMovies, setKidsMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrending().then(setTrending).catch(console.error);
    fetchKidsMovies().then(setKidsMovies).catch(console.error);
    fetchLatestKidsMovies().then(setLatestMovies).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Nav activeTab="main" />

      {/* Hero Banner - matching frame 223:288 */}
      <section className="w-full max-w-[1280px] px-4 md:px-10 pt-4 md:pt-6 pb-6 md:pb-10">
        <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mx-auto">
          <img
            src={getImageUrl(trending[0]?.backdrop_path, "original")}
            className="absolute inset-0 w-full h-full object-cover"
            alt="슈퍼 히어로 특공대"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-[90%] md:max-w-[672px] flex flex-col gap-2 md:gap-4 text-white">
            <div className="bg-primary-400 w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2">
              <FontAwesomeIcon
                icon={faStar}
                className="text-primary-700 size-3 md:size-5"
              />
              <span className="text-xs md:text-sm font-bold text-primary-700 font-poppins">
                신규
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black md:leading-10 font-poppins">
              슈퍼 히어로 특공대!
            </h1>
            <div className="text-sm md:text-lg font-medium text-white/80 leading-snug md:leading-7">
              <p>슈퍼히어로가 꿈인 승아는 친구들을 모아 특공대를 만든다!</p>
              <p className="hidden md:block">승아와 친구들의 좌충우돌 도전기</p>
            </div>
            <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
              <button className="bg-primary-500 text-gray-700 px-4 py-2 md:px-8 md:py-4 rounded-[48px] flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-primary-400 transition-all font-bold text-sm md:text-2xl">
                <FontAwesomeIcon icon={faPlay} className="size-3 md:size-6" />
                <span>보러가기</span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-gray-50 text-gray-50 px-4 py-2 md:px-8 md:py-4 rounded-[48px] flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-white/30 transition-all font-bold text-sm md:text-2xl">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="size-3 md:size-6"
                />
                <span>더보기</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-[1280px] flex flex-col gap-6 md:gap-10">
        {/* Age Selection */}
        <div className="px-4 md:px-10 flex gap-2 md:gap-3.5 overflow-x-auto scrollbar-hide">
          <AgeButton label="키즈 4~7세" active />
          <AgeButton label="주니어 8~12세" onClick={() => navigate("/junior")} />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8 md:gap-10 pb-20">
          <ContentRow title="이어보기" className="px-4 md:px-10">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {kidsMovies.slice(0, 4).map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col gap-2 md:gap-2.5 min-w-[240px] md:min-w-[320px]"
                >
                  <div className="relative h-[140px] md:h-[180px] rounded-2xl md:rounded-3xl overflow-hidden group">
                    <img
                      src={getImageUrl(movie.backdrop_path || movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
                      <div className="bg-primary-500 h-full w-1/2" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-2xl font-bold text-gray-800">
                      {movie.title}
                    </h4>
                    <p className="text-sm md:text-lg font-medium text-gray-500">
                      10분 남음
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ContentRow>

          {/* 루의 추천 - 주간 트렌딩 */}
          <ContentRow title="루의 추천" className="px-4 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-10">
              {kidsMovies?.slice(0, 5).map((item, i) => (
                <div
                  key={item.id}
                  className={i === 0 ? "col-span-2 lg:row-span-2" : ""}
                >
                  <Card
                    size={i === 0 ? "lg" : "sm"}
                    title={item.title || item.name}
                    image={getImageUrl(item.poster_path)}
                    className={
                      i === 0
                        ? "aspect-[16/9] lg:aspect-auto lg:h-full"
                        : "aspect-square"
                    }
                    onClick={() => navigate(`/movie/${item.id}`)}
                  >
                    <span className="text-xs md:text-sm font-semibold text-yellow-400 mt-0.5 md:mt-1">
                      <FontAwesomeIcon icon={faStar} /> {item.vote_average?.toFixed(1)}
                    </span>
                  </Card>
                </div>
              ))}
            </div>
          </ContentRow>

          {/* 인기 있는 캐릭터! */}
          <CharacterRow>
            {CHARACTERS.map((char) => (
              <CharacterCard
                key={char.id}
                name={char.name}
                image={getImageUrl(char.poster_path)}
              />
            ))}
          </CharacterRow>

          {/* 인기 콘텐츠 - 키즈 영화 */}
          <ContentRow title="인기 콘텐츠" className="px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
              {kidsMovies.slice(0, 4).map((movie) => (
                <div
                  key={movie.id}
                  className="aspect-[3/4] md:h-[360px] rounded-2xl md:rounded-[50px] overflow-hidden relative group cursor-pointer shadow-sm"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-3 md:bottom-6 md:left-6 md:right-4 text-white text-sm md:text-[21px] font-black leading-snug line-clamp-2">
                    {movie.title}
                  </div>
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 text-yellow-400 text-xs md:text-sm font-bold px-2 py-0.5 md:py-1 rounded-full">
                    <FontAwesomeIcon icon={faStar} /> {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </ContentRow>

          {/* 최신 콘텐츠 */}
          <ContentRow title="최신 콘텐츠" className="px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
              {latestMovies.slice(0, 4).map((movie) => (
                <div
                  key={movie.id}
                  className="aspect-[3/4] md:h-[360px] rounded-2xl md:rounded-[50px] overflow-hidden relative group cursor-pointer shadow-sm"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-3 md:bottom-6 md:left-6 md:right-4 text-white text-sm md:text-[21px] font-black leading-snug line-clamp-2">
                    {movie.title}
                  </div>
                </div>
              ))}
            </div>
          </ContentRow>

          {/* 프리미엄 배너 */}
          <div className="mx-4 md:mx-10 min-h-[120px] md:h-[160px] bg-blue-900 rounded-2xl md:rounded-4xl flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:px-8 relative overflow-hidden shadow-lg gap-4">
            <div className="absolute -right-10 -bottom-10 size-32 md:size-48 bg-primary-500/20 blur-[24px] md:blur-[32px] rounded-full" />
            <div className="flex flex-col gap-2 md:gap-5 relative z-10 text-gray-50">
              <h2 className="text-xl md:text-4xl font-black">
                프리미엄으로 구독하세요!
              </h2>
              <p className="text-sm md:text-xl font-normal opacity-90">
                더 많은 혜택이 팡팡! 프리미엄으로 더 많은 프로필을 등록하세요!
              </p>
            </div>
            <button className="bg-primary-500 text-primary-950 px-6 py-2.5 md:px-8 md:py-4 rounded-full md:rounded-[48px] font-black text-sm md:text-2xl shadow-lg relative z-10 hover:bg-primary-400 transition-all shrink-0">
              보러가기
            </button>
          </div>
        </div>
      </main>

      <AiRoo />

      <Footer />
    </div>
  );
}
