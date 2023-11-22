import * as z from "zod";

export type GetZodType<T extends import("zod").ZodType> = ReturnType<
  T["parse"]
>;

export type SessionOptions = GetZodType<typeof sessionOptions>;
export const sessionOptions = z.object({
  storage: z.instanceof(Storage).default(sessionStorage),
  key: z.string().default("cms:octo:token"),
});

export type BackendOptions = GetZodType<typeof backendOptions>;
export const backendOptions = z.object({
  repo: z.string(),
  owner: z.string(),
  baseUrl: z.string().optional(),
  session: sessionOptions.default({}),
  auth: z.function().returns(
    z
      .string()
      .min(1)
      .or(z.promise(z.string().min(1)))
  ),
});

export type Frontmatter = GetZodType<typeof frontmatter>;
export const frontmatter = z.record(z.string(), z.instanceof(z.ZodType));

export type BaseCollection = GetZodType<typeof baseCollection>;
export const baseCollection = z.object({
  frontmatter: frontmatter.optional(),
  name: z.string().min(1),
});

export type CollectionFile = GetZodType<typeof collectionFile>;
export const collectionFile = z.object({
  path: z.string().min(1),
  name: z.string().min(1),
});

export type FileCollection = GetZodType<typeof fileCollection>;
export const fileCollection = z
  .object({
    type: z.literal("file"),
    files: z.array(collectionFile).min(1),
    actions: z
      .object({
        delete: z.boolean().optional(),
      })
      .optional(),
  })
  .and(baseCollection);

export type FolderCollection = GetZodType<typeof folderCollection>;
export const folderCollection = z
  .object({
    type: z.literal("dir"),
    path: z.string().min(1),
    actions: z
      .object({
        delete: z.boolean().optional(),
        create: z.boolean().optional(),
      })
      .optional(),
  })
  .and(baseCollection);

export type CollectionType = GetZodType<typeof collectionType>;
export const collectionType = z.union([fileCollection, folderCollection]);

export type CollectionsOptions = GetZodType<typeof collectionsOptions>;
export const collectionsOptions = z.array(collectionType).min(1);

export interface CMSOptions {
  backend: BackendOptions;
  collections: CollectionsOptions;
}
export const cmsOptions = z.object({
  backend: backendOptions,
  collections: collectionsOptions,
});
