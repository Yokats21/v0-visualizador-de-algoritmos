import { useState, useEffect, useMemo } from 'react'
import { Header } from '@/components/Header'
import type { AppMode } from '@/components/Header'
import { AlgorithmSelector } from '@/components/AlgorithmSelector'
import { ControlPanel } from '@/components/ControlPanel'
import { MetricsPanel } from '@/components/MetricsPanel'
import { VisualizationArea } from '@/components/VisualizationArea'
import { NarrationPanel } from '@/components/NarrationPanel'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { EducationalPanel } from '@/components/EducationalPanel'
import { HeapVisualization } from '@/components/HeapVisualization'
import { ComparisonMode } from '@/components/ComparisonMode'
import { SearchMode } from '@/components/SearchMode'
import { LoadingState } from '@/components/LoadingState'
import { usePokemon } from '@/hooks/usePokemon'
import { useSorting } from '@/hooks/useSorting'
import { algorithmInfo } from '@/utils/algorithmInfo'
import type { AlgorithmName, SortField } from '@/types'

export default function App() {
  const [mode, setMode] = useState<AppMode>('visualization')
  const [algorithm, setAlgorithm] = useState<AlgorithmName>('bubble')
  const [sortField, setSortField] = useState<SortField>('weight')
  const [sampleSize, setSampleSize] = useState(10)
  const [originalPokemon, setOriginalPokemon] = useState<typeof pokemon>([])

  const { pokemon, loading, error, fetchPokemon } = usePokemon()
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    speed,
    elapsedTime,
    setSpeed,
    generateSteps,
    play,
    pause,
    step,
    reset
  } = useSorting()

  // Load Pokemon on mount and when sample size changes
  useEffect(() => {
    fetchPokemon(sampleSize)
  }, [sampleSize, fetchPokemon])

  // Store original pokemon for reset
  useEffect(() => {
    if (pokemon.length > 0) {
      setOriginalPokemon([...pokemon])
    }
  }, [pokemon])

  // Generate steps when pokemon, algorithm, or field changes
  useEffect(() => {
    if (originalPokemon.length > 0) {
      generateSteps(originalPokemon, algorithm, sortField)
    }
  }, [originalPokemon, algorithm, sortField, generateSteps])

  const maxValue = useMemo(() => {
    if (!currentStep?.array) return 1
    return Math.max(...currentStep.array.map(p => p[sortField]))
  }, [currentStep?.array, sortField])

  const info = algorithmInfo[algorithm]

  const handleAlgorithmChange = (algo: AlgorithmName) => {
    setAlgorithm(algo)
    reset()
  }

  const handleFieldChange = (field: SortField) => {
    setSortField(field)
    reset()
  }

  const handleSampleSizeChange = (size: number) => {
    setSampleSize(size)
    reset()
  }

  const handleReset = () => {
    reset()
    if (originalPokemon.length > 0) {
      generateSteps(originalPokemon, algorithm, sortField)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header mode={mode} onModeChange={setMode} />

      <main className="container mx-auto px-4 py-6">
        {loading || error || pokemon.length === 0 ? (
          <LoadingState
            loading={loading}
            error={error}
            pokemon={pokemon}
            onLoad={fetchPokemon}
            sampleSize={sampleSize}
          />
        ) : mode === 'visualization' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-3 space-y-4">
              <AlgorithmSelector
                selected={algorithm}
                onSelect={handleAlgorithmChange}
                sortField={sortField}
                onFieldChange={handleFieldChange}
                sampleSize={sampleSize}
                onSampleSizeChange={handleSampleSizeChange}
                disabled={isPlaying}
              />
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
              <MetricsPanel
                comparisons={currentStep?.comparisons || 0}
                swaps={currentStep?.swaps || 0}
                elapsedTime={elapsedTime}
                algorithm={algorithm}
              />
            </div>

            {/* Main Content - Expanded Visualization */}
            <div className="lg:col-span-9 space-y-4">
              <VisualizationArea
                step={currentStep}
                field={sortField}
                maxValue={maxValue}
              />
              
              {algorithm === 'heap' && currentStep?.heap && (
                <HeapVisualization
                  heap={currentStep.heap}
                  comparing={currentStep.comparing}
                  swapping={currentStep.swapping}
                />
              )}

              {/* Bottom Row - Educational, Pseudocode, Narration */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <EducationalPanel info={info} />
                </div>
                <div className="space-y-4">
                  <PseudocodePanel
                    pseudocode={info?.pseudocode || []}
                    currentLine={currentStep?.pseudocodeLine || 0}
                  />
                  <NarrationPanel narration={currentStep?.narration || ''} />
                </div>
              </div>
            </div>
          </div>
        ) : mode === 'comparison' ? (
          <ComparisonMode pokemon={originalPokemon} field={sortField} />
        ) : (
          <SearchMode
            pokemon={originalPokemon}
            field={sortField}
            onFieldChange={handleFieldChange}
          />
        )}
      </main>

      <footer className="glass-strong border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>
            Projeto Educacional de Estruturas de Dados e Algoritmos • 
            Dados obtidos da <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PokéAPI</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
