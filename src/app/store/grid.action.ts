import { createAction, props } from "@ngrx/store";
import { SudokuCell, SudokuGrid } from "../model/SudokuCell";

export const loadGrid = createAction('[App Component] LoadGrid', props<SudokuGrid>());
export const updateCell = createAction('[SudokuSolver Service] updateCell', props<SudokuCell>())