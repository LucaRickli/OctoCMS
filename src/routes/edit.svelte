<script lang="ts">
  import type { IScrollEvent } from "monaco-editor";
  import { writable } from "svelte/store";
  import z from "zod";

  import type { GetZodType } from "../store/schema";
  import { Base64, getRef, parseFrontmatter } from "../lib/utils";
  import { getCollection, getFile, getFileInfo } from "../store/collections";
  import Error from "../components/Error.svelte";
  import NotFound from "./notFound.svelte";
  import Editor from "../components/Editor.svelte";
  import Loading from "../components/Loading.svelte";
  import Header from "../components/Header.svelte";
  import Markdown from "../components/Markdown.svelte";

  const refSchema = z.object({
    collection: z.string(),
    filename: z.string()
  })
  
  let previewNode: HTMLDivElement

  const content = writable<string>()
  const frontmatter = writable<object>()
  
  async function load() {
    const ref = getRef<GetZodType<typeof refSchema>>(refSchema)
    if (!ref) return undefined;
    
    const collection = getCollection(ref.collection)
    if (!collection) return undefined;
    
    const file = await getFile(collection, ref.filename)
    if (!file) return undefined;
    
    const fileinfo = await getFileInfo(file.path)
    const data = parseFrontmatter(Base64.decode(fileinfo.content))
    content.set(data.content)
    if (data.frontmatter) frontmatter.set(data.frontmatter)

    return fileinfo
  }

  function syncScroll(ev: CustomEvent<IScrollEvent>, node: HTMLElement) {
    node.scrollTo(
      node.scrollLeft, 
      (node.scrollHeight / 100) * (ev.detail.scrollTop / (ev.detail.scrollHeight / 100))
    )
  }
</script>

<Header></Header>

<main>
  <section 
    class="!p-0 h-[calc(100%-48px)] relative overflow-hidden grid gap-2"
    style="grid-template-columns: repeat(2, auto);"
  >
    {#await load()}
      <Loading />
    {:then}
      {#if $content}
        <div 
          class="resize-x overflow-hidden border-r h-[calc(100%-48px)]"
          style="width: calc(50vw - 4px); border-color: #dcdcdb;"
        >
          <Editor
            content={$content}
            on:change={(ev) => content.set(ev.detail)}
            on:scroll={(ev) => syncScroll(ev, previewNode)}
          />
        </div>

        <div
          class="prose overflow-y-scroll overflow-x-hidden pb-[100vh]"
          bind:this={previewNode}
        >
          <Markdown content={$content} />
        </div>
        <!-- <div>{JSON.stringify({ fileinfo }, null, 2)}</div> -->
      {:else}
          <NotFound />
      {/if}
    {:catch err}
      <Error {err} />
    {/await}
  </section>
</main>
