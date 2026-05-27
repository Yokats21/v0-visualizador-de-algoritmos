import type { HeapNode } from '@/types'
import { cn } from '@/lib/utils'

interface HeapVisualizationProps {
  heap: HeapNode[] | undefined
  comparing: number[]
  swapping: number[]
}

export function HeapVisualization({ heap, comparing, swapping }: HeapVisualizationProps) {
  if (!heap || heap.length === 0) {
    return null
  }

  const getNodeColor = (index: number): string => {
    if (swapping.includes(index)) return 'bg-swapping border-swapping'
    if (comparing.includes(index)) return 'bg-comparing border-comparing'
    return 'bg-primary/20 border-primary'
  }

  const calculateNodePosition = (index: number, totalNodes: number) => {
    const level = Math.floor(Math.log2(index + 1))
    const maxLevel = Math.floor(Math.log2(totalNodes))
    const nodesInLevel = Math.pow(2, level)
    const positionInLevel = index - (Math.pow(2, level) - 1)
    
    const width = 100 / (nodesInLevel + 1)
    const x = width * (positionInLevel + 1)
    const y = (level + 1) * (100 / (maxLevel + 2))
    
    return { x, y }
  }

  const maxLevel = Math.floor(Math.log2(heap.length))
  const svgHeight = (maxLevel + 2) * 80

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Visualização da Heap Binária</h3>
      <div className="relative bg-card/30 rounded-lg overflow-hidden" style={{ minHeight: svgHeight }}>
        <svg
          viewBox={`0 0 100 ${(maxLevel + 2) * 20}`}
          className="w-full h-auto"
          style={{ minHeight: svgHeight }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Draw edges first */}
          {heap.map((node) => {
            const parentPos = calculateNodePosition(node.index, heap.length)
            const edges = []
            
            if (node.left !== undefined && node.left < heap.length) {
              const leftPos = calculateNodePosition(node.left, heap.length)
              edges.push(
                <line
                  key={`edge-left-${node.index}`}
                  x1={parentPos.x}
                  y1={parentPos.y + 2}
                  x2={leftPos.x}
                  y2={leftPos.y - 2}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-border"
                />
              )
            }
            
            if (node.right !== undefined && node.right < heap.length) {
              const rightPos = calculateNodePosition(node.right, heap.length)
              edges.push(
                <line
                  key={`edge-right-${node.index}`}
                  x1={parentPos.x}
                  y1={parentPos.y + 2}
                  x2={rightPos.x}
                  y2={rightPos.y - 2}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-border"
                />
              )
            }
            
            return edges
          })}

          {/* Draw nodes */}
          {heap.map((node) => {
            const pos = calculateNodePosition(node.index, heap.length)
            const isComparing = comparing.includes(node.index)
            const isSwapping = swapping.includes(node.index)
            
            return (
              <g key={`node-${node.index}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="3.5"
                  className={cn(
                    'transition-all duration-300',
                    isSwapping ? 'fill-swapping' : isComparing ? 'fill-comparing' : 'fill-primary/30'
                  )}
                  stroke={isSwapping ? '#ef4444' : isComparing ? '#eab308' : '#3b82f6'}
                  strokeWidth="0.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  className="text-[2px] fill-foreground font-semibold"
                >
                  {node.value}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Node labels */}
        <div className="flex flex-wrap justify-center gap-1 mt-2 px-2">
          {heap.slice(0, 10).map((node) => (
            <div
              key={`label-${node.index}`}
              className={cn(
                'text-xs px-2 py-1 rounded border transition-all duration-300',
                getNodeColor(node.index)
              )}
            >
              <span className="font-medium">{node.pokemon.name.slice(0, 8)}</span>
              <span className="text-muted-foreground ml-1">({node.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
