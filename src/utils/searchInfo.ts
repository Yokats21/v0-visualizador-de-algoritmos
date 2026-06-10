import type { SearchAlgorithm, SearchAlgorithmInfo } from '@/types'

export const searchAlgorithmInfo: Record<SearchAlgorithm, SearchAlgorithmInfo> = {
  linear: {
    name: 'Busca Linear',
    description:
      'Percorre a lista do início ao fim, comparando cada elemento com o valor procurado até encontrá-lo ou chegar ao final.',
    precondition: 'Não exige lista ordenada. Funciona com qualquer ordem dos dados.',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)',
    pseudocode: [
      'para cada elemento i de 0 até n-1 faça',
      '  se A[i] = alvo então',
      '    retornar i  (encontrado)',
      '  senão continuar',
      'retornar -1  (não encontrado)',
    ],
  },
  binary: {
    name: 'Busca Binária',
    description:
      'Divide repetidamente o intervalo de busca pela metade. Compara o valor procurado com o elemento central e descarta a metade onde ele não pode estar.',
    precondition:
      'Exige obrigatoriamente que a lista esteja ordenada pela chave de busca.',
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)',
    pseudocode: [
      'inicio = 0, fim = n-1',
      'enquanto inicio <= fim faça',
      '  meio = (inicio + fim) / 2',
      '  se A[meio] = alvo então',
      '    retornar meio  (encontrado)',
      '  senão se A[meio] < alvo então inicio = meio + 1',
      '  senão fim = meio - 1',
      'retornar -1  (não encontrado)',
    ],
  },
}
