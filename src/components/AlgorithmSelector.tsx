import type { AlgorithmName, SortField } from '@/types'
import { cn } from '@/lib/utils'

interface AlgorithmSelectorProps {
  selected: AlgorithmName
  onSelect: (algorithm: AlgorithmName) => void
  sortField: SortField
  onFieldChange: (field: SortField) => void
  sampleSize: number
  onSampleSizeChange: (size: number) => void
  disabled: boolean
}

const algorithms: { id: AlgorithmName; name: string; complexity: string }[] = [
  { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)' },
  { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)' },
  { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' },
  { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
  { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)' }
]

const sortFields: { id: SortField; name: string }[] = [
  { id: 'weight', name: 'Peso' },
  { id: 'height', name: 'Altura' },
  { id: 'base_experience', name: 'Experiência Base' }
]

const sampleSizes = [10, 25, 50]

export function AlgorithmSelector({
  selected,
  onSelect,
  sortField,
  onFieldChange,
  sampleSize,
  onSampleSizeChange,
  disabled
}: AlgorithmSelectorProps) {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      {/* Algorithm Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Algoritmo</h3>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              disabled={disabled}
              className={cn(
                'p-3 rounded-lg border transition-all duration-200 text-left',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selected === algo.id
                  ? 'bg-primary/20 border-primary text-primary-foreground'
                  : 'bg-card/50 border-border hover:border-primary/50 text-foreground'
              )}
            >
              <span className="block text-sm font-medium">{algo.name}</span>
              <span className="block text-xs text-muted-foreground">{algo.complexity}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Field Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Ordenar por</h3>
        <div className="flex gap-2">
          {sortFields.map((field) => (
            <button
              key={field.id}
              onClick={() => onFieldChange(field.id)}
              disabled={disabled}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border transition-all duration-200 text-sm',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sortField === field.id
                  ? 'bg-accent/20 border-accent text-accent-foreground'
                  : 'bg-card/50 border-border hover:border-accent/50 text-foreground'
              )}
            >
              {field.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Quantidade de Pokémon</h3>
        <div className="flex gap-2">
          {sampleSizes.map((size) => (
            <button
              key={size}
              onClick={() => onSampleSizeChange(size)}
              disabled={disabled}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border transition-all duration-200 text-sm',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sampleSize === size
                  ? 'bg-sorted/20 border-sorted text-sorted'
                  : 'bg-card/50 border-border hover:border-sorted/50 text-foreground'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
