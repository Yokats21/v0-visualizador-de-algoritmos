import { Code } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PseudocodePanelProps {
  pseudocode: string[]
  currentLine: number
}

export function PseudocodePanel({ pseudocode, currentLine }: PseudocodePanelProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Code size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Pseudocódigo</h3>
      </div>
      <div className="bg-card/50 rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-y-auto max-h-64">
          {pseudocode.length > 0 ? (
            <pre className="p-3 text-xs leading-relaxed font-mono">
              {pseudocode.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    'px-2 py-0.5 rounded transition-all duration-200',
                    currentLine === index && 'bg-primary/30 text-primary-foreground border-l-2 border-primary'
                  )}
                >
                  <span className="text-muted-foreground mr-3 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={cn(
                    'text-foreground',
                    currentLine === index && 'font-semibold'
                  )}>
                    {line || ' '}
                  </span>
                </div>
              ))}
            </pre>
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">
              Selecione um algoritmo para ver o pseudocódigo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
