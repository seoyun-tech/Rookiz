import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse, faHeart, faCircleUser, faMagnifyingGlass,
  faBell, faLeaf, faChevronDown, faUser
} from '@fortawesome/free-solid-svg-icons';

function NavButton({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex flex-col items-center justify-center w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-2xl md:rounded-3xl transition-all duration-200 cursor-pointer gap-1',
        active ? 'bg-primary-500' : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        className={twMerge(
          'text-[22px] md:text-[26px]',
          active ? 'text-primary-950' : 'text-gray-300'
        )}
      />
      <span className={twMerge(
        'text-[10px] md:text-xs font-semibold leading-tight',
        active ? 'text-primary-950' : 'text-gray-300'
      )}>
        {label}
      </span>
    </button>
  );
}

function NavProfile({ name = "최승아", zone = "키즈존 4~7세" }) {
  return (
    <button className="flex items-center h-[44px] w-fit md:w-[150px] bg-gray-50 rounded-full px-2.5 gap-2 hover:bg-gray-100 transition-colors cursor-pointer border-none outline-none">
      <div className="size-6 bg-primary-200 rounded-full flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={faUser} className="text-[14px] text-primary-700" />
      </div>
      <div className="hidden md:flex flex-col items-start leading-tight overflow-hidden text-left">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{name}</span>
          <FontAwesomeIcon icon={faLeaf} className="text-[14px] text-green-500" />
        </div>
        <span className="text-[12px] font-bold text-green-600 whitespace-nowrap">{zone}</span>
      </div>
      <div className="ml-auto hidden md:block">
        <FontAwesomeIcon icon={faChevronDown} className="text-[14px] text-gray-400" />
      </div>
    </button>
  );
}

export function Nav({ activeTab = "main" }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full h-[80px] md:h-[120px] bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center px-4 md:px-10">
      <div className="w-full max-w-[1200px] grid grid-cols-3 items-center">

        {/* Left: Logo */}
        <div
          className="flex items-center select-none cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/LOGO.svg" alt="ROOKIZ" className="h-8 md:h-16 w-auto" />
        </div>

        {/* Center: Nav Buttons */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <NavButton
            icon={faHouse}
            label="메인"
            active={activeTab === "main"}
            onClick={() => navigate('/')}
          />
          <NavButton
            icon={faHeart}
            label="내 친구 루"
            active={activeTab === "airon"}
            onClick={() => navigate('/airon')}
          />
          <NavButton
            icon={faCircleUser}
            label="마이 페이지"
            active={activeTab === "mypage"}
            onClick={() => navigate('/mypage')}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1">
          <button
            className="size-[38px] bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/search')}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[18px] text-gray-400" />
          </button>
          <button className="size-[38px] bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative">
            <FontAwesomeIcon icon={faBell} className="text-[18px] text-gray-400" />
            <div className="absolute top-[9px] right-[9px] size-2 bg-secondary-400 rounded-full" />
          </button>
          <div className="ml-1">
            <NavProfile />
          </div>
        </div>

      </div>
    </nav>
  );
}
