import { writable } from "svelte/store";

import {
  cmsOptions,
  type BackendOptions,
  type CmsOptions,
  type CollectionsOptions,
  type StorageOptions,
} from "./schema";

export const Backend = writable<BackendOptions>();
export const Collections = writable<CollectionsOptions>();
export const Storage = writable<StorageOptions>();

export function initCofing(config: object): CmsOptions {
  console.time("initConfig");

  const cfg = cmsOptions.parse(config);
  Backend.set(cfg.backend);
  Collections.set(cfg.collections);

  console.timeEnd("initConfig");
  return cfg;
}
