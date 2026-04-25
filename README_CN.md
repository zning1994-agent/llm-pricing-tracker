# LLM 定价追踪器

一个简洁的实时 Web 仪表板，整合了主要 LLM 模型的定价数据、基准测试分数和功能对比，包括 GPT-5.5、DeepSeek V4、Claude Code 和 Gemini。

## 功能特性

- **价格对比**：比较主要 LLM 提供商的代币定价（输入/输出）
- **基准测试图表**：可视化条形图对比 MMLU、HumanEval、MATH 和 MGSM 分数
- **能力矩阵**：功能对比网格，展示上下文长度、多模态、工具使用、视觉和流式传输支持
- **响应式设计**：针对桌面和移动端观看进行了优化
- **手动刷新**：一键按需更新数据

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 基于组件的 UI 框架 |
| TypeScript | 5.x | 类型安全开发 |
| Vite | 5.x | 快速构建工具和开发服务器 |
| Tailwind CSS | 3.x | 实用优先的样式设计 |
| Recharts | 2.x | 可组合的图表库 |

## 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/llm-pricing-tracker.git
cd llm-pricing-tracker

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:5173` 可用

## 使用方法

### App 组件与 Context

```tsx
import App from './App';

function MyApp() {
  return <App />;
}
```

### PricingTable 组件

```tsx
import { PricingTable } from './components/PricingTable';
import type { Model } from './types';

function PricingSection() {
  const handleSelect = (model: Model) => {
    console.log('选中的模型:', model.name);
  };

  return (
    <PricingTable 
      onSelectModel={handleSelect}
      title="代币定价"
    />
  );
}
```

### BenchmarkChart 组件

```tsx
import { BenchmarkChart } from './components/BenchmarkChart';
import type { Model } from './types';

function ChartsSection() {
  const handleSelect = (model: Model) => {
    console.log('选中的模型:', model.name);
  };

  return (
    <BenchmarkChart 
      onSelectModel={handleSelect}
      title="基准测试对比"
    />
  );
}
```

### CapabilityMatrix 组件

```tsx
import { CapabilityMatrix } from './components/CapabilityMatrix';
import type { Model } from './types';

function FeaturesSection() {
  const handleSelect = (model: Model) => {
    console.log('选中的模型:', model.name);
  };

  return (
    <CapabilityMatrix 
      onSelectModel={handleSelect}
      title="能力对比"
    />
  );
}
```

## 组件 API

### PricingTable

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data` | `Model[]` | models 数组 | 模型数据数组 |
| `onSelectModel` | `(model: Model) => void` | - | 选择模型时的回调 |
| `title` | `string` | "Token Pricing" | 区块标题 |

### BenchmarkChart

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data` | `Model[]` | models 数组 | 模型数据数组 |
| `onSelectModel` | `(model: Model) => void` | - | 选择模型时的回调 |
| `title` | `string` | "Benchmark Comparison" | 区块标题 |

### CapabilityMatrix

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data` | `Model[]` | models 数组 | 模型数据数组 |
| `onSelectModel` | `(model: Model) => void` | - | 选择模型时的回调 |
| `title` | `string` | "Capability Comparison" | 区块标题 |

## 模型数据结构

```typescript
interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: {
    input: number;  // 每百万代币的价格
    output: number; // 每百万代币的价格
  };
  benchmarks: {
    mmlu: number;      // 百分比 0-100
    humanEval: number; // 百分比 0-100
    math: number;      // 百分比 0-100
    mgsm: number;      // 百分比 0-100
  };
  capabilities: {
    contextLength: number;
    multimodal: boolean;
    toolUse: boolean;
    vision: boolean;
    streaming: boolean;
  };
}
```

## 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint |

## 项目结构

```
llm-pricing-tracker/
├── src/
│   ├── components/        # React 组件
│   │   ├── BenchmarkChart.tsx
│   │   ├── CapabilityMatrix.tsx
│   │   ├── Header.tsx
│   │   ├── LastUpdated.tsx
│   │   ├── PricingTable.tsx
│   │   └── RefreshButton.tsx
│   ├── data/
│   │   └── models.ts      # 静态模型数据
│   ├── types/
│   │   └── index.ts       # TypeScript 接口
│   ├── App.tsx            # 根组件
│   ├── App.css            # 全局样式
│   └── main.tsx           # 入口点
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 演示

![LLM 定价追踪器演示](demo.html)

仪表板显示：
- 输入和输出的 $/M 代币代币定价
- MMLU（知识）、HumanEval（代码）、MATH（数学）和 MGSM（多语言）的基准测试分数
- 能力功能包括上下文窗口大小、多模态支持、工具使用、视觉和流式传输

## 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 资源

- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)
- [Vite 文档](https://vitejs.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Recharts 文档](https://recharts.org)
