import { Component, Input } from '@angular/core';
import { SudokuCell } from '../../../model/SudokuCell';

@Component({
    selector: 'app-sudoku-uicell',
    imports: [],
    templateUrl: './sudoku-uicell.html',
    host: {
        '[class.starter]': 'cell.startsValues'
    },
    styleUrl: './sudoku-uicell.scss',
    standalone: true,

})
export class SudokuUICell {

    @Input({ required: true }) cell: SudokuCell = {
        index: 0,
        startsValues: false,
        value: 0,
        remain: new Map(),
    };

    protected numbers = [1,2,3,4,5,6,7,8,9];

    constructor() {

    }
}
