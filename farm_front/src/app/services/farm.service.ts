import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Farm } from './../models/Farm'
import { map, first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class FarmService {
  constructor(private http: HttpClient) {}

  create(farm: Farm) {
    return this.http.post<Farm>('http://localhost:3000/farms', farm);
  }

  read(id: number): Observable<Farm> {
    // return {} as any
    return this.http.get<Farm>(`http://localhost:3000/farms/${id}`);
  }

  list(): Observable<Farm[]> {
    return this.http.get<Farm[]>('http://localhost:3000/farms');
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/farms/${id}`)
  }

  editFarm(id: number, farm: Farm): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/farms/${id}`, farm)
  }

  getOwner(id: number) {
    return this.http.get<any>(`http://localhost:3000/owners/${id}`)
  }
}
