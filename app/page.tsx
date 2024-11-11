import NovelCard from "@/components/ui/NovelCard/NovelCard";

// 模拟的小说数据
const novels = [
  {
    id: "1",
    cover: "https://picsum.photos/400/600", // 示例图片
    title: "星辰大海",
    author: "张三",
    description: "一个关于探索宇宙奥秘的故事，主人公在浩瀚的星空中寻找生命的意义...",
    likes: 1234
  },
  {
    id: "2",
    cover: "https://picsum.photos/400/601",
    title: "都市之巅",
    author: "李四",
    description: "都市生活中的起起落落，商场征战的故事，展现了现代人的生存状态...",
    likes: 856
  },
  {
    id: "3",
    cover: "https://picsum.photos/400/602",
    title: "都市之巅",
    author: "李四",
    description: "都市生活中的起起落落，商场征战的故事，展现了现代人的生存状态...",
    likes: 856
  },
  {
    id: "4",
    cover: "https://picsum.photos/400/603",
    title: "都市之巅",
    author: "李四",
    description: "都市生活中的起起落落，商场征战的故事，展现了现代人的生存状态...",
    likes: 856
  },
  {
    id: "5",
    cover: "https://picsum.photos/400/604",
    title: "都市之巅",
    author: "李四",
    description: "都市生活中的起起落落，商场征战的故事，展现了现代人的生存状态...",
    likes: 856
  },
  // 更多小说数据...
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen py-2">
      <header className="w-full px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          探索精彩小说
        </h1>
        <p className="text-xl text-center text-default-600 mb-8">
          发现你最爱的故事
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