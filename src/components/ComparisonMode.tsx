import { useState, useEffect, useRef, useCallback } from 'react'
import type { Pokemon, SortField, AlgorithmName, SortStep } from '@/types'
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort } from '@/algorithms'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Play, Loader2, RotateCcw, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonModeProps {
  pokemon: Pokemon[]
  field: SortField
}

interface AlgorithmState {
  id: AlgorithmName
  name: string
  steps: SortStep[]
  currentStepIndex: number
  isComplete: boolean
  comparisons: number
  swaps: number
  executionTime: number
  bestCase: string
  averageCase: string
  worstCase: string
}

const algorithmConfigs: { id: AlgorithmName; name: string; fn: typeof bubbleSort; best: string; avg: string; worst: string; color: string }[] = [
  { id: 'bubble', name: 'Bubble Sort', fn: bubbleSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', color: '#ef4444' },
  { id: 'selection', name: 'Selection Sort', fn: selectionSort, best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', color: '#f97316' },
  { id: 'insertion', name: 'Insertion Sort', fn: insertionSort, best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', color: '#eab308' },
  { id: 'merge', name: 'Merge Sort', fn: mergeSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', color: '#22c55e' },
  { id: 'quick', name: 'Quick Sort', fn: quickSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', color: '#3b82f6' },
  { id: 'heap', name: 'Heap Sort', fn: heapSort, best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', color: '#8b5cf6' }
]

function MiniBar({ value, maxValue, state }: { value: number; maxValue: number; state: 'normal' | 'comparing' | 'swapping' | 'sorted' }) {
  const height = maxValue > 0 ? (value / maxValue) * 100 : 0
  const colorMap = {
    normal: 'bg-primary/70',
    comparing: 'bg-comparing',
    swapping: 'bg-swapping',
    sorted: 'bg-sorted'
  }
  return (
    <div
      className={cn('flex-1 rounded-t transition-all duration-150', colorMap[state])}
      style={{ height: `${Math.max(height, 3)}%` }}
    />
  )
}

function AlgorithmRaceCard({ state, maxValue, field, isWinner }: { 
  state: AlgorithmState
  maxValue: number
  field: SortField
  isWinner: boolean
}) {
  const currentStep = state.steps[state.currentStepIndex]
  const array = currentStep?.array || []
  const config = algorithmConfigs.find(c => c.id === state.id)

  const getBarState = (index: number): 'normal' | 'comparing' | 'swapping' | 'sorted' => {
    if (!currentStep) return 'normal'
    if (currentStep.sorted.includes(index)) return 'sorted'
    if (currentStep.swapping.includes(index)) return 'swapping'
    if (currentStep.comparing.includes(index)) return 'comparing'
    return 'normal'
  }

  return (
    <div className={cn(
      'glass rounded-lg p-3 transition-all duration-300',
      state.isComplete && 'border-sorted/50',
      isWinner && 'ring-2 ring-sorted shadow-[0_0_20px_rgba(34,197,94,0.3)]'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.color }} />
          <span className="text-sm font-medium text-foreground">{state.name}</span>
          {isWinner && <Trophy size={14} className="text-sorted" />}
        </div>
        {state.isComplete && (
          <span className="text-xs text-sorted font-medium">Concluido</span>
        )}
      </div>

      {/* Mini visualization */}
      <div className="flex items-end gap-px h-16 mb-2 bg-background/30 rounded p-1">
        {array.map((pokemon, index) => (
          <MiniBar
            key={`${state.id}-${index}`}
            value={pokemon[field]}
            maxValue={maxValue}
            state={getBarState(index)}
          />
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <span className="text-muted-foreground block">Comp.</span>
          <span className="text-comparing font-mono">{currentStep?.comparisons || 0}</span>
        </div>
        <div className="text-center">
          <span className="text-muted-foreground block">Trocas</span>
          <span className="text-swapping font-mono">{currentStep?.swaps || 0}</span>
        </div>
        <div className="text-center">
          <span className="text-muted-foreground block">Passo</span>
          <span className="text-foreground font-mono">{state.currentStepIndex + 1}/{state.steps.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 bg-background/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${((state.currentStepIndex + 1) / state.steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

export function ComparisonMode({ pokemon, field }: ComparisonModeProps) {
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmState[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [winner, setWinner] = useState<AlgorithmName | null>(null)
  const [speed, setSpeed] = useState(50)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const maxValue = Math.max(...pokemon.map(p => p[field]), 1)

  // Initialize algorithm states
  const initializeStates = useCallback(() => {
    if (pokemon.length === 0) return []
    
    return algorithmConfigs.map(config => {
      const dataCopy = [...pokemon]
      const startTime = performance.now()
      const steps = config.fn(dataCopy, field)
      const endTime = performance.now()
      
      return {
        id: config.id,
        name: config.name,
        steps,
        currentStepIndex: 0,
        isComplete: false,
        comparisons: 0,
        swaps: 0,
        executionTime: Math.round((endTime - startTime) * 100) / 100,
        bestCase: config.best,
        averageCase: config.avg,
        worstCase: config.worst
      }
    })
  }, [pokemon, field])

  useEffect(() => {
    const states = initializeStates()
    setAlgorithmStates(states)
    setHasStarted(false)
    setIsComplete(false)
    setWinner(null)
  }, [initializeStates])

  const startRace = () => {
    if (algorithmStates.length === 0) return
    
    setIsRunning(true)
    setHasStarted(true)
    setIsComplete(false)
    setWinner(null)

    // Reset all to step 0
    setAlgorithmStates(prev => prev.map(state => ({
      ...state,
      currentStepIndex: 0,
      isComplete: false
    })))
  }

  const resetRace = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    setIsRunning(false)
    setHasStarted(false)
    setIsComplete(false)
    setWinner(null)
    const states = initializeStates()
    setAlgorithmStates(states)
  }

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      setAlgorithmStates(prev => {
        let allComplete = true
        let firstToFinish: AlgorithmName | null = winner

        const updated = prev.map(state => {
          if (state.isComplete) return state
          
          if (state.currentStepIndex < state.steps.length - 1) {
            allComplete = false
            return {
              ...state,
              currentStepIndex: state.currentStepIndex + 1
            }
          } else if (!state.isComplete) {
            // Just finished
            if (!firstToFinish) {
              firstToFinish = state.id
            }
            return {
              ...state,
              isComplete: true
            }
          }
          return state
        })

        if (firstToFinish && !winner) {
          setWinner(firstToFinish)
        }

        if (allComplete) {
          setIsRunning(false)
          setIsComplete(true)
        }

        return updated
      })
    }

    animationRef.current = setTimeout(animate, Math.max(10, 200 - speed * 2))

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isRunning, algorithmStates, speed, winner])

  // Final results for charts
  const chartData = algorithmStates.map(state => {
    const lastStep = state.steps[state.steps.length - 1]
    return {
      name: state.name.replace(' Sort', ''),
      Comparacoes: lastStep?.comparisons || 0,
      Trocas: lastStep?.swaps || 0,
      'Tempo (ms)': state.executionTime
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Corrida de Algoritmos</h2>
          <p className="text-sm text-muted-foreground">
            Visualize todos os algoritmos ordenando simultaneamente
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Velocidade:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-primary"
              disabled={isRunning}
            />
          </div>
          <button
            onClick={resetRace}
            disabled={!hasStarted}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
              'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>
          <button
            onClick={startRace}
            disabled={isRunning || pokemon.length === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
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
                Iniciar Corrida
              </>
            )}
          </button>
        </div>
      </div>

      {pokemon.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            Carregue os Pokemon primeiro para comparar os algoritmos
          </p>
        </div>
      ) : (
        <>
          {/* Race Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {algorithmStates.map(state => (
              <AlgorithmRaceCard
                key={state.id}
                state={state}
                maxValue={maxValue}
                field={field}
                isWinner={winner === state.id}
              />
            ))}
          </div>

          {/* Results after completion */}
          {isComplete && (
            <>
              {/* Winner announcement */}
              <div className="glass rounded-xl p-6 text-center border border-sorted/30">
                <Trophy size={48} className="mx-auto text-sorted mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Vencedor: {algorithmStates.find(s => s.id === winner)?.name}
                </h3>
                <p className="text-muted-foreground">
                  Primeiro algoritmo a completar a ordenacao!
                </p>
              </div>

              {/* Results Table */}
              <div className="glass rounded-xl p-4 overflow-x-auto">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tabela de Resultados</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Algoritmo</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Comparacoes</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Trocas</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Passos</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Tempo (ms)</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Melhor</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Medio</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Pior</th>
                    </tr>
                  </thead>
                  <tbody>
                    {algorithmStates.map((state, index) => {
                      const lastStep = state.steps[state.steps.length - 1]
                      const config = algorithmConfigs.find(c => c.id === state.id)
                      return (
                        <tr key={state.id} className={cn(
                          'border-b border-border/50 transition-colors',
                          index % 2 === 0 ? 'bg-card/30' : 'bg-card/10',
                          winner === state.id && 'bg-sorted/10'
                        )}>
                          <td className="py-3 px-4 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config?.color }} />
                              {state.name}
                              {winner === state.id && <Trophy size={14} className="text-sorted" />}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-comparing font-mono">{lastStep?.comparisons || 0}</td>
                          <td className="py-3 px-4 text-right text-swapping font-mono">{lastStep?.swaps || 0}</td>
                          <td className="py-3 px-4 text-right text-foreground font-mono">{state.steps.length}</td>
                          <td className="py-3 px-4 text-right text-primary font-mono">{state.executionTime}</td>
                          <td className="py-3 px-4 text-center text-sorted font-mono text-xs">{state.bestCase}</td>
                          <td className="py-3 px-4 text-center text-comparing font-mono text-xs">{state.averageCase}</td>
                          <td className="py-3 px-4 text-center text-swapping font-mono text-xs">{state.worstCase}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Comparacoes e Trocas</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: '1px solid rgba(75, 85, 99, 0.5)',
                            borderRadius: '8px',
                            color: '#e5e7eb'
                          }}
                        />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="Comparacoes" fill="#eab308" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Trocas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Tempo de Execucao</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
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
              </div>

              {/* Analysis */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Analise</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-card/50 rounded-lg p-4 border border-border/30">
                    <span className="text-muted-foreground block mb-1">Menos comparacoes</span>
                    <span className="text-foreground font-medium">
                      {algorithmStates.reduce((min, s) => {
                        const comp = s.steps[s.steps.length - 1]?.comparisons || 0
                        const minComp = min.steps[min.steps.length - 1]?.comparisons || 0
                        return comp < minComp ? s : min
                      }).name}
                    </span>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4 border border-border/30">
                    <span className="text-muted-foreground block mb-1">Menos trocas</span>
                    <span className="text-foreground font-medium">
                      {algorithmStates.reduce((min, s) => {
                        const swaps = s.steps[s.steps.length - 1]?.swaps || 0
                        const minSwaps = min.steps[min.steps.length - 1]?.swaps || 0
                        return swaps < minSwaps ? s : min
                      }).name}
                    </span>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4 border border-border/30">
                    <span className="text-muted-foreground block mb-1">Mais rapido</span>
                    <span className="text-foreground font-medium">
                      {algorithmStates.reduce((min, s) => s.executionTime < min.executionTime ? s : min).name}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Com {pokemon.length} elementos, os algoritmos O(n log n) como Merge Sort, Quick Sort e Heap Sort 
                  tendem a ser mais eficientes que os algoritmos O(n²) como Bubble Sort, Selection Sort e Insertion Sort.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
