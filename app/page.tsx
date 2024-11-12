import NovelCard from "@/components/ui/NovelCard/NovelCard";
import { getNovels } from "@/utils/supabase/queries";
import { createClient } from '@/utils/supabase/server';

// 定义小说数据类型
interface Novel {
  id: string;
  cover: string;
  title: string;
  author: string;
  description: string;
  likes: number;
}

export default async function HomePage() {
  const supabase = createClient();
  const novels: Novel[] = await getNovels(supabase) || [];
  return (
    <div className="flex flex-col min-h-screen py-2">
      <header className="w-full px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
        NoverShort Stories
        </h1>
        <p className="text-xl text-center text-default-600 mb-8">
        Discover your favorite story, Enjoy Quality Reading Anytime, Anywhere
        </p>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6">
        {/* 小说网格 - 修改移动端为2列 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {novels.map((novel) => (
            <NovelCard
              key={novel.id}
              {...novel}
            />
          ))}
        </div>
      </main>
    </div>
  );
}