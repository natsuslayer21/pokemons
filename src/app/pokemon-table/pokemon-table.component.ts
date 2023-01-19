import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
    MatProgressBarModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
  templateUrl: './pokemon-table.component.html',
  styleUrls: ['./pokemon-table.component.css'],
})

export class PokemonTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'url'];
  dataSource!: MatTableDataSource<Pokemon>;

  filter = new FormControl();
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
    this.filteredOptions = this.filter.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filter.valueChanges.subscribe(
      response => {
        if (response === "") {
          this.getPokemonsByPagination({
            pageIndex: 0,
            pageSize: 10
          });

          this.showPokemonDetail({} as Pokemon);
        }
      }
    );

    this.getAllPokemonsPaginated(this.query);
  }

  private _filter(value: any): any {
    if (value.length || value === "") {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    } else if(Object.keys(value)) {
      this.findPokemon(value);
      return [];
    }
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
    this.page = 0;
    this.pageSize = 10;
    this.pokemonsPaginatedAux = this.pokemonsPaginated;

    this.pokemonService.getByName(pokemon.url).subscribe(response => {
      this.pokemonsPaginated = [pokemon];
      this.totalElements = 1;
      this.dataSource = new MatTableDataSource(this.pokemonsPaginated);
    });
  }

  showPokemonDetail(row: Pokemon) {
    this.pokemonSelected = row;
    this.pokemonService.savePokemon(row);
  }
}
