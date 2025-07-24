import { createReducer, on } from "@ngrx/store";
import { loadGrid } from "./grid.action";
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
        {...state, grid}))
);