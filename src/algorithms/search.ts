import type { Pokemon, SortField, SearchStep } from '@/types'

/**
 * Busca Linear - implementada manualmente.
 * Percorre o array elemento por elemento comparando com o valor procurado.
 * Gera um histórico de passos para animação.
 */
export function linearSearch(
  array: Pokemon[],
  target: number,
  field: SortField
): SearchStep[] {
  const steps: SearchStep[] = []
  let comparisons = 0
  const checked: number[] = []

  // Estado inicial
  steps.push({
    array: [...array],
    current: -1,
    left: -1,
    right: -1,
    middle: -1,
    found: -1,
    checked: [],
    discarded: [],
    comparisons: 0,
    narration: `Iniciando Busca Linear pelo valor ${target}. Vamos percorrer cada Pokémon da esquerda para a direita.`,
    pseudocodeLine: 0,
  })

  for (let i = 0; i < array.length; i++) {
    comparisons++

    // Comparando elemento atual
    steps.push({
      array: [...array],
      current: i,
      left: -1,
      right: -1,
      middle: -1,
      found: -1,
      checked: [...checked],
      discarded: [],
      comparisons,
      narration: `Comparando ${array[i].name} (${array[i][field]}) com o valor procurado (${target}).`,
      pseudocodeLine: 1,
    })

    if (array[i][field] === target) {
      // Encontrado
      steps.push({
        array: [...array],
        current: i,
        left: -1,
        right: -1,
        middle: -1,
        found: i,
        checked: [...checked],
        discarded: [],
        comparisons,
        narration: `Pokémon encontrado! ${array[i].name} possui o valor ${target} na posição ${i}.`,
        pseudocodeLine: 3,
      })
      return steps
    }

    // Não encontrado nesta posição
    checked.push(i)
    steps.push({
      array: [...array],
      current: -1,
      left: -1,
      right: -1,
      middle: -1,
      found: -1,
      checked: [...checked],
      discarded: [],
      comparisons,
      narration: `Valor não encontrado nesta posição. ${array[i].name} já foi verificado.`,
      pseudocodeLine: 2,
    })
  }

  // Fim sem encontrar
  steps.push({
    array: [...array],
    current: -1,
    left: -1,
    right: -1,
    middle: -1,
    found: -1,
    checked: [...checked],
    discarded: [],
    comparisons,
    narration: `Busca concluída. Nenhum Pokémon com o valor ${target} foi encontrado.`,
    pseudocodeLine: 4,
  })

  return steps
}

/**
 * Busca Binária - implementada manualmente.
 * Pré-condição: o array deve estar ordenado pela chave (field).
 * Divide o intervalo de busca pela metade a cada passo.
 * Gera um histórico de passos para animação.
 */
export function binarySearch(
  array: Pokemon[],
  target: number,
  field: SortField
): SearchStep[] {
  const steps: SearchStep[] = []
  let comparisons = 0
  let left = 0
  let right = array.length - 1
  const discarded: number[] = []

  // Estado inicial
  steps.push({
    array: [...array],
    current: -1,
    left,
    right,
    middle: -1,
    found: -1,
    checked: [],
    discarded: [],
    comparisons: 0,
    narration: `Iniciando Busca Binária pelo valor ${target}. A lista está ordenada, então podemos descartar metades a cada passo.`,
    pseudocodeLine: 0,
  })

  while (left <= right) {
    const middle = Math.floor((left + right) / 2)

    // Calculando meio
    steps.push({
      array: [...array],
      current: -1,
      left,
      right,
      middle,
      found: -1,
      checked: [],
      discarded: [...discarded],
      comparisons,
      narration: `Calculando elemento do meio: posição ${middle} (${array[middle].name} = ${array[middle][field]}).`,
      pseudocodeLine: 2,
    })

    comparisons++

    // Comparando
    steps.push({
      array: [...array],
      current: middle,
      left,
      right,
      middle,
      found: -1,
      checked: [],
      discarded: [...discarded],
      comparisons,
      narration: `Comparando o valor do meio (${array[middle][field]}) com o procurado (${target}).`,
      pseudocodeLine: 3,
    })

    if (array[middle][field] === target) {
      // Encontrado
      steps.push({
        array: [...array],
        current: middle,
        left,
        right,
        middle,
        found: middle,
        checked: [],
        discarded: [...discarded],
        comparisons,
        narration: `Elemento encontrado! ${array[middle].name} possui o valor ${target} na posição ${middle}.`,
        pseudocodeLine: 4,
      })
      return steps
    }

    if (array[middle][field] < target) {
      // Descartar metade esquerda
      for (let i = left; i <= middle; i++) discarded.push(i)
      const newLeft = middle + 1
      steps.push({
        array: [...array],
        current: -1,
        left: newLeft,
        right,
        middle,
        found: -1,
        checked: [],
        discarded: [...discarded],
        comparisons,
        narration: `O valor procurado (${target}) é maior que o elemento central (${array[middle][field]}). Descartando a metade esquerda.`,
        pseudocodeLine: 5,
      })
      left = newLeft
    } else {
      // Descartar metade direita
      for (let i = middle; i <= right; i++) discarded.push(i)
      const newRight = middle - 1
      steps.push({
        array: [...array],
        current: -1,
        left,
        right: newRight,
        middle,
        found: -1,
        checked: [],
        discarded: [...discarded],
        comparisons,
        narration: `O valor procurado (${target}) é menor que o elemento central (${array[middle][field]}). Descartando a metade direita.`,
        pseudocodeLine: 6,
      })
      right = newRight
    }
  }

  // Fim sem encontrar
  steps.push({
    array: [...array],
    current: -1,
    left: -1,
    right: -1,
    middle: -1,
    found: -1,
    checked: [],
    discarded: [...discarded],
    comparisons,
    narration: `Busca concluída. Nenhum Pokémon com o valor ${target} foi encontrado.`,
    pseudocodeLine: 7,
  })

  return steps
}

/**
 * Calcula o número teórico de comparações para os gráficos comparativos.
 * Linear (caso médio): n/2 aproximado, usamos pior caso n para clareza didática.
 * Binária (pior caso): log2(n) arredondado para cima.
 */
export function getComparisonGrowthData() {
  const sizes = [10, 50, 100, 500, 1000]
  return sizes.map((size) => ({
    size: size.toString(),
    linear: Math.round(size * 0.92), // ~pior caso prático
    binary: Math.ceil(Math.log2(size)),
  }))
}
