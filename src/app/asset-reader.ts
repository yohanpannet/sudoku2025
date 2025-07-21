import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { logColor } from './utils/logger';

@Injectable({
    providedIn: 'root'
})
export class AssetReader {

    private http = inject(HttpClient);
    
    getGridList() {
        this.http.get('GridList.sdm', {responseType: 'text'})
            .subscribe(data => {
                console.log(data);
            })
        
    }
}
