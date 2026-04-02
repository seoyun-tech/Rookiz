const imgRoo = "https://www.figma.com/api/mcp/asset/26ca67df-ae9d-4329-9bb0-6f60119172bf";
const imgBubble = "https://www.figma.com/api/mcp/asset/bf258461-767a-487a-8b48-2a86b53c51f9";

/**
 * AiRoo — 고정 플로팅 AI 루 채팅 버튼
 */
export function AiRoo({ onClick }) {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-20 md:right-20 flex items-center gap-2 z-[100]">

      {/* 말풍선 */}
      <div className="relative hidden sm:block">
        <img
          src={imgBubble}
          className="w-[160px] md:w-[216px]"
          alt="bubble"
        />
        <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-base md:text-xl font-semibold mb-2">
          루에게 물어보세요!
        </span>
      </div>

      {/* 루 버튼 */}
      <div
        onClick={onClick}
        className="size-16 md:size-[95px] bg-primary-300 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform overflow-hidden"
      >
        <img
          src={imgRoo}
          className="w-[80px] md:w-[125px] h-auto object-contain translate-y-2 md:translate-y-4"
          alt="AI 루"
        />
      </div>

    </div>
  );
}
