<script lang="ts">
  import { Collections } from "../store/config";
  // import { get, writable } from "svelte/store";
  // import { getCollectionFiles } from "../store/collections";
  // import { formatBytes } from "../lib/utils";

  // const selected = writable<string>()
  // const files = writable<Awaited<ReturnType<typeof getCollectionFiles>> | undefined>()

  // selected.subscribe(async (sel) => {
  //   console.log({ selected: sel })
  //   const collection = get(Collections).find(i => i.name === sel)    
  //   files.set(!collection ? undefined : await getCollectionFiles(collection))
  // })
</script>


<ul class="grid grid-auto-100 gap-2">
  {#each $Collections as collection}
    <li class="aspect-square hover:bg-gray-200">
      <a 
        href="#/collection?name={encodeURIComponent(collection.name)}"
        class="w-full h-full flex items-center justify-center text-center"
      >
      <div class="w-[100px] p-2">
          <svg class="h-14 mx-auto aspect-square" version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
            <title>{collection.name}</title>
            <path fill="#FFA000" d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"/>
            <path fill="#FFCA28" d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"/>
          </svg>
          <h1 class="font-semibold text-xs h-5 whitespace-nowrap text-ellipsis overflow-hidden">
            {collection.name}
          </h1>
        </div>
      </a>
    </li>
  {/each}
</ul>




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

<!-- <select 
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
 -->