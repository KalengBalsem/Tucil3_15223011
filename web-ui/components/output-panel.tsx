"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OutputPanel() {
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
            <div className="font-medium">Ready</div>

            <div className="text-gray-500">Time elapsed:</div>
            <div className="font-medium">0.00s</div>

            <div className="text-gray-500">Moves found:</div>
            <div className="font-medium">0</div>

            <div className="text-gray-500">States explored:</div>
            <div className="font-medium">0</div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-2">Solution path:</h4>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono h-[120px] overflow-y-auto">
              <p className="text-gray-400">No solution generated yet.</p>
              <p className="text-gray-400">Click "Solve" to begin.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
