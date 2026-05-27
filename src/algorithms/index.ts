import type { Pokemon, SortStep, SortField, HeapNode } from '@/types'

function getValue(pokemon: Pokemon, field: SortField): number {
  return pokemon[field]
}

function createStep(
  array: Pokemon[],
  comparing: number[],
  swapping: number[],
  sorted: number[],
  narration: string,
  pseudocodeLine: number,
  comparisons: number,
  swaps: number,
  heap?: HeapNode[]
): SortStep {
  return {
    array: [...array],
    comparing,
    swapping,
    sorted: [...sorted],
    narration,
    pseudocodeLine,
    comparisons,
    swaps,
    heap
  }
}

export function bubbleSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], sorted, 'Iniciando Bubble Sort...', 0, comparisons, swaps))

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    steps.push(createStep(array, [], [], sorted, `Passagem ${i + 1}: verificando elementos adjacentes`, 2, comparisons, swaps))

    for (let j = 0; j < n - i - 1; j++) {
      const nameJ = array[j].name
      const nameJ1 = array[j + 1].name
      steps.push(createStep(array, [j, j + 1], [], sorted, `Comparando ${nameJ} (${getValue(array[j], field)}) com ${nameJ1} (${getValue(array[j + 1], field)})`, 5, comparisons, swaps))
      comparisons++

      if (getValue(array[j], field) > getValue(array[j + 1], field)) {
        steps.push(createStep(array, [], [j, j + 1], sorted, `Trocando ${nameJ} com ${nameJ1}`, 6, comparisons, swaps))
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
        swaps++
        swapped = true
        steps.push(createStep(array, [], [], sorted, `Troca concluída`, 7, comparisons, swaps))
      }
    }

    sorted.push(n - 1 - i)
    steps.push(createStep(array, [], [], sorted, `${array[n - 1 - i].name} está na posição correta`, 9, comparisons, swaps))

    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        if (!sorted.includes(k)) sorted.push(k)
      }
      steps.push(createStep(array, [], [], sorted, 'Nenhuma troca necessária - array ordenado!', 10, comparisons, swaps))
      break
    }
  }

  if (sorted.length < n) {
    sorted.push(0)
  }
  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Bubble Sort concluído!', 12, comparisons, swaps))

  return steps
}

export function selectionSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], sorted, 'Iniciando Selection Sort...', 0, comparisons, swaps))

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push(createStep(array, [minIdx], [], sorted, `Buscando o menor elemento a partir da posição ${i}. Mínimo atual: ${array[minIdx].name}`, 3, comparisons, swaps))

    for (let j = i + 1; j < n; j++) {
      steps.push(createStep(array, [minIdx, j], [], sorted, `Comparando ${array[j].name} (${getValue(array[j], field)}) com mínimo ${array[minIdx].name} (${getValue(array[minIdx], field)})`, 4, comparisons, swaps))
      comparisons++

      if (getValue(array[j], field) < getValue(array[minIdx], field)) {
        minIdx = j
        steps.push(createStep(array, [minIdx], [], sorted, `Novo mínimo encontrado: ${array[minIdx].name}`, 6, comparisons, swaps))
      }
    }

    if (minIdx !== i) {
      steps.push(createStep(array, [], [i, minIdx], sorted, `Trocando ${array[i].name} com ${array[minIdx].name}`, 10, comparisons, swaps))
      const temp = array[i]
      array[i] = array[minIdx]
      array[minIdx] = temp
      swaps++
    }

    sorted.push(i)
    steps.push(createStep(array, [], [], sorted, `${array[i].name} está na posição correta`, 11, comparisons, swaps))
  }

  sorted.push(n - 1)
  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Selection Sort concluído!', 13, comparisons, swaps))

  return steps
}

