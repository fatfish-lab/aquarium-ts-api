export interface ItemData {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  name?: string;
}

export interface Item<T extends string | undefined, P extends boolean | undefined = false> {
  _key: string;
  _id: `items/${Item<T>["_key"]}`;
  _rev: string;
  type: T;
  data: ItemData;
  createdFrom?: string;
  createdBy: P extends true ? Item<"User"> : string;
  createdAt: string;
  updatedBy: P extends true ? Item<"User"> : string;
  updatedAt: string;
  history?: ItemHistory<T>[];
}

export interface ItemHistory<T extends string | undefined> extends Item<T> {
  [key: string]: unknown;
  originalKey: string;
  message: string;
}

export interface User extends Item<"User"> {}
export interface Bot extends Item<"Bot"> {}
