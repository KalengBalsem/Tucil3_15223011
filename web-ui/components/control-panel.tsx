"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react"

type ControlPanelProps = {
  onSolve: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onTogglePlayback: () => void;
  isPlaying: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isSolved: boolean;
  isRunning: boolean;
};

export default function ControlPanel({
  onSolve,
  onPrevStep,
  onNextStep,
  onReset,
  canGoBack,
  canGoForward,
  isRunning
}: ControlPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            variant="outline" 
            size="icon" 
            title="Reset" 
            onClick={onReset}
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            title="Previous Step" 
            onClick={onPrevStep}
            disabled={!canGoBack || isRunning}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button 
            className="px-8" 
            title="Solve" 
            onClick={onSolve}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            Solve
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            title="Pause" 
            disabled={!isRunning}
          >
            <Pause className="h-4 w-4" />
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            title="Next Step" 
            onClick={onNextStep}
            disabled={!canGoForward || isRunning}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}