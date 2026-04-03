import { useEyeGuard, WARN_RATIO } from "../hooks/useEyeGuard";

const MSGS = {
  noface:  { text: "얼굴이 감지되지 않습니다",           icon: "?",  color: "var(--color-status-inactive)" },
  ok:      { text: "적정 거리입니다",                     icon: "✓",  color: "var(--color-status-ok)" },
  caution: { text: "조금 멀어지세요",                     icon: "!",  color: "var(--color-status-caution)" },
  danger:  { text: "너무 가깝습니다!\n화면에서 멀어지세요", icon: "⚠", color: "var(--color-status-danger)" },
  loading: { text: "모델 로딩 중...",                     icon: "⏳", color: "var(--color-status-loading)" },
};

export function EyeGuard() {
  const { videoRef, status, ratio, running, start, stop } = useEyeGuard();

  const msg = MSGS[status];
  const pct = Math.min(ratio / WARN_RATIO, 1);
  const gaugeColor = status === "danger"
    ? "var(--color-status-danger)"
    : status === "caution"
    ? "var(--color-status-caution)"
    : "var(--color-status-ok)";

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-dark-50 p-6 gap-6 font-sans">

      <div className="text-center">
        <div className="text-[13px] tracking-[4px] text-dark-500 mb-1.5 uppercase">Eye Guard</div>
        <div className="text-[22px] font-bold text-dark-50">눈 거리 보호 앱</div>
      </div>

      <div className="relative w-[280px] h-[210px] rounded-2xl overflow-hidden bg-dark-600 border border-dark-900">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full h-full object-cover [transform:scaleX(-1)] ${running ? "block" : "hidden"}`}
        />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-[40px]">📷</span>
            <span className="text-xs text-dark-600">카메라 대기 중</span>
          </div>
        )}
        {running && (
          <div
            className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-3.5 py-1 text-[11px] whitespace-nowrap backdrop-blur-sm border"
            style={{ color: msg.color, borderColor: `${msg.color}44` }}
          >
            {msg.icon} {msg.text.split("\n")[0]}
          </div>
        )}
      </div>

      <div className="w-[280px]">
        <div className="flex justify-between text-[11px] text-dark-500 mb-1.5">
          <span>멀다 (안전)</span>
          <span>가깝다 (위험)</span>
        </div>
        <div className="h-2 bg-dark-900 rounded overflow-hidden">
          <div
            className="h-full rounded transition-[width] duration-150 ease-linear"
            style={{
              width: `${pct * 100}%`,
              background: gaugeColor,
              boxShadow: running ? `0 0 8px ${gaugeColor}88` : "none",
            }}
          />
        </div>
        <div className="text-center mt-1.5 text-[11px] text-dark-500">
          {running ? `얼굴 비율 ${Math.round(ratio * 100)}% (임계 ${Math.round(WARN_RATIO * 100)}%)` : "—"}
        </div>
      </div>

      <div
        className="w-[280px] min-h-[72px] rounded-xl flex flex-col items-center justify-center gap-1 p-3 border transition-all duration-300"
        style={{
          background:  running ? `${msg.color}11` : "var(--color-dark-600)",
          borderColor: running ? `${msg.color}44` : "var(--color-dark-500)",
        }}
      >
        <div className="transition-[font-size] duration-300" style={{ fontSize: status === "danger" ? "32px" : "24px" }}>
          {msg.icon}
        </div>
        <div
          className={`text-[13px] text-center leading-relaxed whitespace-pre-line ${status === "danger" ? "font-bold" : "font-normal"}`}
          style={{ color: running ? msg.color : "var(--color-dark-300)" }}
        >
          {msg.text}
        </div>
      </div>

      <button
        onClick={running ? stop : start}
        disabled={status === "loading"}
        className={`px-10 py-3 rounded-lg text-sm font-semibold border-0 tracking-wide transition-colors ${
          status === "loading"
            ? "bg-dark-600 text-dark-500 cursor-not-allowed"
            : running
            ? "bg-dark-900 text-dark-300 cursor-pointer"
            : "bg-dark-action text-white cursor-pointer"
        }`}
      >
        {status === "loading" ? "로딩 중..." : running ? "중지" : "시작"}
      </button>

      <div className="text-[11px] text-dark-600 text-center leading-7">
        적정 시청 거리: <span className="text-status-ok">30cm 이상</span><br />
        전면 카메라 필요
      </div>
    </div>
  );
}
