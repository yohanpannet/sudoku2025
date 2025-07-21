import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetReader } from './asset-reader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  private assetReader = inject(AssetReader);
  protected readonly title = signal('sudoku2025');

  ngOnInit(): void {
    console.log(`%c App OnInit`, 'color: lime')
    this.assetReader.getGridList();
  }
}
