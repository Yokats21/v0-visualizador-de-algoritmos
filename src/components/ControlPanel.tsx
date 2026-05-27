import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ControlPanelProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onReset: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  disabled: boolean
  currentStep: number
  totalSteps: number
}

export function ControlPanel({
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  disabled,
  currentStep,
  totalSteps
}: ControlPanelProps) {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Controles</h3>
      
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled || currentStep >= totalSteps - 1}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            'bg-primary hover:bg-primary/80 text-primary-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={onStep}
          disabled={disabled || isPlaying || currentStep >= totalSteps - 1}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={onReset}
          disabled={disabled}
          className={cn(
            'p-3 rounded-lg transition-all duration-200',
            'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Velocidade</span>
          <span className="text-foreground">{speed}ms</span>
        </div>
        <input
          type="range"
          min={10}
          max={2000}
          step={10}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rápido</span>
          <span>Lento</span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Passo {currentStep + 1} de {totalSteps || 1}
        </span>
        <div className="w-full bg-secondary rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
