import { Timer, GitCompare, ArrowLeftRight, Cpu } from 'lucide-react'

interface MetricsPanelProps {
  comparisons: number
  swaps: number
  elapsedTime: number
  algorithm: string
}

export function MetricsPanel({ comparisons, swaps, elapsedTime, algorithm }: MetricsPanelProps) {
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const algorithmNames: Record<string, string> = {
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    merge: 'Merge Sort',
    quick: 'Quick Sort',
    heap: 'Heap Sort'
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Métricas em Tempo Real</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Cpu size={16} />
            <span className="text-xs">Algoritmo</span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {algorithmNames[algorithm] || algorithm}
          </p>
        </div>

        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Timer size={16} />
            <span className="text-xs">Tempo</span>
          </div>
          <p className="text-lg font-bold text-primary">
            {formatTime(elapsedTime)}
          </p>
        </div>

        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <GitCompare size={16} />
            <span className="text-xs">Comparações</span>
          </div>
          <p className="text-lg font-bold text-comparing">
            {comparisons}
          </p>
        </div>

        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ArrowLeftRight size={16} />
            <span className="text-xs">Trocas</span>
          </div>
          <p className="text-lg font-bold text-swapping">
            {swaps}
          </p>
        </div>
      </div>
    </div>
  )
}
