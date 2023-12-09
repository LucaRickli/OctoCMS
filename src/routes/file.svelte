<script lang="ts">
  import Error from "../components/Error.svelte";
  import { getCollection, getFile, getFileInfo } from "../store/collections";
  import NotFound from "./notFound.svelte";

  const query = new URLSearchParams(location.hash?.split("?")[1])
  const collection = getCollection(decodeURIComponent(query.get('collection') || ""))
  const filename = decodeURIComponent(query.get('name') || "")
</script>

{#if collection}
  {#await getFile(collection, filename)}
    <div>Loading...</div>  
  {:then file}
    {#if file}
      {#await getFileInfo(file.path)}
        <div>Loading...</div>  
      {:then fileinfo}
        <div>{collection.name}</div>
        <div>{JSON.stringify({ file, fileinfo }, null, 2)}</div>
      {:catch err}
        <Error {err} />
      {/await}
    {:else}
      <NotFound />
    {/if}
  {:catch err}
    <Error {err} />
  {/await}
{:else}
  <NotFound />
{/if}
