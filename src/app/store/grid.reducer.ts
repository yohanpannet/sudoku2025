import { createReducer, on } from "@ngrx/store";
import { loadGrid, updateCell } from "./grid.action";
import { emptySudokuGrid, SudokuGrid } from "../model/SudokuCell";

export interface SudoKuGridState {
    grid: SudokuGrid
}

export const initialGridState = {
    grid: emptySudokuGrid
};

export const gridReducer = createReducer(
    initialGridState,
    on(loadGrid, (state, grid) => (
        {...state, grid})),
    on(updateCell, (state, cell) => {
        let newCells = [...state.grid.cells]
        newCells[cell.index] = cell
        return {
            ...state,
            grid: {
                ...state.grid,
                cells: newCells,
            }
        }
    })
);