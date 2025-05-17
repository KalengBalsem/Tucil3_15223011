#!/usr/bin/env node
import { parsePuzzle } from './utils/parser';
import path from 'path';
import readline from 'readline';

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const getFilePath = (): Promise<string> => {
        return new Promise((resolve) => {
            rl.question('Enter the puzzle filename (e.g., test1.txt): ', (answer) => {
                rl.close();
                const filePath = path.resolve(__dirname, '../test', answer.trim());
                resolve(filePath);
            });
        });
    };

    const filePath = process.argv[2]
        ? path.resolve(__dirname, '../test', process.argv[2])
        : await getFilePath();
    try {
        const board = parsePuzzle(filePath);
        console.log('Parsed board successfully!');
        console.log('Serialized state:', board.serialize());
        console.log(`Primary piece at: row=${board.primary.row}, col=${board.primary.col}`);
        console.log(`Exit at: row=${board.exitRow}, col=${board.exitCol}`);
    } catch (err: any) {
        console.error('Error parsing:', err.message);
        process.exit(1);
    }
}

main();
