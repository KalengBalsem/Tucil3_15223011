import { NextRequest, NextResponse } from 'next/server';
import { parsePuzzle } from '../../../../src/utils/parser';
// import { solveRushHour } from '../../../../src/algorithms/a_star'; // or whichever algorithm you want

// export async function POST(req: NextRequest) {
//     const { puzzle } = await req.json();
//     try {
//         const board = parsePuzzle(puzzle);
//         const solution = solveRushHour(board);
//         return NextResponse.json({ solution });
//     } catch (err: any) {
//         return NextResponse.json({ error: err.message }, { status: 400 });
//     }
// }