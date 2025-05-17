import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { performance } from 'perf_hooks';
import { parsePuzzle } from './utils/parser';


import { ucs } from './algorithms/ucs';
import { greedy } from './algorithms/greedy';
import { aStar } from './algorithms/a_star';

import { boardToString, printSolution } from './utils/printer';

async function getFilePath(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter the puzzle filename (e.g., sample1.txt): ', (answer) => {
      rl.close();
      const filePath = path.resolve(__dirname, '../test', answer.trim());
      resolve(filePath);
    });
  });
}

async function main() {
  // Determine file path (CLI arg has priority)
  const filePath = process.argv[2]
    ? path.resolve(__dirname, '../test', process.argv[2])
    : await getFilePath();

  // Parse
  let board;
  try {
    board = parsePuzzle(filePath);
  } catch (err: any) {
    console.error('Error parsing:', err.message);
    process.exit(1);
  }

  const t0 = performance.now();
  const { solution, nodesExpanded } = ucs(board);
  const t1 = performance.now();

  if (solution) {
    printSolution(solution);
    console.log('Nodes expanded (Greedy):', nodesExpanded);
    console.log('Time:', (t1 - t0).toFixed(3), 'ms');
  } else {
    console.log('No solution found.');
  }
}

main();
