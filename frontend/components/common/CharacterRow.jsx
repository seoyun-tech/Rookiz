import { Header } from './Header';

export function CharacterRow({ children }) {
  return (
    <div className="w-full flex flex-col gap-7 px-4 md:px-10">
      <Header title="인기 있는 캐릭터" />
      <div className="flex gap-4 md:gap-10 overflow-x-auto pb-4 scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
