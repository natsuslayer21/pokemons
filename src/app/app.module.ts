import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PokemonService } from './pokemon.service';
import { PokemonTableComponent } from "./pokemon-table/pokemon-table.component";
import { PokemonDetailComponent } from "./pokemon-detail/pokemon-detail.component";
import { HttpClientModule } from '@angular/common/http';
import { PokemonAlphabetComponent } from './pokemon-alphabet/pokemon-alphabet.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        PokemonService
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        PokemonTableComponent,
        PokemonDetailComponent,
        PokemonAlphabetComponent,
        HttpClientModule
    ]
})
export class AppModule { }
