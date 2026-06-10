import { useState, useMemo, useEffect } from 'react'
import { Search, Trophy, AlertCircle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { Pokemon, SortField, SearchAlgorithm } from '@/types'
import { useSearch } from '@/hooks/useSearch'
import { linearSearch, binarySearch, getComparisonGrowthData } from '@/algorithms/search'
import { searchAlgorithmInfo } from '@/utils/searchInfo'
import { SearchVisualization } from '@/components/SearchVisualization'
import { ControlPanel } from '@/components/ControlPanel'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { NarrationPanel } from '@/components/NarrationPanel'

interface SearchModeProps {
  pokemon: Pokemon[]
  field: SortField
  onFieldChange: (field: SortField) => void
}

const fieldLabel: Record<SortField, string> = {
  weight: 'Peso',
  height: 'Altura',
  base_experience: 'Exp. Base',
}

// Verifica se o array está ordenado pela chave
function isSortedByField(array: Pokemon[], field: SortField): boolean {
  for (let i = 1; i < array.length; i++) {
    if (array[i - 1][field] > array[i][field]) return false
  }
  return true
}

export function SearchMode({ pokemon, field, onFieldChange }: SearchModeProps) {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('linear')
  const [searchTerm, setSearchTerm] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [perfResult, setPerfResult] = useState<{
    linear: { comparisons: number; time: number }
    binary: { comparisons: number; time: number }
    target: number
  } | null>(null)

  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    speed,
    elapsedTime,
    hasSearched,
    setSpeed,
    runSearch,
    play,
    pause,
    step,
    reset,
  } = useSearch()

  const sortedPokemon = useMemo(() => {
    return [...pokemon].sort((a, b) => a[field] - b[field])
  }, [pokemon, field])

  const isSorted = useMemo(() => isSortedByField(sortedPokemon, field), [sortedPokemon, field])

  // Para busca linear usamos a ordem original; para binária, ordenada
  const activeArray = algorithm === 'binary' ? sortedPokemon : pokemon

  // Busca binária requer dados ordenados (sempre verdadeiro aqui pois ordenamos),
  // mas mantemos a checagem didática
  const binaryDisabled = !isSorted

  // Busca parcial por substring
  const partialResults = useMemo(() => {
    const texto = searchTerm.trim().toLowerCase()
    if (!texto) return []
    return pokemon.filter((p) => p.name.toLowerCase().includes(texto))
  }, [pokemon, searchTerm])

  const handleSearch = () => {
    const target = parseInt(targetValue, 10)
    if (isNaN(target)) return
    runSearch(activeArray, algorithm, target, field)
  }

  const handleReset = () => {
    reset()
  }

  // Comparação de desempenho: roda ambas as buscas para o mesmo alvo
  const handlePerformanceComparison = () => {
    const target = parseInt(targetValue, 10)
    if (isNaN(target)) return

    const t1 = performance.now()
    const linearSteps = linearSearch(pokemon, target, field)
    const t2 = performance.now()
    const binarySteps = binarySearch(sortedPokemon, target, field)
    const t3 = performance.now()

    const linearComparisons = linearSteps[linearSteps.length - 1]?.comparisons || 0
    const binaryComparisons = binarySteps[binarySteps.length - 1]?.comparisons || 0

    setPerfResult({
      linear: { comparisons: linearComparisons, time: t2 - t1 },
      binary: { comparisons: binaryComparisons, time: t3 - t2 },
      target,
    })
  }

  // Reseta a animação quando muda o algoritmo
  useEffect(() => {
    reset()
  }, [algorithm, field, reset])

  const info = searchAlgorithmInfo[algorithm]
  const growthData = useMemo(() => getComparisonGrowthData(), [])

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Buscar Pokémon</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Algorithm selection */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Algoritmo de Busca</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAlgorithm('linear')}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                  algorithm === 'linear'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-card/80 text-foreground border border-border'
                )}
              >
                Busca Linear
              </button>
              <div className="flex-1 relative group">
                <button
                  onClick={() => !binaryDisabled && setAlgorithm('binary')}
                  disabled={binaryDisabled}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                    algorithm === 'binary'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground border border-border',
                    binaryDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Busca Binária
                </button>
                {binaryDisabled && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 z-10">
                    <div className="bg-popover border border-border rounded-lg p-2 text-xs text-foreground shadow-xl">
                      A busca binária exige que a lista esteja previamente ordenada.
                    </div>
                  </div>
                )}
              </div>
            </div>
            {algorithm === 'binary' && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle size={12} />
                Lista ordenada automaticamente por {fieldLabel[field]} para a busca binária.
              </p>
            )}
          </div>

          {/* Field selection */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Campo de Busca</label>
            <div className="flex gap-2">
              {(Object.keys(fieldLabel) as SortField[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onFieldChange(f)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium',
                    field === f
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground border border-border'
                  )}
                >
                  {fieldLabel[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Value input + search button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-muted-foreground">
              Valor de {fieldLabel[field]} a procurar
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={`Ex: ${activeArray[0]?.[field] ?? 100}`}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={!targetValue}
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
            <button
              onClick={handlePerformanceComparison}
              disabled={!targetValue}
              className="px-6 py-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comparar
            </button>
          </div>
        </div>

        {/* Quick value hint - clickable values */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Valores existentes:</span>
          {activeArray.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setTargetValue(String(p[field]))}
              className="px-2 py-1 rounded bg-card border border-border text-xs text-foreground hover:bg-primary/20 transition-colors"
            >
              {p[field]}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization + side panels */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ControlPanel
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStep={step}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
              disabled={totalSteps === 0}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
            />
            <SearchMetrics
              comparisons={currentStep?.comparisons || 0}
              elapsedTime={elapsedTime}
              currentIndex={
                algorithm === 'linear' ? currentStep?.current ?? -1 : currentStep?.middle ?? -1
              }
              found={currentStep?.found ?? -1}
            />
          </div>

          <div className="lg:col-span-9 space-y-4">
            <SearchVisualization step={currentStep} field={field} algorithm={algorithm} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <NarrationPanel narration={currentStep?.narration || ''} />
              </div>
              <PseudocodePanel
                pseudocode={info.pseudocode}
                currentLine={currentStep?.pseudocodeLine ?? -1}
              />
            </div>
          </div>
        </div>
      )}

      {/* Partial search */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Busca Parcial (por nome)</h2>
        <p className="text-sm text-muted-foreground">
          Digite parte do nome para filtrar os Pokémon usando{' '}
          <code className="text-primary">includes()</code>.
        </p>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ex: char"
          className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchTerm.trim() && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {partialResults.length} resultado(s) encontrado(s):
            </p>
            <div className="flex flex-wrap gap-2">
              {partialResults.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border"
                >
                  <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p[field]} {fieldLabel[field]}
                    </p>
                  </div>
                </div>
              ))}
              {partialResults.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum Pokémon encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Performance comparison */}
      {perfResult && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Comparação de Desempenho</h2>
          <p className="text-sm text-muted-foreground">
            Resultado da busca pelo valor <span className="text-primary font-semibold">{perfResult.target}</span> ({fieldLabel[field]}) usando ambos os algoritmos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerfCard
              title="Busca Linear"
              comparisons={perfResult.linear.comparisons}
              time={perfResult.linear.time}
              isWinner={perfResult.linear.comparisons <= perfResult.binary.comparisons}
            />
            <PerfCard
              title="Busca Binária"
              comparisons={perfResult.binary.comparisons}
              time={perfResult.binary.time}
              isWinner={perfResult.binary.comparisons < perfResult.linear.comparisons}
            />
          </div>
          <div className="bg-card/50 rounded-lg p-4 border border-border/30">
            <p className="text-sm text-foreground">
              A busca binária usou{' '}
              <span className="text-sorted font-semibold">
                {perfResult.linear.comparisons - perfResult.binary.comparisons} comparações a menos
              </span>{' '}
              que a linear, demonstrando sua eficiência em listas ordenadas.
            </p>
          </div>
        </div>
      )}

      {/* Growth chart */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Crescimento de Comparações: Linear vs Binária
        </h2>
        <p className="text-sm text-muted-foreground">
          Número de comparações conforme o tamanho da amostra cresce. Note como a busca binária
          cresce de forma logarítmica enquanto a linear cresce linearmente.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.3)" />
            <XAxis
              dataKey="size"
              stroke="#9ca3af"
              label={{ value: 'Tamanho da amostra', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(75,85,99,0.5)',
                borderRadius: '0.5rem',
                color: '#e5e7eb',
              }}
            />
            <Legend />
            <Bar dataKey="linear" name="Busca Linear" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="binary" name="Busca Binária" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="py-2 px-3 text-muted-foreground">Tamanho</th>
                <th className="py-2 px-3 text-swapping">Linear</th>
                <th className="py-2 px-3 text-sorted">Binária</th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((row) => (
                <tr key={row.size} className="border-b border-border/30">
                  <td className="py-2 px-3 text-foreground">{row.size}</td>
                  <td className="py-2 px-3 text-foreground">{row.linear}</td>
                  <td className="py-2 px-3 text-foreground">{row.binary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PerfCard({
  title,
  comparisons,
  time,
  isWinner,
}: {
  title: string
  comparisons: number
  time: number
  isWinner: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 border-2 transition-all',
        isWinner ? 'bg-sorted/10 border-sorted' : 'bg-card/50 border-border/30'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {isWinner && <Trophy size={18} className="text-sorted" />}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Comparações</span>
          <span className="text-lg font-bold text-comparing">{comparisons}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Tempo</span>
          <span className="text-lg font-bold text-primary">{time.toFixed(4)}ms</span>
        </div>
      </div>
    </div>
  )
}

function SearchMetrics({
  comparisons,
  elapsedTime,
  currentIndex,
  found,
}: {
  comparisons: number
  elapsedTime: number
  currentIndex: number
  found: number
}) {
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Métricas em Tempo Real</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <span className="text-xs text-muted-foreground block mb-1">Comparações</span>
          <p className="text-lg font-bold text-comparing">{comparisons}</p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <span className="text-xs text-muted-foreground block mb-1">Tempo</span>
          <p className="text-lg font-bold text-primary">{formatTime(elapsedTime)}</p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <span className="text-xs text-muted-foreground block mb-1">Índice atual</span>
          <p className="text-lg font-bold text-foreground">
            {currentIndex >= 0 ? currentIndex : '—'}
          </p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
          <span className="text-xs text-muted-foreground block mb-1">Encontrado</span>
          <p className={cn('text-lg font-bold', found >= 0 ? 'text-sorted' : 'text-muted-foreground')}>
            {found >= 0 ? `Pos. ${found}` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
