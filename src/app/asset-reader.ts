import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { logColor } from './utils/logger';
import { remainAll, SudokuCell, SudokuGrid } from './model/SudokuCell';
import { filter, map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AssetReader {

    private http = inject(HttpClient);

    getGridList(): Observable<SudokuGrid[]> {
        return this.http.get('GridList.sdm', { responseType: 'text' })
            .pipe(
                map(data => this.convertToSudokuGrids(data)),
            )
    }

    private convertToSudokuGrids(data: string): SudokuGrid[] {
        let list = data.split('\n');
        let grids = list.filter(line => !line.startsWith('//'))
            .map<SudokuCell[]>(this.convertToSudokuCell)
            .map<SudokuGrid>(cells => {
                return {
                    cells: cells
                }
            })
        return grids;
    }

    private convertToSudokuCell(sdmLine: string): SudokuCell[] {
        return sdmLine.split('')
            .map<SudokuCell>(value => {
                let intValue = parseInt(value);
                if (Number.isNaN(intValue)) {
                    intValue = 0
                }
                let cell: SudokuCell = {
                    value: intValue,
                    startsValues: intValue != 0
                }; 
                if (!cell.startsValues) {
                    cell.remain = {...remainAll}
                }
                return cell; 
            })
    }
}
