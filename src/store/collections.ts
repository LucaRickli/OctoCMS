import { get } from "svelte/store";

import { Octo } from "./session";
import { Backend, Collections } from "./config";
import { internalCollectionFileSet, type CollectionType } from "./schema";
import { mdRegex } from "../lib/utils";

export function getCollection(name: string) {
  return get(Collections).find((i) => i.name == name);
}

export async function getCollectionFiles(collection: CollectionType) {
  const files =
    collection.type === "file"
      ? internalCollectionFileSet.parse(collection.files)
      : collection.type === "dir"
      ? await get(Octo)
          .rest.repos.getContent({
            ...get(Backend).git,
            path: collection.path,
          })
          .then(({ data }) => {
            if (!Array.isArray(data)) {
              throw new Error("Expected files to be a array!");
            }

            return data.filter((i) => mdRegex.test(i.name));
          })
      : void 0;

  if (!Array.isArray(files)) throw new Error("Expected files to be a array!");

  return files;
}

export async function getFile(collection: CollectionType, fileName: string) {
  const files =
    collection.type === "dir"
      ? await getCollectionFiles(collection)
      : collection.files;

  return files.find((i) => i.name === fileName);
}

export async function getFileInfo(path: string) {
  return get(Octo)
    .repos.getContent({
      ...get(Backend).git,
      path,
    })
    .then(({ data }) => {
      if (Array.isArray(data) || data.type !== "file") {
        throw new Error("Expected file!");
      }
      return data;
    });
}
