import type { Item } from "./item.ts";
import type { Edge } from "./edge.ts";

export interface Context<I extends string | undefined, E extends string | undefined, Ip extends boolean = false, Ep extends boolean = false> {
  item: Item<I, Ip>
  edges: Edge<E, Ep>[]
}

export interface Path {
  vertices: Item<undefined>[]
  edges: Edge<undefined>[]
}