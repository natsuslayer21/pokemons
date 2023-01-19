import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../pokemon';

import { MatCardModule } from '@angular/material/card';
import { PokemonService } from '../pokemon.service';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit, OnDestroy {

  pokemon: Pokemon | undefined;

  pokemonDetail: any;

  loading: boolean = false;
  private pokemonServiceSubscription: Subscription | undefined;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonServiceSubscription = this.pokemonService.pokemon$.subscribe(
      response => {
        this.pokemon = response;
        if (Object.keys(response).includes('url')) {
          this.loading = true;
          this.pokemonService.getByName(this.pokemon.url).subscribe(
            response => {
              this.pokemonDetail = response;
              this.loading = false;
            }
          );
        }
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

  verifyPokemon() {
    return this.pokemonDetail ?? false;
  }

  ngOnDestroy(): void {
    this.pokemonServiceSubscription?.unsubscribe();
  }
}
