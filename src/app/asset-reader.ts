import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AssetReader {

    private http = inject(HttpClient);
    
    getGridList() {
        this.http.get('GridList.sdm', {responseType: 'text'})
            .subscribe(data => {
                console.log('HTTP get public')
                console.log(data);
                })
        
    }
}
