我来帮你创建一个 README.md 文件，基于当前项目的 package.json 分析项目结构：

## 详细目录结构说明

### 主要目录
- `app/`: Next.js 13+ 的应用主目录
  - 包含页面路由和 API 路由
  - 使用 Next.js 的新 App Router 架构

- `components/`: React 组件目录
  - 存放可复用的 UI 组件
  - 遵循组件化开发原则

- `fixtures/`: 测试数据和配置文件
  - 包含 Stripe 支付相关的测试数据
  - 用于本地开发和测试环境

- `public/`: 静态资源目录
  - 存放图片、字体等静态文件
  - 可直接通过 URL 访问

- `styles/`: 样式文件目录
  - 全局样式定义
  - Tailwind CSS 配置

- `supabase/`: Supabase 相关配置
  - 数据库迁移文件
  - Supabase 功能配置

- `utils/`: 工具函数目录
  - 通用辅助函数
  - API 调用封装
  - 类型定义等

### 配置文件
- `.env.example` 和 `.env.local.example`: 环境变量模板
- `.gitignore`: Git 忽略文件配置
- `.prettierignore` 和 `.prettierrc.json`: Prettier 代码格式化配置
- `components.json`: UI 组件配置文件
- `LICENSE`: 项目许可证文件
- `middleware.ts`: Next.js 中间件配置
- `next-env.d.ts`: Next.js TypeScript 声明文件
- `package.json`: 项目依赖和脚本配置
- `pnpm-lock.yaml`: pnpm 包管理器锁定文件
- `postcss.config.js`: PostCSS 配置
- `README.md`: 项目说明文档
- `schema.sql`: 数据库结构定义
- `tailwind.config.js`: Tailwind CSS 配置
- `tsconfig.json`: TypeScript 配置
- `types_db.ts`: 数据库类型定义

### 特殊文件说明

1. **配置类文件**
   - `postcss.config.js`: 处理 CSS 的工具配置
   - `tailwind.config.js`: Tailwind CSS 的自定义配置
   - `tsconfig.json`: TypeScript 编译器配置

2. **类型定义文件**
   - `types_db.ts`: 数据库模型的 TypeScript 类型定义
   - `next-env.d.ts`: Next.js 环境的类型声明

3. **中间件文件**
   - `middleware.ts`: 处理路由认证、重定向等全局逻辑

4. **数据库相关**
   - `schema.sql`: 定义数据库表结构和关系
   - 包含用户、订阅、支付等相关表定义

### 开发规范

1. **目录组织原则**
   - 按功能模块划分目录
   - 保持目录结构清晰和扁平
   - 相关文件放在同一目录下

2. **文件命名规范**
   - 组件文件使用 PascalCase
   - 工具函数使用 camelCase
   - 配置文件使用 kebab-case

3. **代码组织建议**
   - 组件放在 components 目录
   - 页面放在 app 目录
   - 工具函数放在 utils 目录
   - API 路由放在 app/api 目录

这个项目结构遵循了现代 Next.js 应用的最佳实践，便于团队协作和代码维护。目录结构清晰，职责划分明确，有利于项目的长期发展。


————————————————————————————

我来帮你创建一个 README.md 文件，基于当前项目的 package.json 分析项目结构：

```markdown:README.md
# Subscription Starter 项目

这是一个基于 Next.js 的订阅系统启动项目，集成了 Stripe 支付和 Supabase 后端服务。

## 技术栈

- **前端框架**: Next.js 14
- **UI组件**: Radix UI
- **样式方案**: Tailwind CSS
- **支付系统**: Stripe
- **后端服务**: Supabase
- **开发语言**: TypeScript

## 项目结构

### 核心依赖

- `next`: Next.js 框架
- `@supabase/supabase-js`: Supabase 客户端
- `@stripe/stripe-js`: Stripe 支付集成
- `react` & `react-dom`: React 核心库

### UI 组件和样式

- `@radix-ui/react-toast`: Toast 通知组件
- `tailwindcss`: 原子化 CSS 框架
- `class-variance-authority`: 类名变体管理
- `lucide-react`: 图标库

## 开发脚本说明

### Next.js 相关
- `npm run dev`: 启动开发服务器（使用 Turbo 模式）
- `npm run build`: 构建项目
- `npm run start`: 启动生产服务器

### Stripe 相关
- `npm run stripe:login`: 登录 Stripe CLI
- `npm run stripe:listen`: 监听 Stripe webhook
- `npm run stripe:fixtures`: 加载 Stripe 测试数据

### Supabase 相关
- `npm run supabase:start`: 启动 Supabase 本地服务
- `npm run supabase:stop`: 停止 Supabase 服务
- `npm run supabase:status`: 查看 Supabase 服务状态
- `npm run supabase:generate-types`: 生成 TypeScript 类型定义
- `npm run supabase:push/pull`: 数据库迁移操作

## 代码规范

项目使用以下工具确保代码质量：
- ESLint: 代码质量检查
- Prettier: 代码格式化
- TypeScript: 类型检查

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 启动 Supabase 本地服务：
```bash
npm run supabase:start
```

4. 配置 Stripe（如需支付功能）：
```bash
npm run stripe:login
npm run stripe:listen
```

## 注意事项

- 确保在开发前正确配置 Supabase 和 Stripe 的环境变量
- 使用 TypeScript 进行开发，确保类型安全
- 遵循项目既定的代码规范和提交规范
```

这个 README.md 文件提供了项目的主要信息，包括：
1. 技术栈概览
2. 项目依赖说明
3. 开发脚本使用说明
4. 开发环境配置步骤
5. 代码规范说明

通过这个文档，新加入的开发者可以快速了解项目结构和开发流程。需要注意的是，这个项目主要围绕订阅系统展开，集成了 Stripe 支付和 Supabase 后端服务，是一个全栈应用项目。