export function insertionSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  const sorted: number[] = [0]
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], sorted, 'Iniciando Insertion Sort...', 0, comparisons, swaps))

  for (let i = 1; i < n; i++) {
    const key = array[i]
    const keyValue = getValue(key, field)
    let j = i - 1

    steps.push(createStep(array, [i], [], sorted, `Inserindo ${key.name} (${keyValue}) na posição correta`, 3, comparisons, swaps))

    while (j >= 0) {
      steps.push(createStep(array, [j, i], [], sorted, `Comparando ${key.name} com ${array[j].name} (${getValue(array[j], field)})`, 5, comparisons, swaps))
      comparisons++

      if (getValue(array[j], field) > keyValue) {
        steps.push(createStep(array, [], [j, j + 1], sorted, `Movendo ${array[j].name} para a direita`, 6, comparisons, swaps))
        array[j + 1] = array[j]
        swaps++
        j--
      } else {
        break
      }
    }

    array[j + 1] = key
    sorted.push(i)
    steps.push(createStep(array, [], [], sorted, `${key.name} inserido na posição ${j + 1}`, 9, comparisons, swaps))
  }

  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Insertion Sort concluído!', 11, comparisons, swaps))

  return steps
}

export function mergeSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], [], 'Iniciando Merge Sort...', 0, comparisons, swaps))

  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1)
    const rightArr = array.slice(mid + 1, right + 1)

    const leftNames = leftArr.map(p => p.name).join(', ')
    const rightNames = rightArr.map(p => p.name).join(', ')
    steps.push(createStep(array, Array.from({ length: right - left + 1 }, (_, i) => left + i), [], [], `Mesclando: [${leftNames}] com [${rightNames}]`, 8, comparisons, swaps))

    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      steps.push(createStep(array, [left + i, mid + 1 + j], [], [], `Comparando ${leftArr[i].name} (${getValue(leftArr[i], field)}) com ${rightArr[j].name} (${getValue(rightArr[j], field)})`, 13, comparisons, swaps))
      comparisons++

      if (getValue(leftArr[i], field) <= getValue(rightArr[j], field)) {
        array[k] = leftArr[i]
        steps.push(createStep(array, [], [k], [], `Colocando ${leftArr[i].name} na posição ${k}`, 15, comparisons, swaps))
        i++
      } else {
        array[k] = rightArr[j]
        steps.push(createStep(array, [], [k], [], `Colocando ${rightArr[j].name} na posição ${k}`, 17, comparisons, swaps))
        j++
      }
      swaps++
      k++
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i]
      steps.push(createStep(array, [], [k], [], `Copiando ${leftArr[i].name} restante`, 19, comparisons, swaps))
      swaps++
      i++
      k++
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j]
      steps.push(createStep(array, [], [k], [], `Copiando ${rightArr[j].name} restante`, 19, comparisons, swaps))
      swaps++
      j++
      k++
    }
  }

  function sort(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      steps.push(createStep(array, [], [], [], `Dividindo: índices ${left} a ${right}, meio em ${mid}`, 2, comparisons, swaps))

      sort(left, mid)
      sort(mid + 1, right)
      merge(left, mid, right)
    }
  }

  sort(0, n - 1)
  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Merge Sort concluído!', 6, comparisons, swaps))

  return steps
}

export function quickSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], sorted, 'Iniciando Quick Sort...', 0, comparisons, swaps))

  function partition(low: number, high: number): number {
    const pivot = array[high]
    const pivotValue = getValue(pivot, field)
    steps.push(createStep(array, [high], [], sorted, `Pivô selecionado: ${pivot.name} (${pivotValue})`, 8, comparisons, swaps))

    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push(createStep(array, [j, high], [], sorted, `Comparando ${array[j].name} (${getValue(array[j], field)}) com pivô ${pivot.name} (${pivotValue})`, 10, comparisons, swaps))
      comparisons++

      if (getValue(array[j], field) < pivotValue) {
        i++
        if (i !== j) {
          steps.push(createStep(array, [], [i, j], sorted, `Trocando ${array[i].name} com ${array[j].name}`, 12, comparisons, swaps))
          const temp = array[i]
          array[i] = array[j]
          array[j] = temp
          swaps++
        }
      }
    }

    const pivotPos = i + 1
    if (pivotPos !== high) {
      steps.push(createStep(array, [], [pivotPos, high], sorted, `Colocando pivô ${pivot.name} na posição ${pivotPos}`, 16, comparisons, swaps))
      const temp = array[pivotPos]
      array[pivotPos] = array[high]
      array[high] = temp
      swaps++
    }

    sorted.push(pivotPos)
    steps.push(createStep(array, [], [], sorted, `${array[pivotPos].name} está na posição final`, 17, comparisons, swaps))

    return pivotPos
  }

  function sort(low: number, high: number): void {
    if (low < high) {
      steps.push(createStep(array, [], [], sorted, `Particionando de ${low} a ${high}`, 1, comparisons, swaps))
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    } else if (low === high && !sorted.includes(low)) {
      sorted.push(low)
      steps.push(createStep(array, [], [], sorted, `${array[low].name} está na posição final`, 4, comparisons, swaps))
    }
  }

  sort(0, n - 1)
  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Quick Sort concluído!', 5, comparisons, swaps))

  return steps
}

