import { BookOpen, Database, Clock, Layers } from 'lucide-react'
import type { AlgorithmInfo } from '@/types'

interface EducationalPanelProps {
  info: AlgorithmInfo | null
}

export function EducationalPanel({ info }: EducationalPanelProps) {
  if (!info) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Painel Educacional</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">
          Selecione um algoritmo para ver informações detalhadas
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">{info.name}</h2>
      </div>
      
      <p className="text-muted-foreground">{info.description}</p>

      {/* Data Structure */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground">Estrutura de Dados</h3>
        </div>
        <div className="bg-card/50 rounded-lg p-4 border border-border/30">
          <p className="text-sm font-medium text-primary mb-2">{info.dataStructure}</p>
          <p className="text-sm text-muted-foreground">{info.dataStructureExplanation}</p>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground">Como Funciona</h3>
        </div>
        <div className="bg-card/50 rounded-lg p-4 border border-border/30">
          <p className="text-sm text-muted-foreground leading-relaxed">{info.explanation}</p>
        </div>
      </div>

      {/* Complexity */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground">Complexidade</h3>
        </div>
        <div className="bg-card/50 rounded-lg p-4 border border-border/30 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Melhor Caso</span>
              <p className="text-sm font-mono font-semibold text-sorted">{info.bestCase}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Caso Médio</span>
              <p className="text-sm font-mono font-semibold text-comparing">{info.averageCase}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Pior Caso</span>
              <p className="text-sm font-mono font-semibold text-swapping">{info.worstCase}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Espaço Auxiliar</span>
              <p className="text-sm font-mono font-semibold text-primary">{info.space}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground leading-relaxed">{info.complexityJustification}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
