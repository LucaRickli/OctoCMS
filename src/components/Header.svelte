<script lang="ts">
  import { User } from "../store/session";

  export let height = 48
</script>

<header
  style="height: {height}px"
  class="sticky top-0 flex gap-2 w-full [&>*]:m-1 bg-gray-200"
>
  <slot />

  <a href="#/profile" class="!ml-auto">
    <img
      class="rounded"
      style="height: {height - 8}px; width: {height - 8}px;"
      src={$User.avatar_url} 
      alt="{$User.name}"
    >
  </a>
</header>
