import { MessageSquare } from 'lucide-react'

interface NarrationPanelProps {
  narration: string
}

export function NarrationPanel({ narration }: NarrationPanelProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Narração</h3>
      </div>
      <div className="bg-card/50 rounded-lg p-4 border border-border/30 min-h-[60px]">
        <p className="text-foreground text-sm leading-relaxed">
          {narration || 'Selecione um algoritmo e clique em Play para começar...'}
        </p>
      </div>
    </div>
  )
}
