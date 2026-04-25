# LLM Pricing Tracker

A clean, real-time web dashboard that consolidates pricing data, benchmark scores, and capability comparisons for major LLM models including GPT-5.5, DeepSeek V4, Claude Code, and Gemini.

## Features

- **Pricing Comparison**: Compare token pricing (input/output) across major LLM providers
- **Benchmark Charts**: Visual bar charts comparing MMLU, HumanEval, MATH, and MGSM scores
- **Capability Matrix**: Feature comparison grid showing context length, multimodal, tool use, vision, and streaming support
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Manual Refresh**: Update data on-demand with a single click

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | Component-based UI framework |
| TypeScript | 5.x | Type-safe development |
| Vite | 5.x | Fast build tool and dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 2.x | Composable charting library |

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/llm-pricing-tracker.git
cd llm-pricing-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### App Component with Context

```tsx
import App from './App';

function MyApp() {
  return <App />;
}
```

### PricingTable Component

```tsx
import { PricingTable } from './components/PricingTable';
import type { Model } from './types';

function PricingSection() {
  const handleSelect = (model: Model) => {
    console.log('Selected model:', model.name);
  };

  return (
    <PricingTable 
      onSelectModel={handleSelect}
      title="Token Pricing"
    />
  );
}
```

### BenchmarkChart Component

```tsx
import { BenchmarkChart } from './components/BenchmarkChart';
import type { Model } from './types';

function ChartsSection() {
  const handleSelect = (model: Model) => {
    console.log('Selected model:', model.name);
  };

  return (
    <BenchmarkChart 
      onSelectModel={handleSelect}
      title="Benchmark Comparison"
    />
  );
}
```

### CapabilityMatrix Component

```tsx
import { CapabilityMatrix } from './components/CapabilityMatrix';
import type { Model } from './types';

function FeaturesSection() {
  const handleSelect = (model: Model) => {
    console.log('Selected model:', model.name);
  };

  return (
    <CapabilityMatrix 
      onSelectModel={handleSelect}
      title="Capability Comparison"
    />
  );
}
```

## Component API

### PricingTable

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Model[]` | models array | Array of model data |
| `onSelectModel` | `(model: Model) => void` | - | Callback when model is selected |
| `title` | `string` | "Token Pricing" | Section title |

### BenchmarkChart

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Model[]` | models array | Array of model data |
| `onSelectModel` | `(model: Model) => void` | - | Callback when model is selected |
| `title` | `string` | "Benchmark Comparison" | Section title |

### CapabilityMatrix

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Model[]` | models array | Array of model data |
| `onSelectModel` | `(model: Model) => void` | - | Callback when model is selected |
| `title` | `string` | "Capability Comparison" | Section title |

## Model Data Structure

```typescript
interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: {
    input: number;  // price per 1M tokens
    output: number;  // price per 1M tokens
  };
  benchmarks: {
    mmlu: number;      // percentage 0-100
    humanEval: number; // percentage 0-100
    math: number;      // percentage 0-100
    mgsm: number;      // percentage 0-100
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

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
llm-pricing-tracker/
├── src/
│   ├── components/        # React components
│   │   ├── BenchmarkChart.tsx
│   │   ├── CapabilityMatrix.tsx
│   │   ├── Header.tsx
│   │   ├── LastUpdated.tsx
│   │   ├── PricingTable.tsx
│   │   └── RefreshButton.tsx
│   ├── data/
│   │   └── models.ts      # Static model data
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   ├── App.tsx            # Root component
│   ├── App.css            # Global styles
│   └── main.tsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Demo

![LLM Pricing Tracker Demo](demo.html)

The dashboard displays:
- Token pricing in $/M tokens for input and output
- Benchmark scores across MMLU (knowledge), HumanEval (code), MATH (math), and MGSM (multilingual)
- Capability features including context window size, multimodal support, tool use, vision, and streaming

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Recharts Documentation](https://recharts.org)
