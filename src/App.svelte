<script lang="ts">
  import Router from 'svelte-spa-router'

  import type { BackendOptions, CmsOptions, CollectionsOptions } from "./store/schema";
  import { initCofing } from "./store/config";
  import { initSession } from "./store/session";
  import Error from "./components/Error.svelte";
  import Index from './routes/index.svelte';
  import NotFound from './routes/notFound.svelte';
  import Collection from './routes/collection.svelte';
  import File from './routes/file.svelte';
  
  const routes = {
    "/": Index,

    "/collection": Collection,

    "/file": File,

    "*": NotFound
  }

  export let backend: BackendOptions;
  export let collections: CollectionsOptions;

  async function init(): Promise<CmsOptions> {
    const cfg = initCofing({ backend, collections })
    await initSession(cfg.backend)
    return cfg
  }
</script>

<main>
  {#await init()}
    <div>Loading...</div>
  {:then}
    <Router {routes} />
  {:catch err}
    <Error {err} />
  {/await}
</main>



