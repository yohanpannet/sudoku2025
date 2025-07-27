import { remainAll, SudokuCell, SudokuGrid } from "../model/SudokuCell";
import { logColor } from "../utils/logger";
import { GridHandler } from "./grid-handler";

export function isGridValid(grid: SudokuGrid): boolean {
    let handler = new GridHandler(grid);
    let isValid = true;
    let zones = handler.getLines()
        .concat(handler.getColumns())
        .concat(handler.getBlocks());
    logColor(`isGridValid ${zones.length}`, 'red')
    zones.forEach(zone => {
        isValid = isValid && isZoneValid(zone);
    })
    return isValid;
}



function isZoneValid(cells: SudokuCell[]): boolean {
    let remaining = new Map(remainAll);
    cells.forEach(cell => remaining.set(cell.value, false))
    let doesRemain = false;
    for (let r of remaining.values()) {
        doesRemain = doesRemain || r;
    }
    return !doesRemain;
}