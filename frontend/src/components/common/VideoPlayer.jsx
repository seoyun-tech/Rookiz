import { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlay,
  faPause,
  faBackwardStep,
  faForwardStep,
  faVolumeHigh,
  faVolumeXmark,
  faAngleLeft,
  faXmark,
  faRotateLeft,
  faRotateRight,
  faLock,
  faDisplay,
  faGear,
  faExpand,
  faClosedCaptioning
} from "@fortawesome/free-solid-svg-icons";

// ── Figma 에셋 아이콘 ──────────────────────────────────────────
const ICONS = {
  back:       "https://www.figma.com/api/mcp/asset/e832e8b4-1b35-45bc-8a96-621e43ea64de",
  cast:       "https://www.figma.com/api/mcp/asset/22161062-bfa3-489b-a17a-9d6a70863c92",
  close:      "https://www.figma.com/api/mcp/asset/b03c2e70-d9e0-479c-a5af-642dd69c75c9",
  lock:       "https://www.figma.com/api/mcp/asset/1ea8668a-0c5c-4e83-bb65-eced830efc26",
};

// ── 서브 컴포넌트 ──────────────────────────────────────────────

function CtrlBtn({ onClick, className, children, size = 33 }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={twMerge(
        "flex items-center justify-center rounded-full bg-white/12 hover:bg-white/22 transition-all shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  );
}

// ── 메인 VideoPlayer ───────────────────────────────────────────

export function VideoPlayer({ youtubeKey, poster, title, subtitle, onBack, onClose, className }) {
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // 재생 시작 여부 추적
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCtrl, setShowCtrl] = useState(true);
  const [isIntro, setIsIntro] = useState(true);
  const playerRef = useRef(null);
  const controlsTimerRef = useRef(null);

  // 컨트롤 UI 자동 숨김 타이머
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    
    // 재생 중일 때만 3초 후 숨김 (일시정지 중에는 계속 표시)
    if (playing) {
      setShowCtrl(true);
      controlsTimerRef.current = setTimeout(() => {
        setShowCtrl(false);
      }, 3000);
    } else {
      setShowCtrl(true);
    }
  }, [playing]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [playing, resetControlsTimer]);

  const togglePlay = () => {
    if (!hasStarted) setHasStarted(true);
    setPlaying((v) => !v);
  };

  const toggleMute = () => setMuted((v) => !v);
  
  const handleSeek = (ratio) => {
    playerRef.current?.seekTo(ratio);
    setPlayed(ratio);
  };

  const skipTime = (amount) => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(currentTime + amount);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleWrapperClick = () => {
    if (!hasStarted) {
      togglePlay();
    } else {
      if (!showCtrl) {
        setShowCtrl(true);
        resetControlsTimer();
      } else {
        // 일시정지 중일 때는 클릭해도 숨기지 않음 (디테일 조작 편의성)
        if (playing) setShowCtrl(false);
      }
    }
  };

  useEffect(() => {
    if (playedSeconds > 20) setIsIntro(false);
    else setIsIntro(true);
  }, [playedSeconds]);

  return (
    <div
      className={twMerge("relative w-full overflow-hidden bg-black select-none", className)}
      style={{ aspectRatio: "16/9" }}
      onClick={handleWrapperClick}
      onMouseMove={hasStarted && playing ? resetControlsTimer : undefined}
    >
      {/* ── 1. 비디오 영역 ── */}
      {youtubeKey && (
        <div className={twMerge("absolute inset-0", !hasStarted && "opacity-0")}>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${youtubeKey}`}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            onProgress={({ played: p, playedSeconds: ps }) => {
              setPlayed(p);
              setPlayedSeconds(ps);
            }}
            onDuration={(d) => setDuration(d)}
          />
        </div>
      )}

      {/* ── 2. 재생 전 프리뷰 배경 ── */}
      {!hasStarted && poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
      )}

      {/* ── 3. 공통 오버레이 ── */}
      <div className={twMerge(
        "absolute inset-0 pointer-events-none bg-linear-[180deg] from-black/55 via-transparent to-black/80 transition-opacity duration-500",
        showCtrl ? "opacity-100" : "opacity-0"
      )} />

      {/* ── 4. UI 레이어 (상태별 분기) ── */}
      <div className={twMerge(
        "absolute inset-0 flex flex-col transition-opacity duration-500",
        showCtrl ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={(e) => e.stopPropagation()}>
        
        {/* (A) 상단 바 */}
        <div className="flex items-start justify-between px-[20.5px] pt-[27px]">
          <div className="flex items-center gap-[12px]">
            <CtrlBtn onClick={onBack} size={38}>
              <img src={ICONS.back} alt="뒤로" className="size-[21px]" />
            </CtrlBtn>
            <div className="flex flex-col text-left">
              <h2 className="text-white font-extrabold text-[16px] leading-tight truncate">{title}</h2>
              <p className="text-white/70 text-[12px] font-medium mt-0.5 truncate">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-[9px]">
            <CtrlBtn size={38}>
              <img src={ICONS.cast} className="size-4 object-contain" alt="캐스트" />
            </CtrlBtn>
            {hasStarted && (
              <CtrlBtn size={38}>
                <FontAwesomeIcon icon={faLock} className="text-white text-[15px]" />
              </CtrlBtn>
            )}
            <CtrlBtn onClick={onClose} size={38}>
              <img src={ICONS.close} className="size-[15px] object-contain" alt="닫기" />
            </CtrlBtn>
          </div>
        </div>

        {/* (B) 중앙 컨트롤 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {!hasStarted ? (
            /* [재생 전 프리뷰 중앙 UI] */
            <div className="flex flex-col items-center gap-[24px]">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="size-20 bg-primary-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,198,51,0.6)] hover:scale-110 transition-transform"
              >
                <FontAwesomeIcon icon={faPlay} className="text-gray-950 text-[32px] translate-x-0.5" />
              </button>
              <p className="text-white font-semibold text-[16px]">▶ 재생 버튼을 눌러 시작하세요</p>
            </div>
          ) : (
            /* [재생 시작 후 중앙 UI - 일시정지 시에도 동일하게 유지] */
            <div className="flex items-center gap-10 md:gap-16">
              <CtrlBtn onClick={() => skipTime(-10)} size={50} className="bg-white/10 hover:bg-white/20">
                <div className="relative">
                  <FontAwesomeIcon icon={faRotateLeft} className="text-white text-3xl" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold mt-1">10</span>
                </div>
              </CtrlBtn>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="size-20 bg-primary-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,198,51,0.6)] hover:scale-110 transition-transform"
              >
                <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-gray-950 text-[32px] translate-x-0.5" />
              </button>
              <CtrlBtn onClick={() => skipTime(10)} size={50} className="bg-white/10 hover:bg-white/20">
                <div className="relative">
                  <FontAwesomeIcon icon={faRotateRight} className="text-white text-3xl" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold mt-1">10</span>
                </div>
              </CtrlBtn>
            </div>
          )}
        </div>

        {/* (C) 하단 영역 */}
        <div className="w-full px-[20.5px] pb-[27px] mt-auto">
          {!hasStarted ? (
            /* [재생 전 프리뷰 하단 UI] */
            <div className="flex flex-col gap-5">
              <div className="flex justify-end">
                <CtrlBtn onClick={toggleMute} size={38}>
                  <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} className="text-white text-[16px]" />
                </CtrlBtn>
              </div>
              <div className="w-full h-[4px] bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '27%' }} />
              </div>
            </div>
          ) : (
            /* [재생 시작 후 하단 UI - 일시정지 시에도 동일하게 유지] */
            <div className="flex flex-col gap-5">
              {isIntro && (
                <button 
                  onClick={(e) => { e.stopPropagation(); skipTime(20); }}
                  className="self-start h-7 px-3.5 bg-gray-950/60 hover:bg-gray-950/80 rounded-xl text-white text-[14px] font-extrabold transition-colors"
                >
                  건너뛰기
                </button>
              )}
              <div className="flex flex-col gap-1.5">
                <div 
                  className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative group/bar"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleSeek((e.clientX - rect.left) / rect.width);
                  }}
                >
                  <div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full transition-all" style={{ width: `${played * 100}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" style={{ left: `calc(${played * 100}% - 6px)` }} />
                </div>
                <div className="flex justify-between text-[11.6px] font-semibold">
                  <span className="text-white/60">{formatTime(playedSeconds)}</span>
                  <span className="text-white/40">{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faBackwardStep} className="text-white text-xl cursor-pointer hover:text-primary-400" />
                  <button onClick={togglePlay} className="size-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-gray-950 text-base" />
                  </button>
                  <FontAwesomeIcon icon={faForwardStep} className="text-white text-xl cursor-pointer hover:text-primary-400" />
                  <CtrlBtn onClick={toggleMute} className="bg-transparent hover:bg-white/10">
                    <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} className="text-white text-lg" />
                  </CtrlBtn>
                </div>
                <div className="flex items-center gap-3">
                  <CtrlBtn className="bg-primary-500 hover:bg-primary-400"><FontAwesomeIcon icon={faClosedCaptioning} className="text-gray-950 text-lg" /></CtrlBtn>
                  <CtrlBtn className="bg-white/12 hover:bg-white/22"><FontAwesomeIcon icon={faGear} className="text-white text-lg" /></CtrlBtn>
                  <CtrlBtn className="bg-white/12 hover:bg-white/22"><FontAwesomeIcon icon={faExpand} className="text-white text-lg" /></CtrlBtn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. UI 숨김 시 최소 인터페이스 (재생 중일 때만) ── */}
      {!showCtrl && hasStarted && playing && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div className="h-full bg-primary-500/50" style={{ width: `${played * 100}%` }} />
        </div>
      )}
    </div>
  );
}
