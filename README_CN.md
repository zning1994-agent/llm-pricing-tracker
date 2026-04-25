# LLM 定价追踪器 (LLM Pricing Tracker)

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

一款实时 Web 仪表板，用于比较主流 LLM 模型（GIT 5.5、DeepSeek V4、Claude Code、Gemini）的定价、性能基准和功能特性。

[English](README.md) | 中文

---

## 项目简介

### 问题背景

LLM 市场正在快速发展，OpenAI、Anthropic、Google 和 DeepSeek 等提供商各自推出了不同的定价策略、性能基准和功能集。开发者、企业和研究人员目前缺乏一个统一、可访问的仪表板来实时比较这些模型。价格变动频繁，从多个来源追踪信息的认知开销造成了决策困难。

### 解决方案

一个简洁、实时的 Web 仪表板，将主流 LLM 模型的定价数据、基准分数和功能比较整合到一个视图中，帮助用户做出明智的 AI 采纳决策。

### 目标用户

- 将 LLM 集成到应用程序中的软件开发人员
- 评估 AI 业务用例成本的产品经理
- 优化 AI 基础设施预算的初创公司
- 比较模型功能的研究人员

---

## 功能特性

### 核心功能

- **定价比较表**：展示 GPT-5.5、DeepSeek V4、Claude Code、Gemini 的输入/输出 token 价格
- **基准测试图表**：使用柱状图直观比较 MMLU、HumanEval、MATH、MGSM 等基准分数
- **功能特性矩阵**：展示上下文长度、多模态支持、工具调用等特性对比
- **手动数据刷新**：支持手动更新和刷新数据
- **响应式设计**：适配桌面端和移动端浏览

### 技术亮点

- 🔷 **TypeScript 5.x**：类型安全，提升开发体验
- ⚛️ **React 18**：组件化架构，高效渲染
- ⚡ **Vite 5**：极速开发服务器，优化生产构建
- 🎨 **Tailwind CSS 3**：快速 UI 开发，原子化样式
- 📊 **Recharts 2**：React 原生图表库，支持组合图表
- 💎 **Lucide React**：一致的图标风格，Tree-shakable 设计

---

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本（或使用 pnpm/yarn）

### 安装步骤

```bash
# 1. 克隆项目仓库
git clone https://github.com/your-username/llm-pricing-tracker.git

# 2. 进入项目目录
cd llm-pricing-tracker

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

开发服务器启动后，打开浏览器访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
# 构建优化后的生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 使用说明

### 组件概览

项目包含以下核心组件：

| 组件 | 文件路径 | 功能描述 |
|------|----------|----------|
| Header | `src/components/Header.tsx` | 应用头部，包含标题和刷新按钮 |
| PricingTable | `src/components/PricingTable.tsx` | Token 定价比较表格 |
| BenchmarkChart | `src/components/BenchmarkChart.tsx` | 基准测试分数柱状图 |
| CapabilityMatrix | `src/components/CapabilityMatrix.tsx` | 功能特性对比网格 |
| LastUpdated | `src/components/LastUpdated.tsx` | 数据更新状态指示器 |
| RefreshButton | `src/components/RefreshButton.tsx` | 手动刷新按钮组件 |

### 数据结构

模型数据定义在 `src/data/models.ts` 文件中，包含：

```typescript
// 模型基本信息
interface LLMModel {
  id: string;              // 模型唯一标识
  name: string;            // 模型名称
  provider: string;        // 提供商（OpenAI, Anthropic 等）
  inputPrice: number;      // 输入价格（$/M tokens）
  outputPrice: number;     // 输出价格（$/M tokens）
  contextLength: number;    // 上下文窗口长度
  multimodal: boolean;      // 是否支持多模态
  benchmarks: {
    mmlu: number;           // MMLU 基准分数
    humaneval: number;      // HumanEval 基准分数
    math: number;           // MATH 基准分数
    mgsm: number;           // MGSM 基准分数
  };
}
```

### 使用示例

#### 1. 在 React 组件中使用定价表格

```tsx
import { PricingTable } from './components';
import { models } from './data/models';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LLM 定价比较</h1>
      <PricingTable models={models} />
    </div>
  );
}
```

#### 2. 自定义基准测试图表

```tsx
import { BenchmarkChart } from './components';

function BenchmarkSection({ models }) {
  return (
    <div className="w-full h-96">
      <BenchmarkChart 
        data={models} 
        dataKey="humaneval"
        title="HumanEval 基准测试"
      />
    </div>
  );
}
```

#### 3. 查看功能特性矩阵

```tsx
import { CapabilityMatrix } from './components';

