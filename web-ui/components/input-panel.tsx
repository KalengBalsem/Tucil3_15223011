"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export default function InputPanel() {
  const [puzzleInput, setPuzzleInput] = useState("")

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
            <Button className="w-full">Load Puzzle</Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop your puzzle file here</p>
              <p className="text-xs text-gray-400">Supports .txt files</p>
            </div>
            <Button className="w-full">Upload File</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
