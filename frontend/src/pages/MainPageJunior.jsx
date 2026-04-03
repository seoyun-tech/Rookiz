import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { AgeTabGroup } from "../components/AgeTabGroup";
import { ContentRow } from "../components/ContentRow";
import { Card } from "../components/Card";
import { AiRooSticky } from "../components/AiRooSticky";
import { PremiumBanner } from "../components/PremiumBanner";
import { HeroBanner } from "../components/HeroBanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  fetchTrending,
  fetchJuniorMovies,
  fetchJuniorDrama,
  fetchLatestJuniorMovies,
  fetchEnglishKidsContent,
  getImageUrl,
} from "../api/api";

export default function MainPageJunior() {
  const [trending, setTrending] = useState([]);
  const [juniorMovies, setJuniorMovies] = useState([]);
  const [juniorDrama, setJuniorDrama] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [englishContent, setEnglishContent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrending().then(setTrending).catch(console.error);
    fetchJuniorMovies().then(setJuniorMovies).catch(console.error);
    fetchJuniorDrama().then(setJuniorDrama).catch(console.error);
    fetchLatestJuniorMovies().then(setLatestMovies).catch(console.error);
    fetchEnglishKidsContent().then(setEnglishContent).catch(console.error);
  }, []);

  const openDetailById = (id) => navigate(`/movie/${id}`);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Nav activeTab="main" />

      <HeroBanner
        image={getImageUrl(trending[0]?.backdrop_path || trending[0]?.poster_path, "original")}
        title="슈퍼 히어로 특공대!"
        desc="슈퍼히어로가 꿈인 승아는 친구들을 모아 특공대를 만든다!"
        subDesc="승아와 친구들의 좌충우돌 도전기"
        onPlay={() => trending[0] && openDetailById(trending[0].id)}
        onDetail={() => trending[0] && openDetailById(trending[0].id)}
      />

      <main className="w-full max-w-[1280px] flex flex-col gap-6 md:gap-10">
        <AgeTabGroup activeMode="junior" />

        <div className="flex flex-col gap-8 md:gap-10 pb-20">
          <ContentRow
            title="글로벌 루키즈! 영어로 배워요"
            items={englishContent}
            layout="grid"
            badge="eng"
            filter={(item) => item.original_language === "en"}
            onItemClick={(item) => navigate(`/movie/${item.id}?type=tv`)}
            className="px-4 md:px-10"
          />

          <ContentRow title="루의 추천" className="px-4 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-10">
              {juniorMovies.slice(0, 5).map((item, i) => (
                <div key={item.id} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
                  <Card
                    size={i === 0 ? "lg" : "sm"}
                    title={item.title || item.name}
                    image={getImageUrl(item.poster_path)}
                    className={i === 0 ? "aspect-[16/9] lg:aspect-auto lg:h-full" : "aspect-square"}
                    onClick={() => openDetailById(item.id)}
                  >
                    <span className="text-xs md:text-sm font-semibold text-primary-500 mt-0.5 md:mt-1">
                      <FontAwesomeIcon icon={faStar} /> {item.vote_average?.toFixed(1)}
                    </span>
                  </Card>
                </div>
              ))}
            </div>
          </ContentRow>

          <ContentRow
            title="인기 콘텐츠"
            items={juniorMovies}
            layout="grid"
            badge="rating"
            onItemClick={(item) => openDetailById(item.id)}
            className="px-4 md:px-10"
          />

          <ContentRow
            title="주니어 드라마"
            items={juniorDrama}
            layout="grid"
            badge="rating"
            onItemClick={(item) => openDetailById(item.id)}
            className="px-4 md:px-10"
          />

          <ContentRow
            title="최신 콘텐츠"
            items={latestMovies}
            layout="grid"
            onItemClick={(item) => openDetailById(item.id)}
            className="px-4 md:px-10"
          />

          <PremiumBanner />
        </div>
      </main>

      <AiRooSticky />
      <Footer />
    </div>
  );
}
