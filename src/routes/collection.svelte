<script lang="ts">
  // import { writable } from "svelte/store";
  import z from "zod";

  import NotFound from "./notFound.svelte";
  import Error from "../components/Error.svelte";
  import { getCollection, getCollectionFiles } from "../store/collections";
  import { /* formatBytes, */ Base64, getRef, mdRegex } from "../lib/utils";
  import type { GetZodType } from "../store/schema";

  const refSchema = z.object({
    name: z.string()
  })
  
  async function load() {
    const ref = getRef<GetZodType<typeof refSchema>>(refSchema)
    if (!ref) return undefined

    const collection = getCollection(ref.name)
    if (!collection) return undefined

    return {
      files: await getCollectionFiles(collection),
      collection,
      ref
    }
  }

  // const dialogOpen = writable<boolean>(false)
  // const selectedFile = writable<Awaited<ReturnType<typeof getCollectionFiles>>[0]>()
</script>


{#await load()}
  <div>Loading...</div>
{:then data}
  {#if data}
    <div class="m-2 flex items-baseline gap-2">
      <h1 class="font-bold text-lg">{data.ref.name}</h1>
      <!-- {#if collection.type === "dir"}
        <p class="ml-auto">{collection.path}</p>
      {/if} -->
    </div>
    
    <ul class="grid grid-auto-100 gap-2 justify-center sm:justify-normal">
      {#each data.files as file}
        <li class="aspect-square hover:bg-gray-200">
          <!-- <button
            on:click={() => {
              selectedFile.set(file)
              dialogOpen.set(true)
            }}
            class="w-full h-full flex items-center justify-center text-center"
          > -->
          <a href="#/file?ref={Base64.urlEncode({ collection: data.ref.name, filename: file.name })}"> <!-- ?collection={encodeURIComponent(collection.name)}&name={encodeURIComponent(file.name)}"> -->
            <div class="w-[86px] h-[86px] m-2 flex items-center justify-center flex-wrap">
              <!-- <svg class="h-12 mx-auto aspect-square" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
                <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2a12 12 0 0 0 11 7.1H524c4.7 0 9-2.8 11-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H641c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191l-83.2-191z" fill="currentColor" />
              </svg> -->
              <svg 
                class="h-12 mx-auto mb-0.5 aspect-square" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 1024 1024"
              >
                <title>{file.name.replace(mdRegex, "").replace(/-|_/gm, " ")}</title>
                <path 
                  d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z" 
                  fill="currentColor"
                />
              </svg>
    
              <h1 class="font-semibold text-xs text-center h-8 text-ellipsis overflow-hidden">
                {file.name.replace(mdRegex, "").replace(/-|_/gm, " ")}
              </h1>
            </div>
          </a>
          <!-- </button> -->
        </li>
      {/each}
    </ul>
  {:else}
    <NotFound />
  {/if}
{:catch err}
  <Error {err} />
{/await}


<!-- {#if collection}
  {#await getCollectionFiles(collection)}
    <div>loading...</div>
  {:then files}  -->

    <!-- <section class="md:grid grid-cols-3 grid-rows-1 gap-2 h-full">
      <div class="col-span-2 overflow-y-scroll h-full">
      </div>
      
      {#if $selectedFile}
        <details bind:open={$dialogOpen}>
          <summary class="sr-only hidden" />
          <div class="absolute md:relative top-0 left-0 p-4 md:p-0 h-full w-full bg-white overflow-y-scroll">
            <div class="flex border-b">
              <h1 class="font-medium text-lg justify-center">
                {$selectedFile.name.replace(mdRegex, "").replace(/-|_/gm, " ")}
              </h1>
              
              <button on:click={() => dialogOpen.set(false)} class="ml-auto">
                <svg
                  class="h-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  xmlns:xlink="http://www.w3.org/1999/xlink" 
                  viewBox="0 0 512 512"
                  >
                  <path 
                  d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z" 
                  fill="currentColor"
                  />
                </svg>
              </button>

            </div>

            <table class="table-auto">
              <tbody>
                <tr>
                  <th>Path</th>
                  <td>{$selectedFile.path}</td>
                </tr>
              </tbody>

            </table>

            <div>
              {JSON.stringify($selectedFile)}
            </div>
          </div>
        </details>
      {/if}
    </section> -->


    <!-- <table class="table-auto table-selectable">
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {#each files as file}
          <tr class="table-separator">
            <td class="h-6 w-6">
              <a href="#/file?collection={encodeURIComponent(collection.name)}&name={encodeURIComponent(file.name)}" class="!p-0">
                <svg class="h-full aspect-square" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
                  <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM429 481.2c-1.9-4.4-6.2-7.2-11-7.2h-35c-6.6 0-12 5.4-12 12v272c0 6.6 5.4 12 12 12h27.1c6.6 0 12-5.4 12-12V582.1l66.8 150.2a12 12 0 0 0 11 7.1H524c4.7 0 9-2.8 11-7.1l66.8-150.6V758c0 6.6 5.4 12 12 12H641c6.6 0 12-5.4 12-12V486c0-6.6-5.4-12-12-12h-34.7c-4.8 0-9.1 2.8-11 7.2l-83.1 191l-83.2-191z" fill="currentColor" />
                </svg>
              </a>
            </td>
            <td class="capitalize">
              <a href="#/file?collection={encodeURIComponent(collection.name)}&name={encodeURIComponent(file.name)}">
                {file.name.replace(mdRegex, "").replace(/-|_/gm, " ")}
              </a>
            </td>
            <td>
              <a href="#/file?collection={encodeURIComponent(collection.name)}&name={encodeURIComponent(file.name)}">
                {#if file.type === "internal_file"}
                  -
                {:else}
                  {formatBytes(file.size)}
                {/if}
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table> -->
  <!-- {:catch err}
    <Error {err} />
  {/await}
{:else}
  <NotFound />
{/if}
 -->

