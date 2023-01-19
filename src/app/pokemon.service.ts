import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pokemon } from './pokemon';
import { Response } from './response';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  protected urlAll: string = 'https://pokeapi.co/api/v2/pokemon';
  private pokemon: BehaviorSubject<Pokemon> = new BehaviorSubject({} as Pokemon);
  pokemon$ = this.pokemon.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getAllPaginated(query: any): Observable<Response> {
    let getUrl = this.urlAll + `?offset=0&limit=10`;
    if (query)
      getUrl = this.urlAll + `?offset=${query.offset}&limit=${query.limit}`;
    return this.http.get<Response>(getUrl);
  }

  getAll(total: number): Observable<Response> {
    let getUrl = this.urlAll + `?offset=0&limit=${total}`;
    return this.http.get<Response>(getUrl);
  }

  getByName(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  savePokemon(data: Pokemon) {
    this.pokemon.next(data);
  }
}
