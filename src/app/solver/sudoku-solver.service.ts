import { inject, Injectable } from "@angular/core";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { Store } from "@ngrx/store";
import { Observable, take, tap } from "rxjs";
import { selectGrid } from "../store/grid.selectors";
import { logColor } from "../utils/logger";
import { updateCell } from "../store/grid.action";
import { GridHandler } from "./grid-handler";

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
        await this.getSelectedGrid().pipe(
            tap(grid => this.clearBlocks(grid))
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

    private clearBlocks(grid: SudokuGrid) {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.clearBlocks();
        logColor(`Clear Blocks length: ${updatedCells.size}`, 'green')
        console.log(updatedCells)
        updatedCells.forEach((value) => {
            this.store.dispatch(updateCell(value))
        })
    }
}

