import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { logColor } from './utils/logger';
import { SudokuCell } from './model/SudokuCell';

@Injectable({
    providedIn: 'root'
})
export class AssetReader {

    private http = inject(HttpClient);
    
    getGridList() {
        this.http.get('GridList.sdm', {responseType: 'text'})
            .subscribe(data => {
                console.log(data);
                let list = data.split('\n');
                list.filter(line => !line.startsWith('//'))
                    .map<SudokuCell[]>(this.convertToSudokuCell)
                    .forEach(el => console.log(el))
            })
        
    }

    private convertToSudokuCell(sdmLine: string): SudokuCell[] {
        return sdmLine.split('')
            .map<SudokuCell>(value => {
                let intValue = parseInt(value);
                if ( Number.isNaN(intValue)) {
                    intValue = 0
                }
                return {
                    value: intValue,
                    startsValues: intValue!=0
                }
            })
    }
}
