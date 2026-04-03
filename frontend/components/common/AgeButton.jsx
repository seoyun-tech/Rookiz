import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faTree } from '@fortawesome/free-solid-svg-icons';

export function AgeButton({ label, active = false, variant = 'kids', onClick, className }) {
  const isKid = label.includes('키즈');

  const activeStyle = variant === 'junior'
    ? 'bg-blue-100 border-blue-500 text-gray-700 font-bold shadow-sm'
    : 'bg-green-100 border-green-600 text-gray-700 font-bold';

  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex items-center justify-center gap-[6px] md:gap-[8px] h-[48px] md:h-[60px] px-[16px] md:px-[22px] py-[10px] md:py-[16px] rounded-full border-[2px] transition-all duration-200 cursor-pointer shadow-sm font-sans shrink-0',
        active ? activeStyle : 'bg-gray-50 border-gray-300 text-gray-300 hover:bg-white',
        className
      )}
    >
      <FontAwesomeIcon
        icon={isKid ? faLeaf : faTree}
        className="size-[14px] md:size-[18px]"
      />
      <span className="text-sm md:text-xl whitespace-nowrap">{label}</span>
    </button>
  );
}
