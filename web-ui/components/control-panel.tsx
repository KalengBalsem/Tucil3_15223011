"\"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react"

export default function ControlPanel() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" size="icon" title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" title="Previous Step">
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button className="px-8" title="Solve">
            <Play className="h-4 w-4 mr-2" />
            Solve
          </Button>

          <Button variant="outline" size="icon" title="Pause">
            <Pause className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" title="Next Step">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
