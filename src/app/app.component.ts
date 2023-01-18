import { Component } from '@angular/core';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokemons';
  pokemonDetail: Pokemon | undefined;
  pokemons: Pokemon[] | undefined;

  showPokemon(data: Pokemon) {
    this.pokemonDetail = data;
  }

  showTableAlphabet(data: Pokemon[]) {
    this.pokemons = data;
  }
}
