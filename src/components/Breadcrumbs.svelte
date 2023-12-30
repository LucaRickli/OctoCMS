<script lang="ts">
  interface BreadcrumbItem {
    name: string,
    path?: string,
    capitalize?: boolean
  }

  export let items: BreadcrumbItem[] = []
</script>


<nav>
  <ol class="flex items-center whitespace-nowrap my-2 mx-3" aria-label="Breadcrumb">
    <li class="inline-flex items-center">
      <a 
        class="flex items-center text-sm" 
        class:font-semibold={items.length === 0}
        href="#/"
      >
        Home
      </a>

      {#if items.length > 0}
        <svg class="flex-shrink-0 h-5 w-5 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"/>
        </svg>
      {/if}
    </li>

    {#each items as item,index}
      {#if index === (items.length - 1)}
        <li 
          class="inline-flex items-center text-sm font-semibold truncate" 
          class:capitalize={item.capitalize}
          aria-current="page"
        >
          {item.name}
        </li>
      {:else}
        <li class="inline-flex items-center">
          <a 
            class="flex items-center text-sm" 
            class:capitalize={item.capitalize}
            href={item.path}
          >
            {item.name}
            <svg class="flex-shrink-0 h-5 w-5 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"/>
          </svg>
          </a>
        </li>
      {/if}
    {/each}
  </ol>
</nav>

<!-- <nav class="my-2 mx-3 overflow-x-scroll" aria-label="Breadcrumb">
  <ol class="flex items-center gap-1 md:gap-2">
    <li>
      <div class="flex items-center">
        <svg 
          class="w-3 h-3 me-2"
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
          />
        </svg>

        <a 
          href="#/"
          class="text-sm font-medium"
        >
          Home
        </a>
      </div>

    </li>

    {#each items as item,index}
      <li 
        aria-current="{index === (items.length - 1) ? "page" : "false"}"
      >
        <div class="flex items-center">
          <svg 
            class="rtl:rotate-180 w-3 h-3 mx-1" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 6 10"
          >
            <path 
              stroke="currentColor" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="m1 9 4-4-4-4"
            />
          </svg>

          <a 
            href={item.path} 
            class="ms-1 text-sm font-medium md:ms-2"

          >
            {item.name}
          </a>
        </div>
      </li>
    {/each}
  </ol>
</nav> -->