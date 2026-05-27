import { cn } from '@/lib/utils'
import type { Pokemon, SortField, SortStep } from '@/types'

interface VisualizationAreaProps {
  step: SortStep | null
  field: SortField
  maxValue: number
}

function getStateColor(index: number, step: SortStep | null): string {
  if (!step) return 'bg-normal'
  if (step.sorted.includes(index)) return 'bg-sorted'
  if (step.swapping.includes(index)) return 'bg-swapping'
  if (step.comparing.includes(index)) return 'bg-comparing'
  return 'bg-normal'
}

function getStateGlow(index: number, step: SortStep | null): string {
  if (!step) return ''
  if (step.sorted.includes(index)) return 'shadow-[0_0_20px_rgba(34,197,94,0.5)]'
  if (step.swapping.includes(index)) return 'shadow-[0_0_20px_rgba(239,68,68,0.5)]'
  if (step.comparing.includes(index)) return 'shadow-[0_0_20px_rgba(234,179,8,0.5)]'
  return ''
}

export function VisualizationArea({ step, field, maxValue }: VisualizationAreaProps) {
  const array = step?.array || []

  const getValue = (pokemon: Pokemon): number => {
    return pokemon[field]
  }

  const fieldLabel: Record<SortField, string> = {
    weight: 'Peso',
    height: 'Altura',
    base_experience: 'Exp. Base'
  }

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Visualização</h2>
      
      {/* Bars */}
      <div className="flex items-end justify-center gap-1 h-64 px-4">
        {array.map((pokemon, index) => {
          const value = getValue(pokemon)
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0
          const stateColor = getStateColor(index, step)
          const glow = getStateGlow(index, step)
          
          return (
            <div
              key={`bar-${pokemon.id}-${index}`}
              className="flex flex-col items-center flex-1 max-w-16"
            >
              <div
                className={cn(
                  'w-full rounded-t-lg transition-all duration-300 ease-out',
                  stateColor,
                  glow
                )}
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
              />
            </div>
          )
        })}
      </div>

      {/* Pokemon Cards */}
      <div className="flex justify-center gap-1 overflow-x-auto pb-2">
        {array.map((pokemon, index) => {
          const stateColor = getStateColor(index, step)
          const borderColor = stateColor.replace('bg-', 'border-')
          
          return (
            <div
              key={`card-${pokemon.id}-${index}`}
              className={cn(
                'flex-shrink-0 flex flex-col items-center p-2 rounded-lg transition-all duration-300',
                'bg-card/50 border-2',
                borderColor
              )}
              style={{ minWidth: '60px', maxWidth: '80px' }}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
              <span className="text-xs font-medium text-foreground truncate w-full text-center">
                {pokemon.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {getValue(pokemon)} {fieldLabel[field]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-normal" />
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-comparing" />
          <span className="text-muted-foreground">Comparando</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-swapping" />
          <span className="text-muted-foreground">Trocando</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-sorted" />
          <span className="text-muted-foreground">Ordenado</span>
        </div>
      </div>
    </div>
  )
}
