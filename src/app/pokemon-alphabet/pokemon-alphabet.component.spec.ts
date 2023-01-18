import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonAlphabetComponent } from './pokemon-alphabet.component';

describe('PokemonAlphabetComponent', () => {
  let component: PokemonAlphabetComponent;
  let fixture: ComponentFixture<PokemonAlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokemonAlphabetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonAlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
