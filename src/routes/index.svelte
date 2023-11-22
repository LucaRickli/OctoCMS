<script lang="ts">
  import { writable } from "svelte/store";
  import { Collections } from "../store/config";

  const selected = writable<string>()
</script>

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

<table class="table-auto w-full border">
  <thead>
    <tr>
      <th>Name</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    {#each $Collections as collection}
    <tr class="table-separator">
      <td class="!p-0">
        <a href="#">{collection.name}</a>
      </td>
      <td class="!p-0">
        <a href="#">-</a>
      </td>
    </tr>
    {/each}
  </tbody>
</table>
