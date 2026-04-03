import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faShareNodes, 
  faDownload, 
  faStar, 
  faLeaf,
  faChevronRight,
  faPlay,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";
import { Nav } from "../components/common/Nav";
import { Footer } from "../components/common/Footer";
import { Card } from "../components/common/Card";
import { VideoPlayer } from "../components/common/VideoPlayer";

const AI_ROO = "https://www.figma.com/api/mcp/asset/72ba9870-e738-4c0f-9884-a7b11cfa61cc";

// ── 서브 컴포넌트 ──────────────────────────────────────────────

function Chip({ variant, label }) {
  const styles = {
    kids: "bg-green-200 text-green-600",
    new: "bg-primary-400 text-primary-700",
  };
  const icons = {
    kids: faLeaf,
    new: faStar,
  };
  
  return (
    <span className={twMerge("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold font-sans", styles[variant])}>
      <FontAwesomeIcon icon={icons[variant]} className="size-3.5" />
      {label}
    </span>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button className="size-11 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500">
        <FontAwesomeIcon icon={icon} className="text-[18px]" />
      </button>
      <span className="text-[10px] text-gray-300 font-semibold font-sans">{label}</span>
    </div>
  );
}

function EpisodeCard({ episode, active, onClick }) {
  const isCompleted = episode.progress === 100;
  
  return (
    <div 
      onClick={onClick}
      className={twMerge(
        "group relative flex items-center w-full h-[93px] px-3.5 rounded-2xl border-[1.5px] cursor-pointer transition-all",
        active 
          ? "bg-primary-100 border-primary-500" 
          : "bg-gray-50 border-gray-100 hover:border-gray-200"
      )}
    >
      <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200">
        {episode.still_path && (
          <img 
            src={`https://image.tmdb.org/t/p/w200${episode.still_path}`} 
            alt="" 
            className="w-full h-full object-cover"
          />
        )}
        {isCompleted ? (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <div className="size-4.5 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <FontAwesomeIcon icon={faPlay} className="text-white text-[8px] translate-x-0.5" />
            </div>
          </div>
        ) : active ? (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
             <FontAwesomeIcon icon={faPlay} className="text-white text-base" />
          </div>
        ) : null}
        
        {episode.progress > 0 && episode.progress < 100 && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900/30">
            <div 
              className="h-full bg-primary-500" 
              style={{ width: `${episode.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-4 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-primary-500">{episode.episode_number}화</span>
          {isCompleted ? (
            <span className="text-xs font-semibold text-green-600">✓ 시청 완료</span>
          ) : episode.progress > 0 && (
            <span className="text-xs font-semibold text-primary-500">{episode.progress}% 시청</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-gray-950 truncate mt-0.5">
          {episode.episode_number}화 - {episode.name || "신나는 모험"}
        </h3>
        <span className="text-[12px] text-gray-200 font-medium mt-0.5">{episode.runtime || 18}분</span>
      </div>

      <FontAwesomeIcon icon={faChevronRight} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
    </div>
  );
}

// ── DetailPage ─────────────────────────────────────────────────

export default function DetailPage({ isModal = false }) {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("episodes"); // episodes | info
  const [selectedSeason, setSelectedSeason] = useState(2);
  const [currentEpId, setCurrentEpId] = useState(13);

  const mockEpisodes = [
    { id: 1, episode_number: 1, name: "우주의 신비", runtime: 18, progress: 100, still_path: null },
    { id: 2, episode_number: 2, name: "별자리의 비밀", runtime: 18, progress: 100, still_path: null },
    { id: 3, episode_number: 3, name: "외계인 친구", runtime: 18, progress: 100, still_path: null },
    { id: 4, episode_number: 4, name: "블랙홀 탈출", runtime: 18, progress: 72, still_path: null },
    { id: 5, episode_number: 5, name: "은하수 기차", runtime: 18, progress: 0, still_path: null },
    { id: 6, episode_number: 6, name: "로봇 행성", runtime: 18, progress: 0, still_path: null },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, v, s] = await Promise.all([
          api.get(`movie/${movieId}`).then((r) => r.data).catch(() => null),
          api.get(`movie/${movieId}/videos`).then((r) => r.data.results).catch(() => []),
          api.get(`movie/${movieId}/similar`).then((r) => r.data.results).catch(() => []),
        ]);
        setMovie(m);
        setVideos(v);
        setSimilar(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        if (!isModal) window.scrollTo(0, 0);
      }
    };
    load();
  }, [movieId, isModal]);

  const onClose = (e) => {
    e?.stopPropagation();
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={twMerge(
        "bg-white flex flex-col items-center justify-center gap-6 z-50",
        isModal ? "fixed inset-0" : "min-h-screen"
      )}>
        <div className="size-48 bg-primary-300 rounded-full flex items-center justify-center shadow-lg animate-bounce overflow-hidden border-4 border-white">
          <img src={AI_ROO} className="w-[200px] h-[300px] object-contain translate-y-6" alt="루" />
        </div>
        <p className="text-3xl font-black text-primary-600 animate-pulse font-sans">로딩중...</p>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube") || videos[0];
  const poster = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  const detailContent = (
    <div className={twMerge(
      "bg-white overflow-hidden relative",
      isModal ? "w-full max-w-[1000px] my-10 rounded-[48px] shadow-2xl" : "min-h-screen"
    )} onClick={(e) => e.stopPropagation()}>
      
      {/* ── 1. Video Player ── */}
      <VideoPlayer
        youtubeKey={trailer?.key}
        poster={poster}
        title={movie.title}
        subtitle={`시즌 2 · ${currentEpId}화 - 우주의 신비`}
        onBack={isModal ? onClose : () => navigate(-1)}
        onClose={onClose}
        className={isModal ? "h-[560px]" : "max-h-[560px]"}
      />

      {/* ── 2. Content Info Section ── */}
      <section className="w-full px-5 md:px-12 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2.5 flex-1 min-w-0 text-left">
              <div className="flex gap-2">
                <Chip variant="kids" label="키즈 4~7세" />
                <Chip variant="new" label="신규" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-950 leading-tight">{movie.title}</h1>
              <p className="text-base text-gray-300 font-medium">· 24화 · 모험/판타지</p>
              <p className="text-base text-gray-600 leading-relaxed font-medium mt-1 max-w-[800px]">
                {movie.overview || "꼬마 탐험가 루나와 친구들이 신비로운 우주를 탐험하며 펼치는 신나는 모험! 별자리의 비밀을 풀고, 외계인 친구들과 우정을 나누며 성장하는 이야기를 담았어요."}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium"># 모험</span>
                <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium"># 과학</span>
                <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium"># 새로운 콘텐츠</span>
              </div>
            </div>

            <div className="flex gap-3 shrink-0 pt-1">
              <ActionBtn icon={faHeart} label="좋아요" />
              <ActionBtn icon={faShareNodes} label="공유" />
              <ActionBtn icon={faDownload} label="다운로드" />
            </div>
          </div>

          <button className="w-full h-[60px] bg-primary-500 hover:bg-primary-400 text-gray-950 font-extrabold text-lg rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-lg">
            <FontAwesomeIcon icon={faPlay} className="text-base" />
            <span>13화부터 이어보기</span>
          </button>
        </div>

        {/* ── 3. Tabs & Episode List ── */}
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-base font-bold text-gray-950">시즌</span>
            <button 
              onClick={() => setSelectedSeason(1)}
              className={twMerge(
                "px-6 py-2.5 rounded-xl text-base font-bold transition-all",
                selectedSeason === 1 ? "bg-primary-500 text-gray-950" : "bg-white text-gray-600 border border-gray-100"
              )}
            >시즌 1</button>
            <button 
              onClick={() => setSelectedSeason(2)}
              className={twMerge(
                "px-6 py-2.5 rounded-xl text-base font-bold transition-all",
                selectedSeason === 2 ? "bg-primary-500 text-gray-950" : "bg-white text-gray-600 border border-gray-100"
              )}
            >시즌 2</button>
          </div>

          <div className="flex border-b border-gray-100 mb-8">
            <button 
              onClick={() => setActiveTab("episodes")}
              className={twMerge(
                "px-8 py-4 text-base font-bold relative transition-colors",
                activeTab === "episodes" ? "text-gray-950" : "text-gray-300"
              )}
            >
              에피소드
              {activeTab === "episodes" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("info")}
              className={twMerge(
                "px-8 py-4 text-base font-bold relative transition-colors",
                activeTab === "info" ? "text-gray-950" : "text-gray-300"
              )}
            >
              콘텐츠 정보
              {activeTab === "info" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-500 rounded-full" />}
            </button>
          </div>

          {activeTab === "episodes" && (
            <div className="flex flex-col gap-4 pb-10">
              {mockEpisodes.map((ep) => (
                <EpisodeCard 
                  key={ep.id} 
                  episode={ep} 
                  active={ep.episode_number === 5} 
                  onClick={() => {}}
                />
              ))}
            </div>
          )}
          
          {activeTab === "info" && (
            <div className="py-8 text-gray-600 font-medium text-lg min-h-[300px] text-left">
              <p>여기에 콘텐츠의 상세 제작 정보나 관련 스토리가 들어갑니다.</p>
              <p className="mt-4">감독: 루나 스튜디오</p>
              <p>출연: 루, 키키, 아로</p>
            </div>
          )}
        </div>

        {/* ── 4. 추천 콘텐츠 (복구) ── */}
        {similar.length > 0 && (
          <div className="mt-16 pb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#1a1a2e] text-left">이런 콘텐츠도 있어요</h2>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                <span className="text-lg font-bold">더보기</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similar.slice(0, 4).map((m) => (
                <div 
                  key={m.id} 
                  className="cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${m.id}`, { replace: true, state: { background: location.state?.background } });
                  }}
                >
                  <Card
                    title={m.title}
                    image={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : undefined}
                    size="sm"
                    className="aspect-[3/4] rounded-[28px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {!isModal && <Footer />}
    </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/70 flex justify-center items-start overflow-y-auto pt-10 pb-10 px-4 md:px-0 scrollbar-hide"
        onClick={onClose}
      >
        {detailContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav activeTab="main" />
      <main className="pb-16">
        {detailContent}
      </main>
      <Footer />
    </div>
  );
}
