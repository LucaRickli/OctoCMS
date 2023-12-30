<script lang="ts">
  import Router from 'svelte-spa-router'

  import type { BackendOptions, CmsOptions, CollectionsOptions, StorageOptions } from "./store/schema";
  import { initCofing } from "./store/config";
  import { initSession } from "./store/session";
  import Error from "./components/Error.svelte";
  import Index from './routes/index.svelte';
  import NotFound from './routes/notFound.svelte';
  import Collection from './routes/collection.svelte';
  import File from './routes/file.svelte';
  import Edit from './routes/edit.svelte';
  import Loading from './components/Loading.svelte';
  
  const routes = {
    "/": Index,

    "/collection": Collection,

    "/file": File,

    "/edit": Edit,

    "*": NotFound
  }

  export let backend: BackendOptions;
  export let collections: CollectionsOptions;
  export let storage: StorageOptions | undefined = undefined;

  async function init(): Promise<CmsOptions> {
    const cfg = initCofing({ backend, collections, storage })
    await initSession(cfg.backend, cfg.storage.session)
    return cfg
  }
</script>

{#await init()}
  <Loading />
{:then}
  <Router {routes} />
{:catch err}
  <main>
    <Error {err}>
      <h1 slot="zod_title">Configuration error!</h1>
    </Error>
  </main>
{/await}



