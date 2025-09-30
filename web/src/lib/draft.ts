import { get, set, del } from "idb-keyval";

const KEY = "pfax:draft";
export const draft = {
  load: () => get(KEY),
  save: (v: any) => set(KEY, { v, t: Date.now() }),
  clear: () => del(KEY),
};


