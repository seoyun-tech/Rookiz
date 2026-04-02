import { useState } from 'react';
import { Nav } from '../components/common/Nav';
import { Footer } from '../components/common/Footer';
import { ContentRow } from '../components/common/ContentRow';
import { Card } from '../components/common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faStar, faShield, faChartLine, faAward,
  faLeaf, faClock, faTriangleExclamation, faCalendarDays, faPencil
} from '@fortawesome/free-solid-svg-icons';

export default function MyPage() {
  // 10개 스티커: true = 획득(노란색), false = 미획득(회색)
  const [stickers, setStickers] = useState(
    Array(10).fill(false).map((_, i) => i < 4)
  );

  function toggleSticker(idx) {
    setStickers(prev => prev.map((v, i) => (i === idx ? !v : v)));
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav activeTab="mypage" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-10 py-20 flex flex-col gap-20">
        
        {/* Profile Section */}
        <section
          className="relative rounded-3xl border-b border-gray-100 p-10 overflow-hidden bg-linear-[168deg] from-white to-primary-100"
        >
          <div className="flex flex-col gap-5 items-center">

            {/* 프로필 아이콘 + 키즈 칩 */}
            <div className="flex gap-5 items-center">
              <div className="size-20 bg-white rounded-[27px] shadow-md flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 hover:shadow-lg">
                <FontAwesomeIcon icon={faUser} className="text-primary-400 text-3xl" />
              </div>
              <div className="flex items-center gap-2 bg-green-200 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-green-300 hover:scale-105">
                <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-sm" />
                <span className="text-green-600 font-bold text-sm whitespace-nowrap">키즈 4~7세</span>
              </div>
            </div>

            {/* 통계 카드 3개 */}
            <div className="flex gap-4 items-center">
              <div className="bg-white border border-gray-100 rounded-3xl px-5 py-4 flex gap-2.5 items-center h-[71px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <FontAwesomeIcon icon={faClock} className="text-primary-400 text-[28px] shrink-0 transition-transform duration-300 group-hover:rotate-12" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-gray-700">오늘 시청 시간</span>
                  <span className="text-xl font-bold text-gray-700 font-poppins">1h 30m</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl px-5 py-4 flex gap-2.5 items-center h-[71px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-secondary-500 text-[28px] shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-gray-700">접근 제한 영상</span>
                  <span className="text-xl font-bold text-gray-700 font-poppins">10개</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl px-5 py-4 flex gap-2.5 items-center h-[71px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500 text-[28px] shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-gray-700">연속시청</span>
                  <span className="text-xl font-bold text-gray-700 font-poppins">7일차</span>
                </div>
              </div>
            </div>

          </div>

          {/* 프로필 수정 버튼 (우상단 절대 위치) */}
          <button className="absolute top-10 right-10 flex items-center gap-2 text-gray-500 font-bold transition-all duration-300 hover:text-gray-800 hover:gap-3">
            <FontAwesomeIcon icon={faPencil} className="text-base transition-transform duration-300 hover:rotate-12" />
            <span className="text-base">프로필 수정</span>
          </button>
        </section>

        {/* 칭찬 하루 Section */}
        <section className="flex flex-col gap-7">
          <h2 className="text-4xl font-extrabold text-gray-800">칭찬 하루</h2>
          <div className="flex flex-wrap gap-x-[50px] gap-y-[46px]">
            {stickers.map((active, i) => (
              <button
                key={i}
                onClick={() => toggleSticker(i)}
                className={`w-[200px] h-[100px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300
                  ${active
                    ? 'bg-primary-100 border-primary-400 hover:scale-105 hover:shadow-md'
                    : 'bg-white border-gray-300 hover:scale-105 hover:border-primary-300'
                  }`}
              >
                <FontAwesomeIcon
                  icon={faAward}
                  className={`text-3xl transition-all duration-300 ${active ? 'text-primary-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Content Rows */}
        <ContentRow title="최근에 봤어요">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card 
                key={i}
                size="sm"
                title={`이어보기 콘텐츠 ${i}`}
                image={`https://picsum.photos/seed/recent${i}/400/400`}
              />
            ))}
          </div>
        </ContentRow>

      </main>

      <Footer />
    </div>
  );
}
