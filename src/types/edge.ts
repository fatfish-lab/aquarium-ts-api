import type { Item } from "./item.ts";

export interface EdgeData {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  name?: string;
}

export interface Edge<T extends string | undefined> {
  _key: string;
  _id: `connections/${Edge<T>["_key"]}`;
  _from: Item<''>["_id"];
  _to: Item<''>["_id"];
  _rev: string;
  type: T;
  data: EdgeData;
  createdFrom?: string;
  createdBy: string | Item<"User">;
  createdAt: string;
  updatedBy: string | Item<"User">;
  updatedAt: string;
}