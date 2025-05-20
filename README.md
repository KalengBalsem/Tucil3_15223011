# Rush Hour Puzzle Solver

This program solves the **Rush Hour sliding block puzzle** using pathfinding algorithms such as UCS, Greedy Best First Search, A*, and IDA*. The puzzle is read from a `.txt` file, and solutions can be visualized via CLI or Next.js-based web GUI.

## Features
- Solve Rush Hour puzzles with multiple algorithms
- Choose from three heuristics: Manhattan, Blocking Piece, Blocking Distance, Combined
- Colored CLI output
- Interactive Next.js GUI

## Project Structure
```
root/
├── src/         # Core solver logic (algorithms, heuristics, parser)
├── test/        # Puzzle test files (.txt)
├── web-ui/      # Next.js frontend interface
├── index.ts     # CLI entry point
└── README.md
```

## Puzzle Format
A puzzle `.txt` file must follow this structure:
```
6 6
11
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.
```
- `6 6`: Board width and height
- `11`: Number of vehicles
- Each subsequent line represents a board row

## 🚀 How to Run

### Option 1: CLI (Terminal)
1. **Install Dependencies** (from project root):
   ```bash
   npm install
   ```
2. **Run the Program**:
   ```bash
   npm start
   ```
   - Select algorithm (`ucs`, `greedy`, `astar`, `ida`)
   - Select heuristic (if applicable)
   - Enter puzzle file name (from `/test` folder)  
   **Example**:
   ```
   Enter the puzzle filename (e.g., test1.txt): test1.txt
   Pilih algoritma (ucs, greedy, astar, ida): astar
   Pilih heuristic (manhattan, blocking, combined): blocking
   ```

   Outputs board states, moves, nodes expanded, and time taken.

### Option 2: Local GUI (Next.js)
1. **Navigate to Web UI**:
   ```bash
   cd web-ui
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.  
   - Paste or upload puzzle text
   - Select algorithm and heuristic
   - View step-by-step solution animations

## Supported Algorithms
| Algorithm | Description |
|-----------|-------------|
| UCS       | Uniform Cost Search (optimal) |
| A*        | Heuristic + cost (optimal if admissible) |
| Greedy    | Heuristic only (not guaranteed optimal) |
| IDA*      | Iterative Deepening A* (space-efficient) |

## ✅ Sample CLI Output
```
Initial Board
AAB..F
..BCDF
GPPCDF
GH.III
GHJ...
LLJMM.

Move 1: D-up
AAB.DF
..BCDF
GPPC.F
GH.III
GHJ...
LLJMM.

...

Nodes expanded: 188
Time: 20.2 ms
```

## 🧑‍💻 Author
| Name           | NIM      | Class  |
|----------------|----------|--------|
| Asybel Bintang | 15223011 | K1 |