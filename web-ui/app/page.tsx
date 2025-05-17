import PuzzleBoard from "@/components/puzzle-board"
import InputPanel from "@/components/input-panel"
import OutputPanel from "@/components/output-panel"
import ControlPanel from "@/components/control-panel"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Rush Hour Solver</h1>
          <p className="text-gray-500 mt-2">Visualize and solve Rush Hour puzzles efficiently</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PuzzleBoard />
            <ControlPanel />
          </div>

          <div className="space-y-6">
            <InputPanel />
            <OutputPanel />
          </div>
        </div>
      </div>
    </main>
  )
}
