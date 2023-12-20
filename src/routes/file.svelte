<script lang="ts">
  import z from "zod";

  import Error from "../components/Error.svelte";
  import { getCollection, getFile, getFileInfo } from "../store/collections";
  import NotFound from "./notFound.svelte";
  import { Base64, getRef } from "../lib/utils";
  import type { GetZodType } from "../store/schema";

  const refSchema = z.object({
    collection: z.string(),
    filename: z.string()
  })
  
  async function load() {
    const ref = getRef<GetZodType<typeof refSchema>>(refSchema)  
    if (!ref) return undefined;
    
    const collection = getCollection(ref.collection)
    if (!collection) return undefined;
    
    const file = await getFile(collection, ref.filename)
    if (!file) return undefined;
    
    return {
      fileinfo: await getFileInfo(file.path),
      ref
    }
  }
</script>

{#await load()}
  <div>Loading...</div>
{:then data}
  {#if data}
    <div>{data.ref.collection}</div>

    <div class="m-2">
      <a 
        class="border px-3 py-1.5 rounded-lg"
        href="#/edit?ref={Base64.urlEncode(data.ref)}"
      >
        Edit
      </a>
    </div>

    <div>{JSON.stringify(data.fileinfo, null, 2)}</div>
  {:else}
    <NotFound />
  {/if}
{:catch err}
  <Error {err} />
{/await}
