import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MyCustomPaginatorIntl } from '../mat-custom-paginator-intl';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-pokemon-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    FormsModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
  templateUrl: './pokemon-table.component.html',
  styleUrls: ['./pokemon-table.component.css'],
})

export class PokemonTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'url'];
  dataSource!: MatTableDataSource<Pokemon>;

  filter: string | Pokemon = '';
  options: Pokemon[] = [];
  filteredOptions!: Observable<Pokemon[]>;

  pokemonsPaginated: Pokemon[] = [];
  pokemonsPaginatedAux: Pokemon[] = [];
  totalElements: number;
  page: number;
  pageSize: number;
  query: any;
  loading: boolean;

  totalPokemons: number;
  pokemonSelected: Pokemon | undefined;
  @Output() showTableAlphabet = new EventEmitter<any>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private pokemonService: PokemonService
  ) {

    this.dataSource = new MatTableDataSource(this.pokemonsPaginated);
    this.totalElements = 0;
    this.page = 0;
    this.pageSize = 10;
    this.totalPokemons = 0;
    this.loading = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllPokemonsPaginated(this.query);
  }

  applyFilter() {
    if (typeof this.filter === 'string' && this.filter.length) {
      this.filteredOptions = of(this.options).pipe(
        map(value => this._filter(value))
      );
    } else if(typeof this.filter === 'string' && this.filter.length === 0){
      this.getPokemonsByPagination({
        pageIndex: 0,
        pageSize: 10
      });

      this.filteredOptions = of([]);
    }
  }

  private _filter(pokemons: Pokemon[]): any {
    if(typeof this.filter === 'string' && this.filter.length)
      return pokemons.filter(pokemon => pokemon.name.toLowerCase().startsWith(this.filter as string));
    return [];
  }

  selectPokemonAutocomplete() {
    this.findPokemon(this.filter as Pokemon);
  }

  displayName(data: any) {
    return data ? data.name : undefined;
  }

  private getAllPokemonsPaginated(query: any) {
    this.loading = true;
    this.pokemonService.getAllPaginated(query).subscribe(
      response => {
        if (response.results) {
          this.pokemonsPaginated = response.results;
          this.totalElements = response.count;
          this.page = query ? query.page : 0;
          this.pageSize = query ? query.limit : 10;
          this.dataSource = new MatTableDataSource(this.pokemonsPaginated);

          this.loading = false;

          if (this.totalPokemons === 0) {
            this.totalPokemons = response.count;
            this.getAllPokemons();
          }
        }
      }
    );
  }

  private getAllPokemons() {
    this.pokemonService.getAll(this.totalPokemons).subscribe(
      response => {
        this.options = response.results;
        this.showTableAlphabet.emit(this.options);
      }
    );
  }

  getPokemonsByPagination(event: any) {
    this.query = {
      page: event.pageIndex,
      offset: (event.pageIndex * event.pageSize),
      limit: event.pageSize
    };
    this.getAllPokemonsPaginated(this.query);
  }

  findPokemon(pokemon: Pokemon) {
    this.loading = true;
    this.dataSource.paginator?.firstPage();
    this.pokemonsPaginatedAux = this.pokemonsPaginated;

    this.pokemonService.getByName(pokemon.url).subscribe(response => {
      this.pokemonsPaginated = [pokemon];
      this.totalElements = 1;
      this.dataSource = new MatTableDataSource(this.pokemonsPaginated);
      this.loading = false;
    });
  }

  showPokemonDetail(row: Pokemon) {
    this.pokemonSelected = row;
    this.pokemonService.savePokemon(row);
  }
}
