import { Pokemon } from "./pokemon";

export interface Response {
  count: number,
  next?: string,
  previous?: string,
  results: Pokemon[];
}
