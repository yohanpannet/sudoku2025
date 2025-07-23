export interface SudokuCell {
    value: number;
    startsValues: boolean;
    remain?:Remain,
}

export interface SudokuGrid {
    cells: SudokuCell[];
}

export interface Remain {
    '1':boolean,
    '2':boolean,
    '3':boolean,
    '4':boolean,
    '5':boolean,
    '6':boolean,
    '7':boolean,
    '8':boolean,
    '9':boolean,
}

export const remainAll: Remain = {
    '1':true,
    '2':true,
    '3':true,
    '4':true,
    '5':true,
    '6':true,
    '7':true,
    '8':true,
    '9':true,
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