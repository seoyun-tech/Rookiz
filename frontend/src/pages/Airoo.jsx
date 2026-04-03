import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

const imgRoo = "/Airoo-circle.png";
const BACKEND = "https://rookiz.onrender.com/chat";

const STARS = [
  { x: 10, y: 74, size: 5, opacity: 0.59 },
  { x: 426, y: 11, size: 5, opacity: 0.37 },
  { x: 184, y: 3, size: 4, opacity: 0.56, gold: true },
  { x: 566, y: 199, size: 5, opacity: 0.33 },
  { x: 58, y: 99, size: 6, opacity: 0.52 },
  { x: 962, y: 20, size: 4, opacity: 0.30 },
  { x: 713, y: 113, size: 5, opacity: 0.11 },
  { x: 346, y: 184, size: 5, opacity: 0.36, gold: true },
  { x: 1187, y: 15, size: 6, opacity: 0.36 },
];

const QUICK_MESSAGES = [
  "오늘의 추천 콘텐츠",
  "4-7세 인기 콘텐츠",
  "퀴즈 하고 싶어!",
];

function formatTime(date) {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${m}`;
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-15 px-5 py-0.5 rounded-full flex items-center gap-2 font-bold text-xl leading-4 shadow-sm transition-colors ${
        active
          ? "bg-blue-100 border-2 border-blue-500 text-gray-700"
          : "bg-gray-50 border-2 border-gray-300 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function BotMessage({ text, time, loading = false }) {
  return (
    <div className="flex items-start gap-4 w-full">
      <div className="shrink-0 size-12.5 rounded-full bg-primary-300 overflow-hidden shadow-sm">
        <img src={imgRoo} className="size-full object-cover" alt="루" />
      </div>
      <div className="flex flex-col gap-1.5 items-start">
        <div className="bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-5 shadow-sm max-w-96">
          <p className={`text-lg font-medium leading-4 whitespace-pre-wrap break-words ${loading ? "text-gray-400 animate-pulse" : "text-gray-700"}`}>
            {text}
          </p>
        </div>
        {time && <span className="text-sm font-medium text-gray-300">{time}</span>}
      </div>
    </div>
  );
}

function UserMessage({ text, time }) {
  return (
    <div className="flex flex-col items-end gap-1.5 w-full">
      <div className="bg-primary-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl p-5 max-w-96">
        <p className="text-lg font-medium text-gray-700 leading-4 whitespace-pre-wrap break-words">
          {text}
        </p>
      </div>
      <span className="text-sm font-medium text-gray-300">{time}</span>
    </div>
  );
}

export default function AiRoo() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "안녕 나는 루야!\n궁금한 콘텐츠나 추천이 필요하면 뭐든 물어봐줘!",
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("talk");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const now = formatTime(new Date());
    setMessages((prev) => [...prev, { role: "user", text: msg, time: now }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply, time: formatTime(new Date()) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "서버 연결에 실패했습니다. 다시 시도해주세요.",
          time: formatTime(new Date()),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      <Nav activeTab="airon" />
      <div className="w-full overflow-hidden relative bg-linear-[169deg] from-gray-950 to-primary-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STARS.map((star, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${star.gold ? "bg-primary-500" : "bg-white/50"}`}
              style={{
                left: `${(star.x / 1280) * 100}%`,
                top: star.y,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        <div className="w-content mx-auto py-10 flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="size-24 rounded-full bg-primary-300 overflow-hidden shadow-sm shrink-0">
              <img src={imgRoo} className="size-full object-cover" alt="AI 루" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-white leading-6">AI 루</h1>
              <p className="text-base font-medium text-white/65">
                최승아의 AI 친구 · 콘텐츠 추천 &amp; 퀴즈 도우미
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
            <TabButton label="루와 대화하기" active={activeTab === "talk"} onClick={() => setActiveTab("talk")} />
            <TabButton label="퀴즈와 미션" active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} />
          </div>
        </div>
      </div>

      <div className="w-content flex-1 flex flex-col py-4 min-h-[400px]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pl-6 pt-4">
          {messages.map((msg, i) =>
            msg.role === "bot" ? (
              <BotMessage key={i} text={msg.text} time={msg.time} />
            ) : (
              <UserMessage key={i} text={msg.text} time={msg.time} />
            )
          )}
          {loading && <BotMessage text="..." time="" loading />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="w-content flex gap-6 items-center pb-3">
        {QUICK_MESSAGES.map((msg) => (
          <button
            key={msg}
            onClick={() => sendMessage(msg)}
            disabled={loading}
            className="h-11 min-w-30 px-5 py-2.5 rounded-2xl border border-primary-500 bg-primary-100 flex items-center gap-1 shrink-0 hover:bg-primary-200 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-bold text-gray-700 text-center whitespace-nowrap">
              {msg}
            </span>
          </button>
        ))}
      </div>

      <div className="w-container bg-gray-50 flex gap-5 h-25 items-center justify-center">
        <div className="w-[1100px] h-20 bg-white border-4 border-primary-500 rounded-3xl flex items-center justify-between px-8 py-1">
          <img src={imgRoo} className="size-7 rounded-full" alt="" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="루에게 물어봐!"
            disabled={loading}
            className="flex-1 mx-6 text-xl font-medium text-gray-700 placeholder:text-gray-300 tracking-tight outline-none bg-transparent"
          />
          <button className="size-9.5 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors">
            <FontAwesomeIcon icon={faMicrophone} className="text-xl" />
          </button>
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="size-20 bg-primary-500 rounded-3xl flex items-center justify-center shrink-0 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="size-9.5 bg-white rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPaperPlane} className="text-lg text-primary-950" />
          </div>
        </button>
      </div>

      <Footer />
    </div>
  );
}
