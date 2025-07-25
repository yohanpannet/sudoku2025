import { inject, Injectable } from "@angular/core";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { Store } from "@ngrx/store";
import { Observable, take, tap } from "rxjs";
import { selectGrid } from "../store/grid.selectors";
import { logColor } from "../utils/logger";
import { updateCell } from "../store/grid.action";

@Injectable({
    providedIn: 'root'
})
export class SudokuSolver {
    private store = inject(Store<{ grid: SudokuGrid }>);
    protected selectedGrid$: Observable<SudokuGrid> = this.store.select<SudokuGrid>(selectGrid);
    

    async clearGrid() {
        await this.getSelectedGrid().pipe(
            tap(grid => this.clearLines(grid))
        )
        .subscribe()
        await this.getSelectedGrid().pipe(
            tap(grid => this.clearCols(grid))
        ).subscribe()

    }

    private getSelectedGrid(): Observable<SudokuGrid> {
        return this.selectedGrid$.pipe(
            take(1)
        )
    }

    private clearLines(grid: SudokuGrid) {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.clearLines();
        logColor(`Clear Cells length: ${updatedCells.size}`, 'green')
        console.log(updatedCells)
        updatedCells.forEach((value) => {
            this.store.dispatch(updateCell(value))
        })
    }

    private clearCols(grid: SudokuGrid) {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.clearCols();
        logColor(`Clear Cols length: ${updatedCells.size}`, 'green')
        console.log(updatedCells)
        updatedCells.forEach((value) => {
            this.store.dispatch(updateCell(value))
        })
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

    clearCols(): Map<number, SudokuCell> {
        let filledCells = this.grid.cells.filter(cell => cell.value != 0)
        let updatedCells: Map<number, SudokuCell> = new Map();
        filledCells.forEach(filledCell => {
            let cells = this.clearCol(filledCell);
            cells.forEach( cell => updatedCells.set(cell.index, cell))
        })
        return updatedCells;
    }

    clearCol(cell: SudokuCell): SudokuCell[] {
        let emptyCells = this.getColEmptyCell(cell.index);
        return emptyCells
            .filter(emptyCell => emptyCell.remain.get(cell.value))
            .map(emptyCell => {
                emptyCell.remain.set(cell.value, false);
                return emptyCell
            })
    }

    getColEmptyCell(cellIndex: number): SudokuCell[] {
        let cells = this.getColumn(cellIndex);
        return this.getEmptyCells(cells);
    }

    getColumn(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => cell.index%9 === cellIndex%9);
    }
}