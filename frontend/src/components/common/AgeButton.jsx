import { twMerge } from 'tailwind-merge';

// Figma Asset URLs for AgeButton
const AGE_ASSETS = {
  kid: "https://www.figma.com/api/mcp/asset/7991193f-734e-4c07-92b7-30e7a15a17f3",
  junior: "https://www.figma.com/api/mcp/asset/84d2be04-acef-44ce-a153-0d0476824b60"
};

/**
 * Age Selection Button
 */
export function AgeButton({ label, active = false, onClick, className }) {
  const isKid = label.includes('키즈');
  
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex items-center justify-center gap-[6px] md:gap-[8px] h-[48px] md:h-[60px] px-[16px] md:px-[22px] py-[10px] md:py-[16px] rounded-full border-[2px] transition-all duration-200 cursor-pointer shadow-sm font-sans shrink-0',
        active 
          ? 'bg-green-100 border-green-600 text-gray-700 font-bold' 
          : 'bg-gray-50 border-gray-300 text-gray-300 hover:bg-white',
        className
      )}
    >
      <img 
        src={isKid ? AGE_ASSETS.kid : AGE_ASSETS.junior} 
        className="size-[18px] md:size-[24px]" 
        alt="icon" 
      />
      <span className="text-sm md:text-xl whitespace-nowrap">{label}</span>
    </button>
  );
}
