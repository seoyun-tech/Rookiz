import { twMerge } from 'tailwind-merge';
import { Header } from './Header';
import { Card } from './Card';

/**
 * ContentRow — 섹션 타이틀 + 카드 리스트
 *
 * items 배열: [{ id, title, image, size }]
 * items 없이 children만 넣어도 동작
 */
export function ContentRow({ title, items, showViewAll = true, viewAllLink = '#', className, children }) {
  return (
    <div className={twMerge('w-full flex flex-col gap-7', className)}>

      <Header title={title} showViewAll={showViewAll} viewAllLink={viewAllLink} />

      {items ? (
        <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-2 w-full max-w-[1200px] scrollbar-hide">
          {items.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              title={item.title}
              size={item.size || 'sm'}
            />
          ))}
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}

    </div>
  );
}
