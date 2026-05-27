import { Beaker, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  mode: 'visualization' | 'comparison'
  onModeChange: (mode: 'visualization' | 'comparison') => void
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Beaker size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Visualizador de Algoritmos de Ordenação
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Laboratório Educacional Interativo com Pokémon
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onModeChange('visualization')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm',
                mode === 'visualization'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-card/80 text-foreground border border-border'
              )}
            >
              <Beaker size={16} />
              Visualização
            </button>
            <button
              onClick={() => onModeChange('comparison')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm',
                mode === 'comparison'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-card/80 text-foreground border border-border'
              )}
            >
              <BarChart3 size={16} />
              Comparação
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
