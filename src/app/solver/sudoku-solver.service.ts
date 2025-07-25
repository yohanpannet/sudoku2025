import { inject, Injectable } from "@angular/core";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { selectGrid } from "../store/grid.selectors";
import { logColor } from "../utils/logger";

@Injectable({
    providedIn: 'root'
})
export class SudokuSolver {
    private store = inject(Store<{ grid: SudokuGrid }>);
    protected selectedGrid$: Observable<SudokuGrid> = this.store.select<SudokuGrid>(selectGrid);
    

    clearGrid() {
        this.selectedGrid$.pipe(
            take(1)
        ).subscribe(grid => {
            this.clearLines(grid)
        })
    }

    private clearLines(grid: SudokuGrid) {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.clearLines();
        logColor(`Clear Cells length: ${updatedCells.size}`, 'green')
        console.log(updatedCells)
    }
}

class GridHandler {
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

    clearLines(): Map<number, SudokuCell> {
        let filledCells = this.grid.cells.filter(cell => cell.value != 0)
        let updatedCells: Map<number, SudokuCell> = new Map();
        filledCells.forEach(filledCell => {
            let cells = this.clearLine(filledCell);
            cells.forEach( cell => updatedCells.set(cell.index, cell))
        })
        return updatedCells;
    }

    clearLine(cell: SudokuCell): SudokuCell[] {
        let emptyCells = this.getLineEmptyCell(cell.index);
        return emptyCells
            .filter(emptyCell => emptyCell.remain.get(cell.value))
            .map(emptyCell => {
                emptyCell.remain.set(cell.value, false);
                return emptyCell
            })
    }

    getLine(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => Math.floor(cell.index/9) === Math.floor(cellIndex/9));
    }

    getLineEmptyCell(cellIndex: number): SudokuCell[] {
        let cells = this.getLine(cellIndex);
        return this.getEmptyCells(cells);
    }

    getEmptyCells(cells: SudokuCell[]): SudokuCell[] {
        return cells.filter(cell=>cell.value === 0)
    }

    getColumn(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => cell.index%9 === cellIndex%9);
    }
}