function buildHeapVisualization(array: Pokemon[], heapSize: number, field: SortField): HeapNode[] {
  const heap: HeapNode[] = []
  for (let i = 0; i < heapSize; i++) {
    heap.push({
      index: i,
      value: getValue(array[i], field),
      pokemon: array[i],
      left: 2 * i + 1 < heapSize ? 2 * i + 1 : undefined,
      right: 2 * i + 2 < heapSize ? 2 * i + 2 : undefined
    })
  }
  return heap
}

export function heapSort(arr: Pokemon[], field: SortField): SortStep[] {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(createStep(array, [], [], sorted, 'Iniciando Heap Sort...', 0, comparisons, swaps, buildHeapVisualization(array, n, field)))

  function heapify(heapSize: number, i: number): void {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    const heap = buildHeapVisualization(array, heapSize, field)

    if (left < heapSize) {
      steps.push(createStep(array, [i, left], [], sorted, `Comparando ${array[i].name} com filho esquerdo ${array[left].name}`, 16, comparisons, swaps, heap))
      comparisons++
      if (getValue(array[left], field) > getValue(array[largest], field)) {
        largest = left
      }
    }

    if (right < heapSize) {
      steps.push(createStep(array, [i, right], [], sorted, `Comparando ${array[largest].name} com filho direito ${array[right].name}`, 18, comparisons, swaps, heap))
      comparisons++
      if (getValue(array[right], field) > getValue(array[largest], field)) {
        largest = right
      }
    }

    if (largest !== i) {
      steps.push(createStep(array, [], [i, largest], sorted, `Trocando ${array[i].name} com ${array[largest].name} (heapify)`, 20, comparisons, swaps, heap))
      const temp = array[i]
      array[i] = array[largest]
      array[largest] = temp
      swaps++

      const newHeap = buildHeapVisualization(array, heapSize, field)
      steps.push(createStep(array, [], [], sorted, `Continuando heapify em ${array[largest].name}`, 21, comparisons, swaps, newHeap))

      heapify(heapSize, largest)
    }
  }

  // Build max heap
  steps.push(createStep(array, [], [], sorted, 'Construindo Max-Heap...', 3, comparisons, swaps, buildHeapVisualization(array, n, field)))

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push(createStep(array, [i], [], sorted, `Heapify no índice ${i} (${array[i].name})`, 4, comparisons, swaps, buildHeapVisualization(array, n, field)))
    heapify(n, i)
  }

  steps.push(createStep(array, [], [], sorted, 'Max-Heap construído! Raiz contém o maior elemento.', 5, comparisons, swaps, buildHeapVisualization(array, n, field)))

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    steps.push(createStep(array, [], [0, i], sorted, `Movendo raiz ${array[0].name} para posição ${i}`, 8, comparisons, swaps, buildHeapVisualization(array, i + 1, field)))

    const temp = array[0]
    array[0] = array[i]
    array[i] = temp
    swaps++

    sorted.push(i)
    steps.push(createStep(array, [], [], sorted, `${array[i].name} está na posição final. Restaurando heap...`, 9, comparisons, swaps, buildHeapVisualization(array, i, field)))

    heapify(i, 0)
  }

  sorted.push(0)
  steps.push(createStep(array, [], [], Array.from({ length: n }, (_, i) => i), 'Heap Sort concluído!', 10, comparisons, swaps))

  return steps
}
