<script lang="ts">
  import z, { date } from "zod";

  import type { GetZodType } from "../store/schema";
  import { getCollection, getFile, getFileInfo, getFileVersions } from "../store/collections";
  import { Base64, formatBytes, getRef, mdRegex, parseFrontmatter } from "../lib/utils";
  import NotFound from "./notFound.svelte";
  import Error from "../components/Error.svelte";
  import Loading from "../components/Loading.svelte";
  import Header from "../components/Header.svelte";
  import Breadcrumbs from "../components/Breadcrumbs.svelte";
  import Markdown from "../components/Markdown.svelte";
  import { get, writable } from "svelte/store";
  
  const refSchema = z.object({
    collection: z.string(),
    filename: z.string(),
    sha: z.string().optional(),
  })
  
  interface Data {
    ref: GetZodType<typeof refSchema>
    file: Awaited<ReturnType<typeof getFileInfo>>
    versions: Awaited<ReturnType<typeof getFileVersions>>
    parsed: ReturnType<typeof parseFrontmatter>
  }

  const loading = writable<Promise<any>>()
  const data = writable<Data | undefined>()
  
  window.addEventListener("hashchange", () => loading.set(new Promise(async (resolve) => {
    const ref = getRef<GetZodType<typeof refSchema>>(refSchema)
    if (!ref) return data.set(undefined)

    const state = get(data)

    if (!state || (state && (state.ref.collection !== ref?.collection || state.ref.filename !== ref.filename))) {
      await load()
    }

    let file: Awaited<ReturnType<typeof getFileInfo>> | Awaited<ReturnType<typeof getFile>> | undefined  = state?.file

    if (!file) {
      const collection = getCollection(ref?.collection)
      if (!collection) return data.set(undefined)
      file = await getFile(collection, ref.filename)
    }

    if (!file) return data.set(undefined)
    
    const fileInfo = await getFileInfo(file.path, ref?.sha)

    data.update((d) => ({
      ...d, 
      file: fileInfo,
      parsed: parseFrontmatter(Base64.decode(fileInfo.content)),
      ref
    } as Data))

    resolve(void 0)
  })))

  async function load() {
    const ref = getRef<GetZodType<typeof refSchema>>(refSchema)
    if (!ref) return undefined;

    const collection = getCollection(ref.collection)
    if (!collection) return undefined;
    
    const file = await getFile(collection, ref.filename)
    if (!file) return undefined;
    
    const fileInfo = await getFileInfo(file.path, ref?.sha)
    const versions = await getFileVersions(file.path)

    data.set({
      ref,
      versions,
      file: fileInfo,
      parsed: parseFrontmatter(Base64.decode(fileInfo.content)),
    })
  }

  loading.set(load())
</script>

<Header>
  <a 
    class="border px-3 py-1.5 rounded-lg"
    href="#/edit?ref={Base64.urlEncode($data?.ref || "")}"
  >
    Edit
  </a>
</Header>
<Breadcrumbs 
  items={[
    { name: "Collections"},
    { name: $data?.ref?.collection || "undefined" }, 
    { name: $data?.ref?.filename.replace(mdRegex, "").replace(/-|_/gm, " ") || "undefined", capitalize: true }
  ]}
/>

<main>
  {#await $loading}
    <Loading />
  {:then}
    {#if $data}
      <table class="table-auto">
        <tbody>
          <tr>
            <th>Path</th>
            <td>{$data.file.path}</td>
          </tr>
          <tr>
            <th>SHA</th>
            <td>{$data.file.sha}</td>
          </tr>
          <tr>
            <th>Size</th>
            <td>{formatBytes($data.file.size)}</td>
          </tr>
        </tbody>
      </table>

      {#if $data.versions}
        <h1 class="text-xl font-bold">Versions</h1>
        <hr>

        <table class="table-auto table-selectable">
          <thead>
            <tr>
              <th>Author</th>
              <th>Date</th>
              <th>Message</th>
              <th class="sr-only">Tags</th>
            </tr>
          </thead>

          <tbody>
            {#each $data.versions as version,index}
              <tr class:non-selectable={$data?.ref?.sha ? version.sha === $data.ref.sha : index === 0}>
                <td>
                  <a href="#/file?ref={Base64.urlEncode({ ...$data?.ref, sha: version.sha })}">
                    <img class="h-6 w-6 rounded ml-4" src={version.committer?.avatar_url} alt={version.committer?.login}>
                    <title>{version.committer?.login}</title>
                  </a>
                </td>
                <td>
                  <a href="#/file?ref={Base64.urlEncode({ ...$data?.ref, sha: version.sha })}">
                    {version.commit.author?.date ? new Date(version.commit.author?.date).toLocaleString() : ""}
                  </a>
                </td>
                <td>
                  <a href="#/file?ref={Base64.urlEncode({ ...$data?.ref, sha: version.sha })}">
                    {version.commit.message}
                  </a>
                </td>
                <td>
                  <a href="#/file?ref={Base64.urlEncode({ ...$data?.ref, sha: version.sha })}">
                    {#if index === 0}
                      <span class="tag tag-green">Latest</span>
                    {/if}
                    {#if $data?.ref?.sha ? version.sha === $data?.ref.sha : index === 0}
                      <span class="tag tag-blue">Selected</span>
                    {/if}
                  </a>
                </td>
              </tr>
            {/each}
            <tr></tr>
          </tbody>
        </table>
      {/if}

      {#if $data.parsed.frontmatter}
        <h1 class="text-xl font-bold">Content</h1>
        <hr>

        <table class="table-auto">
          <tbody>
            {#each Object.entries($data.parsed.frontmatter) as [key,value]}
              <tr>
                <th class="capitalize">{key}</th>
                <td>{value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      <div class="p-2 h-[720px] overflow-y-scroll border rounded prose">
        <Markdown content={$data.parsed.content} />
      </div>

      <hr class="py-2 m-0">

      <div class="m-2">
        <a 
          class="border px-3 py-1.5 rounded-lg"
          href="#/edit?ref={Base64.urlEncode($data?.ref || "")}"
        >
          Edit
        </a>
      </div>

      <div class="overflow-hidden">{JSON.stringify($data, null, 2)}</div>
    {:else}
      <NotFound />
    {/if}
  {:catch err}
    <Error {err} />
  {/await}
</main>
