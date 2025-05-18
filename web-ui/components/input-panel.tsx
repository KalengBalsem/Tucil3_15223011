"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InputPanelProps {
  puzzleInput: string;
  setPuzzleInput: (input: string) => void;
  onLoadPuzzle: () => void;
  algorithm: "ucs" | "astar" | "greedy";
  setAlgorithm: (algo: "ucs" | "astar" | "greedy") => void;
  heuristic: "manhattan" | "blocking" | "combined";
  setHeuristic: (heuristic: "manhattan" | "blocking" | "combined") => void;
}

export default function InputPanel({
  puzzleInput,
  setPuzzleInput,
  onLoadPuzzle,
  algorithm,
  setAlgorithm,
  heuristic,
  setHeuristic
}: InputPanelProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPuzzleInput(event.target.result as string);
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Input Puzzle</CardTitle>
        <CardDescription>Upload a file or enter puzzle data manually</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <Textarea
              placeholder="Enter puzzle configuration..."
              className="min-h-[120px] font-mono text-sm"
              value={puzzleInput}
              onChange={(e) => setPuzzleInput(e.target.value)}
            />
            <Button className="w-full" onClick={onLoadPuzzle}>Load Puzzle</Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <label className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center block cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                {file ? file.name : "Drag and drop your puzzle file here"}
              </p>
              <p className="text-xs text-gray-400">Supports .txt files</p>
              <input 
                type="file" 
                accept=".txt" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
            <Button className="w-full" onClick={onLoadPuzzle} disabled={!file}>
              Load File
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Algorithm</label>
            <Select value={algorithm} onValueChange={(value: any) => setAlgorithm(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ucs">Uniform Cost Search</SelectItem>
                <SelectItem value="astar">A* Search</SelectItem>
                <SelectItem value="greedy">Greedy Best-First Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(algorithm === "astar" || algorithm === "greedy") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Heuristic</label>
              <Select value={heuristic} onValueChange={(value: any) => setHeuristic(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select heuristic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                  <SelectItem value="blocking">Blocking Pieces</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}