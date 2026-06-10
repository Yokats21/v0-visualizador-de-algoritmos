import { cn } from '@/lib/utils'
import type { Pokemon, SortField, SearchStep, SearchAlgorithm } from '@/types'

interface SearchVisualizationProps {
  step: SearchStep | null
  field: SortField
  algorithm: SearchAlgorithm
}

const fieldLabel: Record<SortField, string> = {
  weight: 'Peso',
  height: 'Altura',
  base_experience: 'Exp. Base',
}

function getCardStyle(
  index: number,
  step: SearchStep | null,
  algorithm: SearchAlgorithm
): { bg: string; border: string; glow: string; opacity: string } {
  const normal = {
    bg: 'bg-card/50',
    border: 'border-border/50',
    glow: '',
    opacity: 'opacity-100',
  }
  if (!step) return normal

  // Encontrado - verde
  if (step.found === index) {
    return {
      bg: 'bg-sorted/30',
      border: 'border-sorted',
      glow: 'shadow-[0_0_24px_rgba(34,197,94,0.6)] scale-105',
      opacity: 'opacity-100',
    }
  }

  if (algorithm === 'linear') {
    // Atual sendo comparado - amarelo
    if (step.current === index) {
      return {
        bg: 'bg-comparing/30',
        border: 'border-comparing',
        glow: 'shadow-[0_0_24px_rgba(234,179,8,0.6)] scale-105',
        opacity: 'opacity-100',
      }
    }
    // Já verificado - cinza/azul apagado
    if (step.checked.includes(index)) {
      return {
        bg: 'bg-muted/30',
        border: 'border-muted',
        glow: '',
        opacity: 'opacity-50',
      }
    }
    return normal
  }

  // Binária
  // Região descartada
  if (step.discarded.includes(index)) {
    return {
      bg: 'bg-swapping/10',
      border: 'border-swapping/30',
      glow: '',
      opacity: 'opacity-30',
    }
  }
  // Meio - amarelo
  if (step.middle === index) {
    return {
      bg: 'bg-comparing/30',
      border: 'border-comparing',
      glow: 'shadow-[0_0_24px_rgba(234,179,8,0.6)] scale-105',
      opacity: 'opacity-100',
    }
  }
  // Início (left) - azul
  if (step.left === index) {
    return {
      bg: 'bg-normal/30',
      border: 'border-normal',
      glow: 'shadow-[0_0_18px_rgba(59,130,246,0.5)]',
      opacity: 'opacity-100',
    }
  }
  // Fim (right) - roxo/accent
  if (step.right === index) {
    return {
      bg: 'bg-accent/30',
      border: 'border-accent',
      glow: 'shadow-[0_0_18px_rgba(99,102,241,0.5)]',
      opacity: 'opacity-100',
    }
  }
  // Dentro do intervalo ativo
  if (step.left !== -1 && step.right !== -1 && index > step.left && index < step.right) {
    return { ...normal, bg: 'bg-card/70' }
  }
  return normal
}

export function SearchVisualization({ step, field, algorithm }: SearchVisualizationProps) {
  const array = step?.array || []

  const getValue = (pokemon: Pokemon): number => pokemon[field]

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Visualização da Busca</h2>

      {/* Pointer indicators for binary search */}
      {algorithm === 'binary' && step && step.left !== -1 && (
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-lg bg-normal/20 border border-normal text-foreground">
            Início (left): {step.left}
          </span>
          <span className="px-3 py-1 rounded-lg bg-comparing/20 border border-comparing text-foreground">
            Meio (middle): {step.middle !== -1 ? step.middle : '—'}
          </span>
          <span className="px-3 py-1 rounded-lg bg-accent/20 border border-accent text-foreground">
            Fim (right): {step.right}
          </span>
        </div>
      )}

      {/* Pokemon Cards Grid */}
      <div className="flex flex-wrap justify-center gap-2">
        {array.map((pokemon, index) => {
          const style = getCardStyle(index, step, algorithm)
          return (
            <div
              key={`search-card-${pokemon.id}-${index}`}
              className={cn(
                'flex-shrink-0 flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-300',
                style.bg,
                style.border,
                style.glow,
                style.opacity
              )}
              style={{ minWidth: '64px', maxWidth: '84px' }}
            >
              <span className="text-[10px] text-muted-foreground">#{index}</span>
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
        {algorithm === 'linear' ? (
          <>
            <LegendItem color="bg-comparing" label="Sendo comparado" />
            <LegendItem color="bg-sorted" label="Encontrado" />
            <LegendItem color="bg-muted" label="Já verificado" />
            <LegendItem color="bg-normal" label="Não visitado" />
          </>
        ) : (
          <>
            <LegendItem color="bg-normal" label="Início (left)" />
            <LegendItem color="bg-comparing" label="Meio (middle)" />
            <LegendItem color="bg-accent" label="Fim (right)" />
            <LegendItem color="bg-swapping/40" label="Descartado" />
            <LegendItem color="bg-sorted" label="Encontrado" />
          </>
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-4 h-4 rounded', color)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}
