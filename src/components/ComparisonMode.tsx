import { useState, useEffect } from 'react'
import type { Pokemon, SortField, AlgorithmName } from '@/types'
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort } from '@/algorithms'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Play, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonModeProps {
  pokemon: Pokemon[]
  field: SortField
}

interface AlgorithmResult {
  name: string
  comparisons: number
  swaps: number
  executionTime: number
  bestCase: string
  averageCase: string
  worstCase: string
}

const algorithms: { id: AlgorithmName; name: string; fn: typeof bubbleSort; best: string; avg: string; worst: string }[] = [
  { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
  { id: 'selection', name: 'Selection Sort', fn: selectionSort, best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
  { id: 'insertion', name: 'Insertion Sort', fn: insertionSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
  { id: 'merge', name: 'Merge Sort', fn: mergeSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
  { id: 'quick', name: 'Quick Sort', fn: quickSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
  { id: 'heap', name: 'Heap Sort', fn: heapSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }
]

export function ComparisonMode({ pokemon, field }: ComparisonModeProps) {
  const [results, setResults] = useState<AlgorithmResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    setHasRun(false)
    setResults([])
  }, [pokemon, field])

  const runComparison = async () => {
    if (pokemon.length === 0) return
    
    setIsRunning(true)
    setResults([])

    // Run each algorithm and collect results
    const newResults: AlgorithmResult[] = []

    for (const algo of algorithms) {
      const dataCopy = [...pokemon]
      const startTime = performance.now()
      const steps = algo.fn(dataCopy, field)
      const endTime = performance.now()

      const lastStep = steps[steps.length - 1]
      
      newResults.push({
        name: algo.name,
        comparisons: lastStep.comparisons,
        swaps: lastStep.swaps,
        executionTime: Math.round((endTime - startTime) * 100) / 100,
        bestCase: algo.best,
        averageCase: algo.avg,
        worstCase: algo.worst
      })

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100))
      setResults([...newResults])
    }

    setIsRunning(false)
    setHasRun(true)
  }

  const chartData = results.map(r => ({
    name: r.name.replace(' Sort', ''),
    Comparações: r.comparisons,
    Trocas: r.swaps,
    'Tempo (ms)': r.executionTime
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Modo de Comparação</h2>
        <button
          onClick={runComparison}
          disabled={isRunning || pokemon.length === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
            'bg-primary hover:bg-primary/80 text-primary-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isRunning ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play size={18} />
              Executar Todos
            </>
          )}
        </button>
      </div>

      {pokemon.length === 0 && (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            Carregue os Pokémon primeiro para comparar os algoritmos
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          {/* Results Table */}
          <div className="glass rounded-xl p-4 overflow-x-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tabela de Resultados</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Algoritmo</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Comparações</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Trocas</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Tempo (ms)</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Melhor</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Médio</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Pior</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.name} className={cn(
                    'border-b border-border/50 transition-colors',
                    index % 2 === 0 ? 'bg-card/30' : 'bg-card/10'
                  )}>
                    <td className="py-3 px-4 font-medium text-foreground">{result.name}</td>
                    <td className="py-3 px-4 text-right text-comparing font-mono">{result.comparisons}</td>
                    <td className="py-3 px-4 text-right text-swapping font-mono">{result.swaps}</td>
                    <td className="py-3 px-4 text-right text-primary font-mono">{result.executionTime}</td>
                    <td className="py-3 px-4 text-center text-sorted font-mono text-xs">{result.bestCase}</td>
                    <td className="py-3 px-4 text-center text-comparing font-mono text-xs">{result.averageCase}</td>
                    <td className="py-3 px-4 text-center text-swapping font-mono text-xs">{result.worstCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparison Chart */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gráfico Comparativo - Operações</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '8px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af' }} />
                  <Bar dataKey="Comparações" fill="#eab308" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Trocas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Chart */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gráfico Comparativo - Tempo de Execução</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '8px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af' }} />
                  <Bar dataKey="Tempo (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis */}
          {hasRun && results.length === algorithms.length && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Análise</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Menos comparações:</strong>{' '}
                  {results.reduce((min, r) => r.comparisons < min.comparisons ? r : min).name} ({results.reduce((min, r) => r.comparisons < min.comparisons ? r : min).comparisons})
                </p>
                <p>
                  <strong className="text-foreground">Menos trocas:</strong>{' '}
                  {results.reduce((min, r) => r.swaps < min.swaps ? r : min).name} ({results.reduce((min, r) => r.swaps < min.swaps ? r : min).swaps})
                </p>
                <p>
                  <strong className="text-foreground">Mais rápido:</strong>{' '}
                  {results.reduce((min, r) => r.executionTime < min.executionTime ? r : min).name} ({results.reduce((min, r) => r.executionTime < min.executionTime ? r : min).executionTime}ms)
                </p>
                <p className="pt-2 border-t border-border/50">
                  Com {pokemon.length} elementos, os algoritmos O(n log n) como Merge Sort, Quick Sort e Heap Sort 
                  tendem a ser mais eficientes que os algoritmos O(n²) como Bubble Sort, Selection Sort e Insertion Sort.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