function Features() {
  return (
    <CapabilityMatrix 
      models={models}
      features={['multimodal', 'toolUse', 'vision']}
    />
  );
}
```

---

## 项目结构

```
llm-pricing-tracker/
├── public/
│   └── favicon.svg              # 网站图标
├── src/
│   ├── components/              # React 组件目录
│   │   ├── Header.tsx           # 头部导航组件
│   │   ├── PricingTable.tsx     # 定价比较表格
│   │   ├── BenchmarkChart.tsx   # 基准测试图表
│   │   ├── CapabilityMatrix.tsx  # 功能特性矩阵
│   │   ├── LastUpdated.tsx      # 数据更新时间
│   │   └── index.ts             # 组件导出入口
│   ├── data/
│   │   └── models.ts            # 模型静态数据
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   ├── utils/
│   │   └── formatters.ts        # 格式化工具函数
│   ├── App.tsx                  # 根组件
│   ├── App.css                  # 全局样式
│   ├── index.css                # Tailwind 入口样式
│   └── main.tsx                 # 应用入口文件
├── index.html                   # HTML 模板
├── package.json                 # 项目依赖配置
├── tsconfig.json                # TypeScript 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── postcss.config.js            # PostCSS 配置
├── vite.config.ts               # Vite 构建配置
└── README.md                    # 英文文档
```

---

## 技术栈详情

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| **编程语言** | TypeScript 5.x | 提供类型安全检查和更好的开发体验 |
| **前端框架** | React 18 | 组件化开发模式，支持 hooks 和并发特性 |
| **构建工具** | Vite 5 | 快速的开发服务器启动和热模块替换 |
| **样式框架** | Tailwind CSS 3 | 原子化 CSS，支持自定义主题配置 |
| **图表库** | Recharts 2 | 基于 React 的组合式图表库 |
| **状态管理** | React Context + useReducer | 轻量级状态管理，无需额外依赖 |
| **图标库** | Lucide React | 简洁一致的 SVG 图标，支持按需加载 |

---

## 配置说明

### 环境变量

项目支持以下环境变量配置：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础地址（预留） | `/api` |

### Tailwind CSS 配置

在 `tailwind.config.js` 中可以自定义主题颜色：

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
};
```

### TypeScript 配置

项目使用严格的 TypeScript 配置，确保代码质量：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 开发指南

### 添加新模型

1. 在 `src/data/models.ts` 中添加模型数据：

```typescript
export const models: LLMModel[] = [
  // 现有模型...
  {
    id: 'new-model',
    name: 'New Model',
    provider: 'Provider Name',
    inputPrice: 0.5,
    outputPrice: 1.5,
    contextLength: 128000,
    multimodal: true,
    benchmarks: {
      mmlu: 88.5,
      humaneval: 85.2,
      math: 72.3,
      mgsm: 68.9,
    },
  },
];
```

2. 组件将自动更新以显示新模型数据。

### 添加新基准测试

1. 更新类型定义 `src/types/index.ts`：

```typescript
interface BenchmarkScores {
  mmlu: number;
  humaneval: number;
  math: number;
  mgsm: number;
  newBenchmark: number; // 添加新基准
}
```

2. 在 `src/data/models.ts` 中添加新基准的分数。

3. 在 `BenchmarkChart.tsx` 中添加对新基准的支持。

### 自定义样式

项目使用 Tailwind CSS，所有样式都可以通过修改 JSX 元素的 className 属性来调整：

```tsx
// 自定义表格样式
<PricingTable 
  models={models} 
  className="rounded-lg shadow-lg" 
/>

// 自定义图表颜色
<BenchmarkChart 
  data={models}
  barColor="#10B981"
/>
```

---

## 在线演示

项目提供了一个交互式演示页面 `demo.html`，展示了所有组件的效果。

**主要演示功能：**

1. **定价比较表**：展示不同 LLM 模型的输入/输出 token 价格
2. **基准测试图表**：MMLU、HumanEval、MATH、MGSM 分数对比
3. **功能特性矩阵**：上下文长度、多模态、工具使用等特性对比
4. **响应式布局**：支持桌面端和移动端显示

打开 `demo.html` 文件即可在浏览器中查看演示效果。

---

## 性能优化

项目采用了以下性能优化策略：

- **Tree-shaking**：只导入使用的组件和图标
- **Code Splitting**：Vite 自动进行代码分割
- **懒加载**：组件按需加载
- **高效渲染**：React 18 并发特性

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

请使用以下 commit 格式：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式调整（不影响功能）
- `refactor:` - 代码重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建或辅助工具变动

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 许可证

本项目基于 MIT 许可证开源。

---

## 致谢

- [React](https://reactjs.org/) - 优秀的 UI 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Recharts](https://recharts.org/) - React 图表库
- [Lucide](https://lucide.dev/) - 精美的图标库

---

*最后更新：2026年4月*
