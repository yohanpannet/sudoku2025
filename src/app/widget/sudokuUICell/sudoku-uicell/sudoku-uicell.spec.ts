import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuUICell } from './sudoku-uicell';

describe('SudokuUICell', () => {
  let component: SudokuUICell;
  let fixture: ComponentFixture<SudokuUICell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SudokuUICell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SudokuUICell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
