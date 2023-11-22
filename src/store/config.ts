import { writable } from "svelte/store";
import {
  cmsOptions,
  type BackendOptions,
  type CMSOptions,
  type CollectionsOptions,
} from "./schema";

export const Backend = writable<BackendOptions>();
export const Collections = writable<CollectionsOptions>();

export function initCofing(config: CMSOptions): CMSOptions {
  console.time("initConfig");

  const { backend, collections } = cmsOptions.parse(config);
  Backend.set(backend);
  Collections.set(collections);

  console.timeEnd("initConfig");
  return { backend, collections };
}
