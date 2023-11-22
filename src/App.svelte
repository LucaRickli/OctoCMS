<script lang="ts">
  import Router from 'svelte-spa-router'

  import type { BackendOptions, CMSOptions, CollectionsOptions } from "./store/schema";
  import { initCofing } from "./store/config";
  import { initSession } from "./store/session";
  import Error from "./components/Error.svelte";
  import Index from './routes/index.svelte';
  
  const routes = {
    "/": Index
  }

  export let backend: BackendOptions;
  export let collections: CollectionsOptions;

  // const validateConfig = (): Promise<CMSOptions> => cmsOptions.parseAsync({ backend, collections })
  async function init(): Promise<CMSOptions> {
    const cfg = initCofing({ backend, collections })
    await initSession(cfg.backend)
    return cfg
  }
</script>

<main class="p-4">
  {#await init()}
  <div>Loading ...</div>
  {:then}
  <Router {routes} />
  {:catch err}
    <Error {err} />
  {/await}
</main>



