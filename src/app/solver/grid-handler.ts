import { SudokuGrid, SudokuCell, remainNone } from "../model/SudokuCell";
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

    private getLines(): SudokuCell[][] {
        let lines = [];
        for(let i = 0; i <9; i++) {
            lines.push(this.getLine(i*9));
        }
        return lines;
    }

    private getColumn(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => cell.index%9 === cellIndex%9);
    }

    private getColumns(): SudokuCell[][] {
        let lines = [];
        for(let i = 0; i <9; i++) {
            lines.push(this.getColumn(i));
        }
        return lines;
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

    private getBlocks(): SudokuCell[][] {
        let lines = [
            this.getBlock(0), this.getBlock(3), this.getBlock(6),
            this.getBlock(27), this.getBlock(30), this.getBlock(33),
            this.getBlock(54), this.getBlock(57), this.getBlock(60)];
        
        return lines;
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
                    cell.remain = remainNone;
                    return true;
                } else {
                    return false
                }
            })
        
        return solvedCells;
    }

    /**
     * FOr each zone, search for values which has only 1 cell where it 'remains'.
     * @param zone 
     * @returns 
     */
    spotZonesSingles(zone: 'line'|'col'|'block'): Map<number, SudokuCell> { 
        let updatedCells: Map<number, SudokuCell> = new Map();
        let zones: SudokuCell[][] = [];
            switch (zone) {
                case 'line': 
                    zones = this.getLines();
                    break;
                case 'col':
                    zones = this.getColumns();
                    break;
                case 'block':
                    zones = this.getBlocks();
                    break;
            }
        logColor(`spotZonesSingles - ${zone}`,'darkred')
        zones.forEach(zone => {
            this.spotZoneSingles(zone).forEach(singleCell => {
                updatedCells.set(singleCell.index, singleCell)
            })
        })
        logColor(`spotZonesSingles ${zone} - ${updatedCells.size}`, 'darkred')
        return updatedCells;
    }

    private spotZoneSingles(cells: SudokuCell[]): SudokuCell[] {
        let singleCells: SudokuCell[] = [];
        let empties = this.getEmptyCells(cells);
        // i is the value we search
        for (let i = 1; i<=9; i++) {
            let remainingFor = this.getRemainingFor(i, empties);
            if (remainingFor.length === 1) {
                let cell = remainingFor[0];
                cell.value = i;
                cell.remain = remainNone;
                singleCells.push(cell);
                logColor(`Single Cell spotted: ${cell.index}, ${cell.value}`, 'darkgreen')
            }
        }
        return singleCells;
    }

    private getRemainingFor(value: number, cells: SudokuCell[]): SudokuCell[] {
        return cells.filter(cell => cell.remain.get(value));
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