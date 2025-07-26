import { SudokuGrid, SudokuCell } from "../model/SudokuCell";
import { logColor } from "../utils/logger";

export class GridHandler {
    private grid: SudokuGrid;

    constructor(inputGrid: SudokuGrid) {
        // Deep Copy needed as to not alter state
        this.grid = this.deepCopyGrid(inputGrid)
    }

    private deepCopyGrid(inputGrid: SudokuGrid): SudokuGrid {
        let cells = inputGrid.cells.map(cell => {
            return {
                ...cell,
                remain: new Map(cell.remain)
            }

        })
        return {
            ...inputGrid,
            cells
        }
    }

    //Common functions
    private clearCells(cell: SudokuCell, emptyCells: SudokuCell[]) {
        return emptyCells
            .filter(emptyCell => emptyCell.remain.get(cell.value))
            .map(emptyCell => {
                emptyCell.remain.set(cell.value, false);
                return emptyCell
            })
    }

    private getEmptyCells(cells: SudokuCell[]): SudokuCell[] {
        return cells.filter(cell=>cell.value === 0)
    }

    clearZones(zone: 'line'|'col'|'block'): Map<number, SudokuCell> {
        let filledCells = this.grid.cells.filter(cell => cell.value != 0)
        let updatedCells: Map<number, SudokuCell> = new Map();
        filledCells.forEach(filledCell => {
            let zoneCells: SudokuCell[] = [];
            switch (zone) {
                case 'line': 
                    zoneCells = this.getLine(filledCell.index);
                    break;
                case 'col':
                    zoneCells = this.getColumn(filledCell.index);
                    break;
                case 'block':
                    zoneCells = this.getBlock(filledCell.index);
                    break;
            }
            let emptyCells = this.getEmptyCells(zoneCells)
            this.clearCells(filledCell, emptyCells)
                .forEach( cell => updatedCells.set(cell.index, cell))
        })
        return updatedCells;
    }

    private getLine(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => Math.floor(cell.index/9) === Math.floor(cellIndex/9));
    }

    private getColumn(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => cell.index%9 === cellIndex%9);
    }

    private getBlock(cellIndex: number): SudokuCell[] {
        let cellIndexes: number[] = [];
        blockHandler.blockCellIndexes.forEach((indexes, blockNumber) => {
            if (indexes.some((index) => index === cellIndex)) {
                cellIndexes = indexes;
            }
        })
        let cells = cellIndexes.map(index => this.grid.cells[index]);
        return cells;
    }

    setSolvedCells() : SudokuCell[]{
        logColor('SetSolvedCells', 'darkred')
        let solvedCells = this.grid.cells
            .filter(cell => cell.value === 0)
            .filter(cell => { //filter cells that have only 1 remain at true
                let trueCount = 0;
                let lastTrue = 0
                cell.remain.forEach((val, num) => {
                    if (val) {
                        trueCount++;
                        lastTrue = num
                    }
                })
                if (trueCount === 1) {
                    cell.value = lastTrue;
                    return true;
                } else {
                    return false
                }
            })
        
        return solvedCells;
    }

}

const blockIndexMatrix = [0, 1, 2, 9, 10, 11, 18, 19, 20]

/**
 * Returns a Map of Block index & corresponding list of cells indexes.
 * eg: entrie 0 returns all cells in 1st block (eg: 0, 1, 2, 9, 10, 11, 18, 19, 20)
 */
function generateBlockCellIndexes(): Map<number, number[]>{
    let indexMap = new Map<number, number[]>();
    for (let i = 0; i<9; i++) {
        let topLeftIndex = getTopLeftIndex(i);
        let cellIndexes = blockIndexMatrix.map(index => index + topLeftIndex);
        indexMap.set(i, cellIndexes);
    }
    return indexMap;
}

/**
 * the top left index of block i is equal to 'a*9+b*3'
 * where b = i%3 and a = i-b
 * @param i 
 */
function getTopLeftIndex(i: number): number {
    let b = i%3;
    let a = i-b;
    return (a*9+b*3);
}

const blockHandler = {
    blockCellIndexes: generateBlockCellIndexes(),
}