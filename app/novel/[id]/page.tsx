import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { HeartIcon } from "@/components/icons/HeartIcon";

// 模拟的小说详情数据
const getNovelDetail = (id: string) => ({
  id,
  cover: "https://picsum.photos/400/600",
  title: "星辰大海",
  author: "张三",
  description: "一个关于探索宇宙奥秘的故事，主人公在浩瀚的星空中寻找生命的意义。这是一个充满想象力和哲理的故事，带领读者探索未知的宇宙边界...",
  likes: 1234,
  content: `
    第一章 启程

    星空下，一艘银白色的飞船静静地停泊在太空港。这是"希望号"，一艘最新型的深空探索飞船，它将带领我们进行一次前所未有的星际之旅。

    李明站在观察甲板上，透过巨大的观察窗凝视着远方的星空。作为这次探索任务的首席科学家，他心中既激动又忐忑。三十年的准备，无数个日日夜夜的研究，终于要在今天展开新的篇章。

    "准备启程了，李教授。"副船长王华的声音从身后传来。

    李明深吸一口气，转身面对着自己的团队。二十名精英科学家，都是各自领域最顶尖的专家。他们的眼中闪烁着同样的光芒——对未知的渴望，对发现的期待。

    "是的，让我们开始吧。"李明微笑着说。

    飞船的引擎开始发出轻微的嗡鸣，这是超空间引擎预热的声音。通过多年的研究，人类终于突破了光速的限制，而"希望号"正是搭载着这项革命性技术的第一艘飞船。

    [正文继续...]
  `
});

export default function NovelPage({ params }: { params: { id: string } }) {
  const novel = getNovelDetail(params.id);

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* 顶部信息区域 */}
      <div className="w-full bg-white py-12">
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
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
          <div className="prose prose-lg prose-slate mx-auto">
            {novel.content.split('\n').map((paragraph, index) => (
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