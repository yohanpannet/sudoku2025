export interface SudokuCell {
    value: number;
    startsValues: boolean;
}

export interface SudokuGrid {
    cells: SudokuCell[];
}