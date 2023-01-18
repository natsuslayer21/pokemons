import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../pokemon';

import {MatCardModule} from '@angular/material/card';
import { PokemonService } from '../pokemon.service';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';


@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnChanges {

  @Input()
  pokemon!: Pokemon;

  pokemonDetail: any;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 100;

  loading: boolean = true;

  constructor(private pokemonService: PokemonService) {}

  ngOnChanges(): void {
    this.loading = true;
    this.pokemonService.getByName(this.pokemon.url).subscribe(
      response => {
        this.pokemonDetail = response;
        this.loading = false;
      }
    );
  }

  getImage(pokemon: any) {
    let imageUrl = pokemon.sprites.other.dream_world.front_default;

    if (!pokemon.sprites.other.dream_world.front_default && pokemon.sprites.front_default)
      return pokemon.sprites.front_default;

    if (!pokemon.sprites.other.dream_world.front_default && !pokemon.sprites.front_default)
      return '../../assets/not-found.png';

    return imageUrl;
  }
}
