import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { SudoKuGridState } from "./grid.reducer";

export const selectGridState = createFeatureSelector<SudoKuGridState>('sudoGrid')
export const selectGrid = createSelector(
    selectGridState,
    (gridState) => gridState.grid
)
export const selectCells = createSelector(
    selectGridState,
    (gridState) => gridState.grid.cells
)
