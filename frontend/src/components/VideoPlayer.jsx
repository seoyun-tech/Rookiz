import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";

// ── Figma 에셋 아이콘 ──────────────────────────────────────────
const ICONS = {
  play:       "https://www.figma.com/api/mcp/asset/7d614a2a-0c5c-4e83-bb65-eed4d14c82d8",
  pause:      "https://www.figma.com/api/mcp/asset/dce73023-00b7-4637-acce-2cf9f40fbc95",
  prev:       "https://www.figma.com/api/mcp/asset/615267d7-382b-4f12-b240-d23830f7112d",
  next:       "https://www.figma.com/api/mcp/asset/eb17cddd-2252-41aa-ae64-d798d06687b1",
  volume:     "https://www.figma.com/api/mcp/asset/c3b0278f-47ed-4bb1-9453-e6ac50c641cc",
  muted:      "https://www.figma.com/api/mcp/asset/e80dcec2-c77e-4c10-aa1f-55a518c93052",
  caption:    "https://www.figma.com/api/mcp/asset/a373593c-4c95-4116-a246-5fd199fbe855",
  fullscreen: "https://www.figma.com/api/mcp/asset/b0b4a2b6-37ac-4370-9fd1-cad4ce4997b4",
  back:       "https://www.figma.com/api/mcp/asset/e832e8b4-1b35-45bc-8a96-621e43ea64de",
};

// ── 서브 컴포넌트 ──────────────────────────────────────────────

/**
 * Player/Control/Btn/Back
 * bg: rgba(28,28,28,0.6), size: 38px
 */
function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="뒤로가기"
      className="flex items-center justify-center size-[38px] rounded-full bg-gray-950/60 hover:bg-gray-950/80 transition-colors shrink-0"
    >
      <img src={ICONS.back} alt="" className="size-[21px] object-contain" />
    </button>
  );
}

/**
 * Player/Control/Btn (일반 소형 버튼)
 * bg: rgba(255,255,255,0.12), size: 38px 또는 33px
 */
function CtrlBtn({ icon, iconSize = 17, size = 38, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center justify-center rounded-full bg-white/12 hover:bg-white/22 transition-colors shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <img src={icon} alt="" style={{ width: iconSize, height: iconSize }} className="object-contain" />
    </button>
  );
}

/**
 * Player/Control/Btn/Caption
 * bg: primary-500 (노란색), size: 38px
 */
function CaptionBtn() {
  return (
    <button className="flex items-center justify-center size-[38px] rounded-full bg-primary-500 hover:bg-primary-400 transition-colors shrink-0">
      <img src={ICONS.caption} alt="자막" className="size-4 object-contain" />
    </button>
  );
}

/**
 * Player/Control/Btn (Play / Pause)
 * Figma 에셋이 버튼 전체 이미지(노란 원 + 아이콘)
 * size: 50px (기본), hover scale
 */
function PlayPauseBtn({ playing, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? "일시정지" : "재생"}
      className="shrink-0 hover:scale-110 transition-transform drop-shadow-lg"
    >
      <img
        src={playing ? ICONS.pause : ICONS.play}
        alt={playing ? "일시정지" : "재생"}
        className="size-[50px] md:size-[60px] object-contain"
      />
    </button>
  );
}

/**
 * Player/Control/Btn (건너뛰기)
 * bg: rgba(28,28,28,0.6), pill 형태, h: 27px
 */
function SkipBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-[27px] px-[13px] rounded-xl flex items-center justify-center bg-gray-950/60 hover:bg-gray-950/80 transition-colors"
    >
      <span className="text-white font-extrabold text-sm font-sans leading-5 whitespace-nowrap">
        건너뛰기
      </span>
    </button>
  );
}

/**
 * Player/Control/ProgressBar
 * 진행바 + 현재시간 / 전체시간
 */
