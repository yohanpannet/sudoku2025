import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetReader } from './asset-reader';
import { MatSelectModule } from '@angular/material/select';
import { emptySudokuGrid, SudokuCell, SudokuGrid } from './model/SudokuCell';
import { concatMap, map, Observable, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { SudokuUICell } from './widget/sudokuUICell/sudoku-uicell/sudoku-uicell';
import { AsyncPipe } from '@angular/common';
import { loadGrid } from './store/grid.action';
import { logColor } from './utils/logger';
import { selectCells, selectGrid } from './store/grid.selectors';
import { MatButtonModule } from '@angular/material/button';
import { SudokuSolver } from './solver/sudoku-solver.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSelectModule,
        MatButtonModule,
        SudokuUICell,
        AsyncPipe
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    private assetReader = inject(AssetReader);
    private store = inject(Store<{ grid: SudokuGrid }>);
    private sudokuSolverService = inject(SudokuSolver)

    protected readonly title = signal('sudoku2025');
    private TIMER_VALUE = 25;

    protected grids: SudokuGrid[] = [];

    protected selectedGrid$: Observable<SudokuGrid> = this.store.select<SudokuGrid>(selectGrid);
    protected cells$: Observable<SudokuCell[]> = this.store.select<SudokuCell[]>(selectCells);
    protected cellsDelay$: Observable<SudokuCell[]> = this.cells$.pipe(
        concatMap(value =>
            timer(this.TIMER_VALUE).pipe( // wait 500ms before emitting each value
                map(() => value)
            )
        )) 

    constructor(){
    }

    ngOnInit(): void {
        this.assetReader.getGridList().subscribe(grids => this.grids = grids);
        this.selectedGrid$.subscribe(grid => {
            //logColor('>SELCTED GRID STORE', 'red')
            //console.log(grid)
        })
        this.cells$.subscribe(cells => {
            //logColor('SELCTED CELLS STORE', 'red')
            //console.log(cells)
        })
    }

    onGridSelectionChange(grid: SudokuGrid) {
        this.store.dispatch(loadGrid(grid));
    }

    clearCells() {
        console.log('clear')
        this.sudokuSolverService.clearGrid()
    }

    doZoneSingles() {
        this.sudokuSolverService.doZoneSingles()
    }
}
