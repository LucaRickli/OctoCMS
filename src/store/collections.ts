import { get } from "svelte/store";

import { Octo } from "./session";
import { Backend } from "./config";
import { internalCollectionFileSet, type CollectionType } from "./schema";

export async function getCollectionFiles(collection: CollectionType) {
  const files =
    collection.type === "file"
      ? internalCollectionFileSet.parse(collection.files)
      : collection.type === "dir"
      ? (
          await get(Octo).rest.repos.getContent({
            ...get(Backend).git,
            path: collection.path,
          })
        ).data
      : void 0;

  if (!Array.isArray(files)) throw new Error("Expected files to be a array!");

  return files;
}
