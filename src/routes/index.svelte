<script lang="ts">
  import { get, writable } from "svelte/store";
  import { Collections } from "../store/config";
  import { getCollectionFiles } from "../store/collections";
  import { formatBytes } from "../lib/utils";

  const selected = writable<string>()
  const files = writable<Awaited<ReturnType<typeof getCollectionFiles>> | undefined>()

  selected.subscribe(async (sel) => {
    console.log({ selected: sel })
    const collection = get(Collections).find(i => i.name === sel)    
    files.set(!collection ? undefined : await getCollectionFiles(collection))
  })
</script>


<!-- <ul class="p-2">
  {#each $Collections as collection, index}
  <li 
    class="font-bold list-disc mx-3"
    class:text-blue-600={$selected === index}
    >
    <button
      on:click={() => $selected = index}
      on:keydown={() => $selected = index}
    >
      {collection.name}
    </button>
  </li>
  {/each}
</ul> -->

<select 
  bind:value={$selected} 
  name="collection" 
  id="collection_select"
  class="selector my-2"
>
  {#each $Collections as collection}
  <option value={collection.name}>{collection.name}</option>
  {/each}
</select>

<div class="overflow-x-scroll">
  <table class="table-auto w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Path</th>
        <th>Size</th>
      </tr>
    </thead>
    <tbody>
      {#if $files}
      {#each $files as file}
        <tr class="table-separator">
          <td>{file.name}</td>
          <td>{file.path}</td>
          {#if file.type === "internal_file"}
          <td>-</td>
          {:else}
          <td>{formatBytes(file.size)}</td>
          {/if}
        </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>
