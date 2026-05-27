import { Loader2, AlertCircle } from 'lucide-react'
import type { Pokemon } from '@/types'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  loading: boolean
  error: string | null
  pokemon: Pokemon[]
  onLoad: (size: number) => void
  sampleSize: number
}

export function LoadingState({ loading, error, pokemon, onLoad, sampleSize }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando Pokémon da API...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle size={48} className="text-swapping mb-4" />
        <p className="text-swapping mb-4">{error}</p>
        <button
          onClick={() => onLoad(sampleSize)}
          className={cn(
            'px-4 py-2 rounded-lg transition-all duration-200',
            'bg-primary hover:bg-primary/80 text-primary-foreground'
          )}
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Nenhum Pokémon carregado</p>
        <button
          onClick={() => onLoad(sampleSize)}
          className={cn(
            'px-4 py-2 rounded-lg transition-all duration-200',
            'bg-primary hover:bg-primary/80 text-primary-foreground'
          )}
        >
          Carregar Pokémon
        </button>
      </div>
    )
  }

  return null
}
