import { createAction, props } from "@ngrx/store";
import { SudokuGrid } from "../model/SudokuCell";

export const loadGrid = createAction('[App Component] LoadGrid', props<SudokuGrid>());