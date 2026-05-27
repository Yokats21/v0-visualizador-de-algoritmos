import { useState, useCallback } from 'react'
import type { Pokemon } from '@/types'

const API_BASE = 'https://pokeapi.co/api/v2'

interface PokemonApiResponse {
  results: { name: string; url: string }[]
}

interface PokemonDetail {
  id: number
  name: string
  sprites: {
    front_default: string
    other?: {
      'official-artwork'?: {
        front_default: string
      }
    }
  }
  weight: number
  height: number
  base_experience: number
}

export function usePokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemon = useCallback(async (limit: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/pokemon?limit=${limit}`)
      if (!response.ok) throw new Error('Falha ao buscar lista de Pokémon')
      
      const data: PokemonApiResponse = await response.json()
      
      const detailPromises = data.results.map(async (p) => {
        const detailResponse = await fetch(p.url)
        if (!detailResponse.ok) throw new Error(`Falha ao buscar ${p.name}`)
        return detailResponse.json() as Promise<PokemonDetail>
      })

      const details = await Promise.all(detailPromises)

      const formattedPokemon: Pokemon[] = details.map((detail) => ({
        id: detail.id,
        name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
        sprite: detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default,
        weight: detail.weight,
        height: detail.height,
        base_experience: detail.base_experience || 0
      }))

      setPokemon(formattedPokemon)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  return { pokemon, loading, error, fetchPokemon }
}
