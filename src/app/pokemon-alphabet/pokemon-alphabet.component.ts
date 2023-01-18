import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pokemon } from '../pokemon';
import { Alphabet } from '../alphabet';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokemon-alphabet',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pokemon-alphabet.component.html',
  styleUrls: ['./pokemon-alphabet.component.css']
})
export class PokemonAlphabetComponent implements OnChanges {
  displayedColumns: string[] = ['letter', 'total'];
  dataSource!: MatTableDataSource<Alphabet>;

  @Input() pokemons: Pokemon[] | undefined;
  list: any[] | undefined;
  alphabetList: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z' ];

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 100;
  loading: boolean | undefined;

  ngOnChanges() {
    let total = 0;
    this.loading = true;
    if (this.pokemons?.length) {
      this.list = this.alphabetList.map(
        (letter) => {
          total = 0;
          if (this.pokemons?.some(x => x.name.startsWith(letter.toLowerCase()))) {
            total = this.pokemons?.filter(y => y.name.startsWith(letter.toLowerCase())).length;
          }
          return {
            letter,
            total
          }
        }
      )

      this.loading = false;
      this.dataSource = new MatTableDataSource(this.list);
    }
  }

}
