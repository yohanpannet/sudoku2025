import { Component, Input } from '@angular/core';
import { SudokuCell } from '../../../model/SudokuCell';

@Component({
  selector: 'app-sudoku-uicell',
  imports: [],
  templateUrl: './sudoku-uicell.html',
  styleUrl: './sudoku-uicell.scss',
  standalone: true,

})
export class SudokuUICell {

  @Input({required:true}) cell: SudokuCell = {
      startsValues: false,
      value: 0
    };

  constructor() {
    
  }
}
