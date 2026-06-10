#  Visualizador de Algoritmos

## Descrição do Projeto

Este projeto consiste em uma aplicação web interativa desenvolvida para demonstrar visualmente o funcionamento dos principais algoritmos clássicos de ordenação.

A aplicação consome dados da PokéAPI e permite visualizar, passo a passo, como cada algoritmo realiza comparações, trocas, partições e reorganizações dos elementos.

O objetivo principal é servir como ferramenta educacional para o estudo de Estrutura de Dados e Algoritmos.

---

# API Utilizada

* PokéAPI
* Endpoint principal:

https://pokeapi.co/api/v2/pokemon?limit=50

A API fornece dados reais de Pokémons utilizados como dataset para os algoritmos de ordenação.

---

# Dados Utilizados

Cada Pokémon possui os seguintes campos utilizados no sistema:

* Nome
* Sprite (imagem)
* Peso (`weight`)
* Altura (`height`)
* Experiência Base (`base_experience`)

---

# Campos Ordenáveis

O usuário pode escolher ordenar os Pokémons pelos seguintes campos:

| Campo           | Descrição         |
| --------------- | ----------------- |
| weight          | Peso do Pokémon   |
| height          | Altura do Pokémon |
| base_experience | Experiência base  |

---

# Algoritmos Implementados

Todos os algoritmos foram implementados manualmente sem utilização de `array.sort()`.

## Bubble Sort

Realiza comparações entre elementos vizinhos e troca suas posições quando necessário.

## Selection Sort

Seleciona o menor elemento do array e o posiciona corretamente a cada iteração.

## Insertion Sort

Insere elementos gradualmente em uma porção já ordenada do array.

## Merge Sort

Utiliza divisão e conquista para dividir o array em partes menores e depois mesclá-las ordenadamente.

## Quick Sort

Seleciona um pivô e reorganiza os elementos ao redor dele.

## Heap Sort

Utiliza um Heap Binário (Max Heap) para organizar e extrair os maiores elementos.

##  Algoritmos de Busca

- Busca Linear
- Busca Binária

## Funcionalidades:
- Busca exata
- Busca parcial
- Visualização passo a passo
- Comparação de desempenho

---

# Estruturas de Dados Utilizadas

| Algoritmo      | Estrutura               |
| -------------- | ----------------------- |
| Bubble Sort    | Array                   |
| Selection Sort | Array                   |
| Insertion Sort | Array                   |
| Merge Sort     | Arrays auxiliares       |
| Quick Sort     | Array + Particionamento |
| Heap Sort      | Heap Binário            |

---

# Funcionalidades

## Visualização Animada

* Barras proporcionais aos valores
* Cards dos Pokémons
* Destaque visual de comparações e trocas

## Controles

* Play
* Pause
* Step
* Reset
* Controle de velocidade

## Métricas em Tempo Real

* Número de comparações
* Número de trocas
* Tempo de execução

## Painel Educacional

* Explicação do algoritmo
* Complexidade
* Pseudocódigo destacado
* Narração do passo atual

## Comparação de Desempenho

* Tabela comparativa
* Gráficos
* Comparação entre todos os algoritmos

---

# Complexidades

| Algoritmo      | Melhor Caso | Médio Caso | Pior Caso  |
| -------------- | ----------- | ---------- | ---------- |
| Bubble Sort    | O(n)        | O(n²)      | O(n²)      |
| Selection Sort | O(n²)       | O(n²)      | O(n²)      |
| Insertion Sort | O(n)        | O(n²)      | O(n²)      |
| Merge Sort     | O(n log n)  | O(n log n) | O(n log n) |
| Quick Sort     | O(n log n)  | O(n log n) | O(n²)      |
| Heap Sort      | O(n log n)  | O(n log n) | O(n log n) |

---

# Tecnologias Utilizadas

* React
* Vite
* Tailwind CSS
* TypeScript
* Recharts

---

# Como Executar

## Instalar dependências

```bash
npm install
```

## Rodar projeto

```bash
npm run dev
```

---

# Estrutura do Projeto

```text
src/
 ├── algorithms/
 ├── components/
 ├── hooks/
 ├── utils/
 ├── pages/
```

---

# Localização dos Algoritmos

Todos os algoritmos de ordenação estão localizados na pasta:

```text
src/algorithms/
```

---

# Objetivo Acadêmico

O projeto foi desenvolvido para demonstrar:

* funcionamento interno dos algoritmos de ordenação
* análise de complexidade
* estruturas de dados
* visualização didática de algoritmos clássicos

---

# Autor

Projeto desenvolvido para fins acadêmicos na disciplina de Estrutura de Dados.
