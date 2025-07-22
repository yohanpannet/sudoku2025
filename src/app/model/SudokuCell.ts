export interface SudokuCell {
    value: number;
    startsValues: boolean;
}

export interface SudokuGrid {
    cells: SudokuCell[];
}

export const emptySudokuGrid: SudokuGrid = getEmptyGrid();

function getEmptyGrid(): SudokuGrid {
    let grid: SudokuGrid = {
        cells: []
    }
    for (let i = 0; i<81; i++) {
        grid.cells.push({
            value: 0,
            startsValues: false
        })
    }
    return grid;
}