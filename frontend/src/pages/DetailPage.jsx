import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import api from "../api/axios";
import { Nav } from "../components/common/Nav";
import { Footer } from "../components/common/Footer";
import { Card } from "../components/common/Card";
import { ContentRow } from "../components/common/ContentRow";
import { VideoPlayer } from "../components/common/VideoPlayer";

const AI_ROO =
  "https://www.figma.com/api/mcp/asset/72ba9870-e738-4c0f-9884-a7b11cfa61cc";

// 좋아요 / 공유 / 다운로드 아이콘 (Figma 에셋)
const ACTION_ICONS = {
  like:     "https://www.figma.com/api/mcp/asset/a6a72209-a80c-45cb-bfb4-f6664973b57e",
  share:    "https://www.figma.com/api/mcp/asset/eebbc64e-756c-45bd-aa0d-0c96ba17ad35",
  download: "https://www.figma.com/api/mcp/asset/a8c6bd82-8920-412e-9777-730dc7542595",
  leaf:     "https://www.figma.com/api/mcp/asset/a179a416-bafd-48d0-bf4e-e955eefc114e",
  star:     "https://www.figma.com/api/mcp/asset/189843fd-c927-4f0e-bb09-f074f087c680",
};

// ── 서브 컴포넌트 ──────────────────────────────────────────────

function Chip({ bg, textColor, icon, label }) {
  return (
    <span
      className={twMerge(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold font-sans",
        bg,
        textColor
      )}
    >
      {icon && <img src={icon} alt="" className="size-4 object-contain" />}
      {label}
    </span>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button className="size-11 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
        <img src={icon} alt={label} className="size-[18px] object-contain" />
      </button>
      <span className="text-[10px] text-gray-300 font-semibold font-sans">{label}</span>
    </div>
  );
}

function GenreTag({ name }) {
  return (
    <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-sans">
      # {name}
    </span>
  );
}

// ── DetailPage ─────────────────────────────────────────────────

export default function DetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [m, v, s] = await Promise.all([
        api.get(`movie/${movieId}`).then((r) => r.data).catch(() => null),
        api.get(`movie/${movieId}/videos`).then((r) => r.data.results).catch(() => []),
        api.get(`movie/${movieId}/similar`).then((r) => r.data.results).catch(() => []),
      ]);
      setMovie(m);
      setVideos(v);
      setSimilar(s);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    load();
  }, [movieId]);

  // ── 로딩 상태 ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="size-48 bg-primary-300 rounded-full flex items-center justify-center shadow-lg animate-bounce overflow-hidden border-4 border-white">
          <img
            src={AI_ROO}
            className="w-[200px] h-[300px] object-contain translate-y-6"
            alt="루"
          />
        </div>
        <p className="text-3xl font-black text-primary-600 animate-pulse font-sans">
          로딩중...
        </p>
      </div>
    );
  }

  // ── 에러 상태 ──
  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold font-sans">영화를 찾을 수 없어요!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-500 text-gray-950 px-6 py-3 rounded-full font-bold font-sans"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const trailer =
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    videos[0];

  const poster = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

  const genres = movie.genres ?? [];
  const runtime = movie.runtime ? `${movie.runtime}분` : null;
  const metaParts = [runtime, genres.map((g) => g.name).join("/")].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Nav activeTab="main" />

      <main className="pb-16">
        {/* ── 1. VideoPlayer 공용 컴포넌트 ── */}
        <VideoPlayer
          youtubeKey={trailer?.key}
          poster={poster}
          title={movie.title}
          subtitle={metaParts.join(" · ")}
          onBack={() => navigate(-1)}
          className="max-h-[560px]"
        />

        {/* ── 2. 콘텐츠 정보 ── */}
        <section className="w-full max-w-[1000px] mx-auto px-5 md:px-8 pt-6 flex flex-col gap-3">

          {/* 칩 + 액션 버튼 행 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {/* 칩 */}
              <div className="flex flex-wrap gap-2">
                <Chip
                  bg="bg-green-200"
                  textColor="text-green-600"
                  icon={ACTION_ICONS.leaf}
                  label="키즈 4~7세"
                />
                <Chip
                  bg="bg-primary-400"
                  textColor="text-primary-700"
                  icon={ACTION_ICONS.star}
                  label="신규"
                />
              </div>
              {/* 제목 */}
              <h1 className="text-2xl font-extrabold text-gray-950 font-sans leading-tight">
                {movie.title}
              </h1>
              {/* 메타 */}
              {metaParts.length > 0 && (
                <p className="text-sm text-gray-300 font-sans">
                  · {metaParts.join(" · ")}
                </p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2.5 shrink-0">
              <ActionBtn icon={ACTION_ICONS.like} label="좋아요" />
              <ActionBtn icon={ACTION_ICONS.share} label="공유" />
              <ActionBtn icon={ACTION_ICONS.download} label="다운로드" />
            </div>
          </div>

          {/* 설명 */}
          {movie.overview && (
            <p className="text-sm text-gray-600 leading-relaxed font-sans break-keep">
              {movie.overview}
            </p>
          )}

          {/* 장르 태그 */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </div>
          )}

          {/* CTA 버튼 */}
          {trailer && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full bg-primary-500 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-base text-gray-950 font-sans hover:bg-primary-400 transition-colors mt-1"
            >
              <span>▶</span>
              <span>지금 바로 보기</span>
            </button>
          )}
        </section>

        {/* ── 3. 이런 콘텐츠도 있어요 ── */}
        {similar.length > 0 && (
          <section className="w-full max-w-[1000px] mx-auto px-5 md:px-8 pt-10">
            <ContentRow title="이런 콘텐츠도 있어요" showViewAll={false}>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {similar.slice(0, 8).map((m) => (
                  <div
                    key={m.id}
                    className="shrink-0 w-[150px] md:w-[170px] cursor-pointer"
                    onClick={() => navigate(`/movie/${m.id}`)}
                  >
                    <Card
                      title={m.title}
                      image={
                        m.poster_path
                          ? `https://image.tmdb.org/t/p/w300/${m.poster_path}`
                          : undefined
                      }
                      size="sm"
                      className="aspect-[3/4] rounded-[28px]"
                    />
                  </div>
                ))}
              </div>
            </ContentRow>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
