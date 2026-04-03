const imgRoo = "/Airoo-circle.png";
const imgBubble = "/Airoo-talkbubble.png";

export function AiRooSticky({ onClick }) {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-20 md:right-20 flex items-center gap-2 z-[100]">
      <div className="relative hidden sm:block">
        <img
          src={imgBubble}
          className="w-[160px] md:w-[216px] md:translate-y-11 md:translate-x-7"
          alt="bubble"
        />
        <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-base md:text-xl font-semibold mb-2 md:translate-y-12 md:translate-x-7">
          루에게 물어보세요!
        </span>
      </div>
      <div
        onClick={onClick}
        className="size-16 md:size-[95px] bg-primary-300 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform overflow-hidden"
      >
        <img
          src={imgRoo}
          className="w-[80px] md:w-[125px] h-auto object-contain"
          alt="AI 루"
        />
      </div>
    </div>
  );
}
