import type { Item } from "./item.ts";

export interface EdgeData {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  name?: string;
}

export interface Edge<T extends string | undefined, P extends boolean | undefined = false> {
  _key: string;
  _id: `connections/${Edge<T, P>["_key"]}`;
  _from: Item<undefined>["_id"];
  _to: Item<undefined>["_id"];
  _rev: string;
  type: T;
  data: EdgeData;
  createdFrom?: string;
  createdBy: P extends true ? Item<"User"> : string;
  createdAt: string;
  updatedBy: P extends true ? Item<"User"> : string;
  updatedAt: string;
}