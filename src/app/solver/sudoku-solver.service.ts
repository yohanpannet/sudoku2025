import { inject, Injectable } from "@angular/core";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { Store } from "@ngrx/store";
import { firstValueFrom, Observable, take, tap } from "rxjs";
import { selectGrid } from "../store/grid.selectors";
import { logColor } from "../utils/logger";
import { updateCell } from "../store/grid.action";
import { GridHandler } from "./grid-handler";
import { isGridValid } from "./grid-validator";

@Injectable({
    providedIn: 'root'
})
export class SudokuSolver {
    private store = inject(Store<{ grid: SudokuGrid }>);
    protected selectedGrid$: Observable<SudokuGrid> = this.store.select<SudokuGrid>(selectGrid);
    

    async clearGrid() {
        let updateCount = await this.updateRemaining();
        let grid = await this.getSelectedGrid();
        updateCount += this.setSolvedCells(grid)

        if (updateCount > 0) {
            this.clearGrid();
        } else {
            if (isGridValid(grid)) {
                logColor(`Houray!!!!  SudoSolved `, 'darkBlue')
            } else {
                logColor('End Of ClearGrid - Not solved :( ', 'darkred')
            }
        }   

    }

    private async updateRemaining(): Promise<number> {
        let updateCount = 0;
        let grid = await this.getSelectedGrid();
        updateCount += this.clearZones(grid, 'line')
        grid = await this.getSelectedGrid();
        updateCount += this.clearZones(grid, 'col')
        grid = await this.getSelectedGrid();
        updateCount += this.clearZones(grid, 'block')

        return updateCount
    }

    async doZoneSingles() {
        await this.updateRemaining();
        let updateCount = 0;
        let grid = await this.getSelectedGrid();
        updateCount += this.spotZoneSingles(grid, 'line')
        await this.updateRemaining();
        grid = await this.getSelectedGrid();
        updateCount += this.spotZoneSingles(grid, 'col')
        await this.updateRemaining();
        grid = await this.getSelectedGrid();
        updateCount += this.spotZoneSingles(grid, 'block')
        logColor(`doZoneSingles - ${updateCount}`, 'darkgreen')
        await this.updateRemaining();
        if (updateCount > 0) {
            await this.doZoneSingles()
        } else {
            if (isGridValid(grid)) {
                logColor(`Houray!!!!  SudoSolved `, 'darkBlue')
            } else {
                logColor('End Of doZoneSingles - Not solved :( ', 'darkred')
            }

        }
    }

    private getSelectedGrid(): Promise<SudokuGrid> {
        return firstValueFrom(this.selectedGrid$)
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

