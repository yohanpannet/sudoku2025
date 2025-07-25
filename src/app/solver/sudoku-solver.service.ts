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

    private clearZones(zone: 'line'|'col'|'block'): Map<number, SudokuCell> {
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
                    //zoneCells = this.getBlock(filledCell.index);
                    break;
            }
            let emptyCells = this.getEmptyCells(zoneCells)
            this.clearCells(filledCell, emptyCells)
                .forEach( cell => updatedCells.set(cell.index, cell))
        })
        return updatedCells;
    }

    // Lines
    clearLines(): Map<number, SudokuCell> {
        return this.clearZones('line');
    }

    private getLine(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => Math.floor(cell.index/9) === Math.floor(cellIndex/9));
    }

    //Cols
    clearCols(): Map<number, SudokuCell> {
        return this.clearZones('col');
    }

    private getColumn(cellIndex: number): SudokuCell[] {
        return this.grid.cells.filter(cell => cell.index%9 === cellIndex%9);
    }

    //blocks
    clearBlocks(): Map<number, SudokuCell> {
        return this.clearZones('block');
    }

}