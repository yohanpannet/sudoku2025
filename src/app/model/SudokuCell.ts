export interface SudokuCell {
    index: number,
    value: number;
    startsValues: boolean;
    remain:Map<number,boolean>,
}

export interface SudokuGrid {
    cells: SudokuCell[];
}


export const remainAll = new Map([
    [1,true],
    [2,true],
    [3,true],
    [4,true],
    [5,true],
    [6,true],
    [7,true],
    [8,true],
    [9,true],
])

export const emptySudokuGrid: SudokuGrid = getEmptyGrid();

function getEmptyGrid(): SudokuGrid {
    let grid: SudokuGrid = {
        cells: []
    }
    for (let i = 0; i<81; i++) {
        grid.cells.push({
            index: i,
            value: 0,
            startsValues: false,
            remain: new Map()
        })
    }
    return grid;
}