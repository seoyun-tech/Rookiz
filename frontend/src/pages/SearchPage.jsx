import { Nav } from '../components/common/Nav';
import { Footer } from '../components/common/Footer';
import { Searchbar } from '../components/common/Searchbar';
import { ContentRow } from '../components/common/ContentRow';
import { Card } from '../components/common/Card';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav activeTab="main" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10 py-10 md:py-20 flex flex-col gap-10 md:gap-16">
        {/* Search Header */}
        <div className="flex flex-col gap-6 md:gap-10 items-center text-center">
          <h1 className="text-3xl md:text-[48px] font-black text-gray-800">무엇을 찾아드릴까요?</h1>
          <Searchbar className="w-full max-w-[1000px]" />
        </div>

        {/* Popular Tags or Recent Searches could go here */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg md:text-[20px] font-bold text-gray-400">인기 검색어</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {['#공룡', '#우주', '#파닉스', '#동화', '#창의력', '#안전교육'].map(tag => (
              <button key={tag} className="px-4 py-2 md:px-5 md:py-2.5 bg-gray-50 rounded-full text-sm md:text-base text-gray-600 font-bold hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <ContentRow title="'공룡' 검색 결과 (12)" showViewAll={false}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card 
                key={i}
                size="md"
                title={`공룡 대백과 ${i}`}
                image={`https://picsum.photos/seed/dino${i}/400/300`}
                className="aspect-[4/3]"
              />
            ))}
          </div>
        </ContentRow>
      </main>

      <Footer />
    </div>
  );
}
