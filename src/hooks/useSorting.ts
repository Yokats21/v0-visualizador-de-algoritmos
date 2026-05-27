import { useState, useCallback, useRef, useEffect } from 'react'
import type { Pokemon, SortStep, SortField, AlgorithmName } from '@/types'
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort } from '@/algorithms'

const algorithms: Record<AlgorithmName, (arr: Pokemon[], field: SortField) => SortStep[]> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort
}

export function useSorting() {
  const [steps, setSteps] = useState<SortStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [elapsedTime, setElapsedTime] = useState(0)
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

  const generateSteps = useCallback((pokemon: Pokemon[], algorithm: AlgorithmName, field: SortField) => {
    clearIntervals()
    const sortFunction = algorithms[algorithm]
    const generatedSteps = sortFunction([...pokemon], field)
    setSteps(generatedSteps)
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setElapsedTime(0)
    startTimeRef.current = null
  }, [clearIntervals])

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
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [currentStepIndex, steps.length])

  const reset = useCallback(() => {
    clearIntervals()
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setElapsedTime(0)
    startTimeRef.current = null
  }, [clearIntervals])

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
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
      }, 100)
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
    setSpeed,
    generateSteps,
    play,
    pause,
    step,
    reset
  }
}
