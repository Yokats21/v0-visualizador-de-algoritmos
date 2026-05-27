export interface Pokemon {
  id: number
  name: string
  sprite: string
  weight: number
  height: number
  base_experience: number
}

export type SortField = 'weight' | 'height' | 'base_experience'

export type SortState = 'normal' | 'comparing' | 'swapping' | 'sorted'

export interface SortStep {
  array: Pokemon[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  narration: string
  pseudocodeLine: number
  comparisons: number
  swaps: number
  heap?: HeapNode[]
}

export interface HeapNode {
  index: number
  value: number
  pokemon: Pokemon
  left?: number
  right?: number
}

export interface AlgorithmInfo {
  name: string
  description: string
  dataStructure: string
  dataStructureExplanation: string
  explanation: string
  bestCase: string
  averageCase: string
  worstCase: string
  space: string
  complexityJustification: string
  pseudocode: string[]
}

export interface SortResult {
  steps: SortStep[]
  totalComparisons: number
  totalSwaps: number
  executionTime: number
}

export type AlgorithmName = 
  | 'bubble' 
  | 'selection' 
  | 'insertion' 
  | 'merge' 
  | 'quick' 
  | 'heap'
