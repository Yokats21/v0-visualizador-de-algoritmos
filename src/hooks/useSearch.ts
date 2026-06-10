import { useState, useCallback, useRef, useEffect } from 'react'
import type { Pokemon, SearchStep, SortField, SearchAlgorithm } from '@/types'
import { linearSearch, binarySearch } from '@/algorithms/search'

export function useSearch() {
  const [steps, setSteps] = useState<SearchStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)

  const currentStep = steps[currentStepIndex] || null

  const clearIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const runSearch = useCallback(
    (
      array: Pokemon[],
      algorithm: SearchAlgorithm,
      target: number,
      field: SortField
    ) => {
      clearIntervals()
      const searchFn = algorithm === 'linear' ? linearSearch : binarySearch
      const generatedSteps = searchFn(array, target, field)
      setSteps(generatedSteps)
      setCurrentStepIndex(0)
      setElapsedTime(0)
      setHasSearched(true)
      startTimeRef.current = null
      // Inicia animação automaticamente
      setIsPlaying(true)
      startTimeRef.current = Date.now()
    },
    [clearIntervals]
  )

  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) return
    setIsPlaying(true)
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - elapsedTime
    }
  }, [currentStepIndex, steps.length, elapsedTime])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearIntervals()
  }, [clearIntervals])

  const step = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [currentStepIndex, steps.length])

  const reset = useCallback(() => {
    clearIntervals()
    setSteps([])
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setElapsedTime(0)
    setHasSearched(false)
    startTimeRef.current = null
  }, [clearIntervals])

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            clearIntervals()
            return prev
          }
          return prev + 1
        })
      }, speed)

      timerRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current)
        }
      }, 50)
    }

    return () => clearIntervals()
  }, [isPlaying, speed, steps.length, clearIntervals])

  useEffect(() => {
    if (currentStepIndex >= steps.length - 1 && isPlaying) {
      setIsPlaying(false)
      clearIntervals()
    }
  }, [currentStepIndex, steps.length, isPlaying, clearIntervals])

  return {
    steps,
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
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
  }
}
