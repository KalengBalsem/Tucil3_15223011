"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OutputPanelProps {
  status: "ready" | "running" | "done" | "error";
  time: number;
  movesCount: number;
  statesExpanded: number;
  solution: any[];
  currentStep: number;
}

export default function OutputPanel({
  status,
  time,
  movesCount,
  statesExpanded,
  solution,
  currentStep
}: OutputPanelProps) {
  // Format move description for current step
  const getCurrentMoveDescription = () => {
    if (!solution.length || currentStep === 0) return "Initial state";
    const move = solution[currentStep].move;
    if (!move) return "No move information";
    
    return `Move ${move.pieceId} ${move.direction} by ${move.distance}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Solver Output</CardTitle>
        <CardDescription>Processing information and results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Status:</div>
            <div className="font-medium">
              {status === "ready" && "Ready"}
              {status === "running" && "Processing..."}
              {status === "done" && "Solution found"}
              {status === "error" && "Error"}
            </div>

            <div className="text-gray-500">Time elapsed:</div>
            <div className="font-medium">{time.toFixed(2)}s</div>

            <div className="text-gray-500">Moves found:</div>
            <div className="font-medium">{movesCount}</div>

            <div className="text-gray-500">States explored:</div>
            <div className="font-medium">{statesExpanded}</div>
            
            <div className="text-gray-500">Current step:</div>
            <div className="font-medium">{currentStep} / {solution.length - 1}</div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">Current move:</h4>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              {solution.length > 0 ? (
                <p>{getCurrentMoveDescription()}</p>
              ) : (
                <>
                  <p className="text-gray-400">No solution generated yet.</p>
                  <p className="text-gray-400">Click "Solve" to begin.</p>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">Solution path:</h4>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono h-[120px] overflow-y-auto">
              {solution.length > 0 ? (
                solution.map((step, index) => (
                  <div 
                    key={index} 
                    className={`py-1 ${currentStep === index ? 'bg-blue-50 font-bold' : ''}`}
                  >
                    {index === 0 ? "Initial state" : `${index}. ${step.move?.pieceId} ${step.move?.direction} (${step.move?.distance})`}
                  </div>
                ))
              ) : (
                <>
                  <p className="text-gray-400">No solution generated yet.</p>
                  <p className="text-gray-400">Click "Solve" to begin.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}