function ProgressBar({ played, duration, onSeek }) {
  const fmt = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek?.((e.clientX - rect.left) / rect.width);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="h-1 bg-primary-500 rounded-full"
          style={{ width: `${(played ?? 0) * 100}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[11.6px] text-white/60 font-semibold font-sans">
          {fmt((played ?? 0) * (duration ?? 0))}
        </span>
        <span className="text-[11.6px] text-white/40 font-semibold font-sans">
          {fmt(duration ?? 0)}
        </span>
      </div>
    </div>
  );
}

// ── 메인 VideoPlayer ───────────────────────────────────────────

/**
 * VideoPlayer — 공용 비디오 플레이어
 *
 * Props:
 *   youtubeKey  YouTube 영상 key (watch?v= 의 값)
 *   poster      재생 전 보여줄 배경 이미지 URL
 *   title       상단에 표시할 제목
 *   subtitle    부제목 (시즌·화수 등)
 *   onBack      뒤로가기 버튼 콜백
 *   className   감싸는 div에 추가할 클래스
 */
export function VideoPlayer({ youtubeKey, poster, title, subtitle, onBack, className }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCtrl, setShowCtrl] = useState(true);
  const playerRef = useRef(null);

  const togglePlay = () => setPlaying((v) => !v);
  const toggleMute = () => setMuted((v) => !v);
  const handleSeek = (ratio) => {
    playerRef.current?.seekTo(ratio);
    setPlayed(ratio);
  };

  // 플레이어 클릭 시 컨트롤 토글 (재생 중일 때만)
  const handleWrapperClick = () => {
    if (playing) setShowCtrl((v) => !v);
  };

  const ctrlVisible = showCtrl || !playing;

  return (
    <div
      className={twMerge("relative w-full overflow-hidden bg-black select-none", className)}
      style={{ aspectRatio: "16/9" }}
      onClick={handleWrapperClick}
    >
      {/* 배경 포스터 이미지 */}
      {poster && (
        <img
          src={poster}
          alt={title ?? ""}
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          loading="eager"
        />
      )}

      {/* ReactPlayer */}
      {youtubeKey && (
        <div className={twMerge("absolute inset-0", !playing && "invisible")}>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${youtubeKey}`}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            onProgress={({ played: p }) => setPlayed(p)}
            onDuration={(d) => setDuration(d)}
          />
        </div>
      )}

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 pointer-events-none overlay-player" />

      {/* ── 컨트롤 레이어 ── */}
      {ctrlVisible && (
        <div
          className="absolute inset-0 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단: 뒤로가기 + 제목 + 볼륨/풀스크린 */}
          <div className="flex items-start justify-between px-5 pt-5 md:px-7 md:pt-6">
            <div className="flex items-center gap-3">
              <BackBtn onClick={onBack} />
              <div className="flex flex-col gap-0.5 min-w-0">
                {title && (
                  <p className="text-white font-extrabold text-sm md:text-base font-sans leading-5 truncate">
                    {title}
                  </p>
                )}
                {subtitle && (
                  <p className="text-white/70 text-xs font-sans truncate">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CtrlBtn
                icon={muted ? ICONS.muted : ICONS.volume}
                size={33}
                iconSize={15}
                onClick={toggleMute}
              />
              <CtrlBtn
                icon={ICONS.fullscreen}
                size={38}
                iconSize={16}
              />
            </div>
          </div>

          {/* 중앙: Prev + Play/Pause + Next */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-6 md:gap-10">
              <CtrlBtn icon={ICONS.prev} size={38} iconSize={17} />
              <PlayPauseBtn playing={playing} onClick={togglePlay} />
              <CtrlBtn icon={ICONS.next} size={38} iconSize={17} />
            </div>
            {/* 재생 전 안내 문구 */}
            {!playing && (
              <p className="text-white font-semibold text-sm md:text-base font-sans mt-2">
                ▶ 재생 버튼을 눌러 시작하세요
              </p>
            )}
          </div>

          {/* 하단: 건너뛰기 + 자막 + 진행바 */}
          <div className="flex flex-col gap-3 px-5 pb-5 md:px-7 md:pb-6">
            <div className="flex items-center justify-between">
              <SkipBtn />
              <CaptionBtn />
            </div>
            <ProgressBar played={played} duration={duration} onSeek={handleSeek} />
          </div>
        </div>
      )}
    </div>
  );
}
