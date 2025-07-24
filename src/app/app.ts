import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetReader } from './asset-reader';
import { MatSelectModule } from '@angular/material/select';
import { emptySudokuGrid, SudokuCell, SudokuGrid } from './model/SudokuCell';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SudokuUICell } from './widget/sudokuUICell/sudoku-uicell/sudoku-uicell';
import { AsyncPipe } from '@angular/common';
import { loadGrid } from './store/grid.action';
import { logColor } from './utils/logger';
import { selectCells, selectGrid } from './store/grid.selectors';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSelectModule,
        SudokuUICell,
        AsyncPipe
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    private assetReader = inject(AssetReader);
    private store = inject(Store<{ grid: SudokuGrid }>);

    protected readonly title = signal('sudoku2025');

    protected grids: SudokuGrid[] = [];

    protected selectedGrid$: Observable<SudokuGrid> = this.store.select<SudokuGrid>(selectGrid);
    protected cells$: Observable<SudokuCell[]> = this.store.select<SudokuCell[]>(selectCells);

    constructor(){
    }

    ngOnInit(): void {
        this.assetReader.getGridList().subscribe(grids => this.grids = grids);
        this.selectedGrid$.subscribe(grid => {
            logColor('SELCTED GRID STORE', 'red')
            console.log(grid)
        })
        this.cells$.subscribe(cells => {
            logColor('SELCTED CELLS STORE', 'red')
            if (cells) {
                cells.forEach(cell => logColor(`got cell ${cell.value}`, 'green'))
            }
        })
    }

    onGridSelectionChange(grid: SudokuGrid) {
        this.store.dispatch(loadGrid(grid));
    }
}
