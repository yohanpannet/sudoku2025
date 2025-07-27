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
        let updateCount = await this.updateRemaining();
        await this.getSelectedGrid().pipe(
                tap(grid => {
                    updateCount += this.setSolvedCells(grid)
                })
            ).subscribe()

        if (updateCount > 0) {
            this.clearGrid();
        } else {
            logColor('End Of ClearGrid', 'darkred')
        }   

    }

    private async updateRemaining(): Promise<number> {
        let updateCount = 0;
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.clearZones(grid, 'line')
            })
        )
        .subscribe()
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.clearZones(grid, 'col')
            })
        ).subscribe()
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.clearZones(grid, 'block')
            })
        ).subscribe()

        return updateCount
    }

    async doZoneSingles() {
        await this.updateRemaining();
        let updateCount = 0;
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.spotZoneSingles(grid, 'line')
            })
        ).subscribe();
        await this.updateRemaining();
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.spotZoneSingles(grid, 'col')
            })
        ).subscribe();
        await this.updateRemaining();
        await this.getSelectedGrid().pipe(
            tap(grid => {
                updateCount += this.spotZoneSingles(grid, 'block')
            })
        ).subscribe();
        logColor(`doZoneSingles - ${updateCount}`, 'darkgreen')
        await this.updateRemaining();
        if (updateCount > 0) {
            await this.doZoneSingles()
        } else {
            logColor('End Of ZoneSingles', 'darkred')

        }
    }

    private getSelectedGrid(): Observable<SudokuGrid> {
        return this.selectedGrid$.pipe(
            take(1)
        )
    }

    private clearZones(grid: SudokuGrid, zone: 'line'|'col'|'block'): number {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.clearZones(zone);
        // logColor(`Clear Cells length: ${updatedCells.size}`, 'green')
        // console.log(updatedCells)
        updatedCells.forEach((value) => {
            this.store.dispatch(updateCell(value))
        })
        return updatedCells.size;
    }

    private setSolvedCells(grid: SudokuGrid): number {
        let handler = new GridHandler({...grid});
        let updatedCells = handler.setSolvedCells();
        updatedCells.forEach((cell) => {
            this.store.dispatch(updateCell(cell))
        })
        return updatedCells.length;
    }

    private spotZoneSingles(grid: SudokuGrid, zone: 'line'|'col'|'block'): number {
        let handler = new GridHandler({...grid});
        logColor('spotZoneSingles', 'green')
        let updatedCells = handler.spotZonesSingles(zone);
        // logColor(`Clear Cells length: ${updatedCells.size}`, 'green')
        // console.log(updatedCells)
        updatedCells.forEach((value) => {
            this.store.dispatch(updateCell(value))
        })
        return updatedCells.size;
    }

}

