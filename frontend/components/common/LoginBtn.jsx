import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

export function LoginBtn({ children = "시작하기", active = false, showArrow = false, onClick, className }) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={twMerge(
        "w-full h-14 rounded-2xl text-base font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-3",
        active
          ? "bg-primary-500 text-gray-950 hover:bg-primary-400"
          : "bg-gray-200 text-gray-400 cursor-not-allowed",
        className
      )}
    >
      {children}
      {showArrow && <FontAwesomeIcon icon={faCircleArrowRight} className="text-lg" />}
    </button>
  );
}
