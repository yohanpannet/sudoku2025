import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetReader } from './asset-reader';
import { MatSelectModule } from '@angular/material/select';
import { SudokuGrid } from './model/SudokuCell';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSelectModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  private assetReader = inject(AssetReader);
  protected readonly title = signal('sudoku2025');

  protected grids: SudokuGrid[] = [];

  ngOnInit(): void {
    this.assetReader.getGridList().subscribe(grids => this.grids = grids);
  }

  onGridSelectionChange(grid: SudokuGrid) {
    console.log(grid)
  }
}
