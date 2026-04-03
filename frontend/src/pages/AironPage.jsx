import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment, faTrophy, faMagnifyingGlass, faCircleUp,
  faRocket, faMedal,
} from '@fortawesome/free-solid-svg-icons';
import { Nav } from '../components/common/Nav';
import { Footer } from '../components/common/Footer';

/* ── 데이터 ──────────────────────────────────────────────── */

const CHIPS = ["오늘의 추천 콘텐츠", "4-7세 인기 콘텐츠", "퀴즈 하고 싶어!"];

const STARS = [
  { top: 74,  left: 10,   size: 5, color: "bg-white/50" },
  { top: 3,   left: 184,  size: 3, color: "bg-primary-400/56" },
  { top: 11,  left: 426,  size: 4, color: "bg-white/37" },
  { top: 199, left: 566,  size: 5, color: "bg-white/33" },
  { top: 99,  left: 58,   size: 5, color: "bg-white/52" },
  { top: 210, left: 23,   size: 4, color: "bg-primary-400/23" },
  { top: 187, left: 715,  size: 3, color: "bg-primary-400/41" },
  { top: 193, left: 929,  size: 5, color: "bg-white/29" },
  { top: 20,  left: 962,  size: 3, color: "bg-white/30" },
  { top: 184, left: 346,  size: 5, color: "bg-primary-400/36" },
  { top: 15,  left: 1187, size: 5, color: "bg-white/36" },
];

const QUIZ_DATA = {
  icon: faRocket,
  question: '오늘 시청한 <우주특공대>에서 주인공 민철이가 간 태양계에서 가장 작은 별은?',
  options: ['화성', '목성', '천왕성', '해왕성'],
};

const MISSION_DATA = {
  icon: faMedal,
  question: '미션을 잘 지키면 칭찬 하루 스티커를 붙여줄게! 오늘 어떤걸 지켰어?',
  options: [
    '1시간만 보고 종료하기',
    '오빠랑 30분씩 돌아가면서 보기',
    '루처럼 멋진 자세로 보기',
    '보고 싶은 영상이 생기면 부모님께 먼저 물어보기',
  ],
};

const TABS = [
  { id: 'talk', icon: faComment, label: '루와 대화하기', activeClass: 'bg-blue-100 border-blue-500 text-gray-700' },
  { id: 'quiz', icon: faTrophy,  label: '퀴즈와 미션',   activeClass: 'bg-primary-100 border-primary-500 text-gray-700' },
];

/* ── 공통 컴포넌트 ────────────────────────────────────────── */

