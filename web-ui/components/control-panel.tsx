import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronsRight } from "lucide-react"
import { useEffect, useState } from "react"

type ControlPanelProps = {
  onSolve: () => void
  onPrevStep: () => void
  onNextStep: () => void
  onReset: () => void
  onJumpToEnd: () => void
  onTogglePlayback: () => void
  isPlaying: boolean
  canGoBack: boolean
  canGoForward: boolean
  isSolved: boolean
  isRunning: boolean
}

export default function ControlPanel({
  onSolve,
  onPrevStep,
  onNextStep,
  onReset,
  onJumpToEnd,
  canGoBack,
  canGoForward,
  isRunning
}: ControlPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        if (canGoForward) {
          onNextStep()
        } else {
          setIsPlaying(false) // Stop playback when no more steps are available
        }
      }, 500) // Adjust the interval duration as needed
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, canGoForward, onNextStep])

  const handleTogglePlayback = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* Reset */}
          <Button variant="outline" size="icon" title="Reset" onClick={onReset} disabled={isRunning}>
            <RotateCcw className="h-4 w-4" />
          </Button>

          {/* Prev */}
          <Button variant="outline" size="icon" title="Previous Step" onClick={onPrevStep} disabled={!canGoBack || isRunning}>
            <SkipBack className="h-4 w-4" />
          </Button>
            {/* Solve */}
            <Button
              className="px-8"
              title="Solve"
              onClick={onSolve}
              disabled={isRunning}
            >
              Solve
            </Button>

            {/* Play/Pause */}
            <Button
              className="px-8"
              title={isPlaying ? "Pause" : "Play"}
              onClick={handleTogglePlayback}
              disabled={isRunning || (!isPlaying && !canGoForward)}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

          {/* Next */}
          <Button variant="outline" size="icon" title="Next Step" onClick={onNextStep} disabled={!canGoForward || isRunning}>
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Jump to End */}
          <Button variant="outline" size="icon" title="Last Step" onClick={onJumpToEnd} disabled={!canGoForward || isRunning}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}