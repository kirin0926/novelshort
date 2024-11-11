import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { getNovelDetail } from "@/utils/supabase/queries";
import { createClient } from '@/utils/supabase/server';

export default async function NovelPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const novel = await getNovelDetail(supabase, params.id);

  if (!novel) {
    return <div>小说不存在或已被删除</div>;
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* 顶部信息区域 */}
      <div className="w-full bg-white py-12 hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* 封面图 */}
              <div className="w-[200px] md:w-[240px] shrink-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    alt={novel.title}
                    className="object-cover rounded-xl shadow-xl"
                    src={novel.cover}
                    removeWrapper
                    classNames={{
                      img: "w-full h-full object-cover rounded-xl"
                    }}
                  />
                </div>
              </div>

              {/* 信息区 */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">{novel.title}</h1>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <p className="text-xl text-default-600">作者：{novel.author}</p>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="text-danger" />
                    <span className="text-default-600">{novel.likes}</span>
                  </div>
                </div>
                <p className="text-lg text-default-600 leading-relaxed max-w-2xl">
                  {novel.description}
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button 
                    color="primary" 
                    size="lg"
                    className="font-medium"
                  >
                    加入书架
                  </Button>
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium"
                    startContent={<HeartIcon className="text-danger" />}
                  >
                    喜欢
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 正文内容区域 */}
      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg">
          <div className="prose prose-lg prose-slate mx-auto">
            {novel.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="my-4 leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 