function AiHero({ tab, setTab }) {
  return (
    <section className="w-full bg-linear-[169deg] from-ai-dark to-ai-mid relative overflow-hidden shrink-0">
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className={twMerge("absolute rounded-full", s.color)}
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          />
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-10 flex flex-col gap-5 relative z-10">
        <div className="flex items-center gap-5">
          <div className="size-[95px] rounded-full bg-primary-300 shrink-0 overflow-hidden shadow-sm">
            <img src="/Airoo-circle.png" alt="AI 루" className="size-full object-cover scale-x-[-1]" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white">AI 루</h1>
            <p className="text-base font-medium text-white/65">
              최승아의 AI 친구 · 콘텐츠 추천 &amp; 퀴즈 도우미
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {TABS.map(({ id, icon, label, activeClass }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={twMerge(
                "flex items-center gap-2 h-[60px] px-6 rounded-full border-2 shadow-sm font-bold text-xl transition-colors cursor-pointer",
                tab === id ? activeClass : "bg-gray-100 border-gray-300 text-gray-400"
              )}
            >
              <FontAwesomeIcon icon={icon} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 대화 탭 ─────────────────────────────────────────────── */

function AiMessage({ msg }) {
  if (msg.from === 'ai') {
    return (
      <div className="flex items-start gap-4">
        <div className="size-[50px] rounded-full bg-primary-300 shrink-0 overflow-hidden">
          <img src="/Airoo-circle.png" alt="루" className="size-full object-cover scale-x-[-1]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="bg-white rounded-2xl rounded-bl-none px-5 py-5 shadow-sm max-w-[440px]">
            <p className="text-lg font-medium text-gray-700 whitespace-pre-line leading-4">{msg.text}</p>
          </div>
          <p className="text-sm text-gray-400">{msg.time}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-row-reverse items-start">
      <div className="flex flex-col items-end gap-1.5">
        <div className="bg-primary-300 rounded-2xl rounded-br-none px-5 py-5 shadow-sm max-w-[440px]">
          <p className="text-lg font-medium text-gray-700 whitespace-pre-line leading-4">{msg.text}</p>
        </div>
        <p className="text-sm text-gray-400">{msg.time}</p>
      </div>
    </div>
  );
}

function TalkTab({ msgs, input, setInput, onSend, onKey, bottomRef }) {
  return (
    <>
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-10 py-6 flex flex-col gap-4 overflow-y-auto">
        {msgs.map((msg, i) => <AiMessage key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-gray-50/90 backdrop-blur-sm pb-5 pt-2">
        <div className="max-w-[1200px] mx-auto px-10 flex flex-col gap-4">
          <div className="flex gap-6 overflow-x-auto">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => onSend(chip)}
                className="flex items-center h-[44px] px-5 py-2.5 bg-primary-100 border border-primary-500 rounded-2xl text-sm font-bold text-gray-700 hover:bg-primary-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex-1 bg-white border-4 border-primary-500 rounded-3xl h-[80px] flex items-center px-8 gap-3 shadow-sm">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[28px] text-gray-700 shrink-0" />
              <input
                className="flex-1 text-[21px] text-gray-700 placeholder:text-gray-300 outline-none bg-transparent font-medium"
                placeholder="루에게 물어봐!"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
              />
            </div>
            <button
              onClick={() => onSend(input)}
              className="size-[80px] bg-primary-500 rounded-3xl flex items-center justify-center shrink-0 hover:bg-primary-400 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faCircleUp} className="text-[32px] text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── 퀴즈 탭 ─────────────────────────────────────────────── */

function ChoiceGrid({ options, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={twMerge(
            "flex items-center gap-5 h-[88px] pl-6 pr-1 py-1 rounded-3xl border-2 bg-white transition-colors cursor-pointer text-left",
            selected === i
              ? "border-primary-500 bg-primary-100"
              : "border-gray-100 hover:border-gray-300"
          )}
        >
          <span className="text-2xl font-extrabold text-primary-500 shrink-0 w-8 text-center">
            {i + 1}
          </span>
          <span className="text-2xl font-extrabold text-gray-700">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function QuizSection({ title, cardBg, cardBorder, icon, question, options, selected, onSelect }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-4xl font-extrabold text-[#44433f]">{title}</h2>

      {/* 질문 카드 */}
      <div className={twMerge(
        "w-full rounded-3xl border-2 flex flex-col items-center justify-center gap-3.5 py-8 px-2",
        cardBg, cardBorder
      )}>
        <FontAwesomeIcon icon={icon} className="text-[32px] text-gray-700" />
        <p className="text-2xl font-bold text-gray-700 text-center">{question}</p>
      </div>

      {/* 보기 */}
      <ChoiceGrid options={options} selected={selected} onSelect={onSelect} />
    </section>
  );
}

function QuizTab() {
  const [quizSel, setQuizSel]       = useState(null);
  const [missionSel, setMissionSel] = useState(null);

  return (
    <div className="flex-1 max-w-[1200px] w-full mx-auto px-10 py-10 flex flex-col gap-10">
      <QuizSection
        title="오늘의 퀴즈"
        cardBg="bg-blue-100"
        cardBorder="border-blue-200"
        icon={QUIZ_DATA.icon}
        question={QUIZ_DATA.question}
        options={QUIZ_DATA.options}
        selected={quizSel}
        onSelect={setQuizSel}
      />

      <QuizSection
        title="루와의 미션"
        cardBg="bg-primary-100"
        cardBorder="border-primary-400"
        icon={MISSION_DATA.icon}
        question={MISSION_DATA.question}
        options={MISSION_DATA.options}
        selected={missionSel}
        onSelect={setMissionSel}
      />
    </div>
  );
}

/* ── 메인 페이지 ─────────────────────────────────────────── */

export default function AironPage() {
  const [tab, setTab]     = useState('talk');
  const [input, setInput] = useState('');
  const [msgs, setMsgs]   = useState([
    { from: 'ai', text: '안녕 나는 루야!\n궁금한 콘텐츠나 추천이 필요하면 뭐든 물어봐줘!', time: '오전 10:41' },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  function now() {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  function send(text) {
    const msg = text.trim();
    if (!msg) return;
    setMsgs(prev => [...prev, { from: 'user', text: msg, time: now() }]);
    setInput('');
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav activeTab="airon" />
      <AiHero tab={tab} setTab={setTab} />

      {tab === 'talk' ? (
        <TalkTab
          msgs={msgs}
          input={input}
          setInput={setInput}
          onSend={send}
          onKey={onKey}
          bottomRef={bottomRef}
        />
      ) : (
        <QuizTab />
      )}

      <Footer />
    </div>
  );
}
