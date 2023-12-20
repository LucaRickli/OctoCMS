<script lang="ts">
  import z from "zod";
  import { HtmlRenderer, Parser } from 'commonmark'
  import type { IScrollEvent } from "monaco-editor";

  import { getCollection, getFile, getFileInfo } from "../store/collections";
  import { Base64, getRef, parseFrontmatter } from "../lib/utils";
  import Error from "../components/Error.svelte";
  import NotFound from "./notFound.svelte";
  import type { GetZodType } from "../store/schema";
  import Editor from "../components/Editor.svelte";
  import { writable } from "svelte/store";

  const refSchema = z.object({
    collection: z.string(),
    filename: z.string()
  })
  
  let editor: Editor
  let previewNode: HTMLDivElement

  const content = writable<string>()
  const frontmatter = writable<object>()
  const parser = new Parser()
  const htmlRenderer = new HtmlRenderer()
  
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

  function syncScroll(ev: CustomEvent<IScrollEvent>) {
    previewNode.scrollTo(
      previewNode.scrollLeft, 
      (previewNode.scrollHeight / 100) * (ev.detail.scrollTop / (ev.detail.scrollHeight / 100))
    )
  }
</script>

{#await load()}
  <div>Loading...</div>
{:then}
  {#if $content}
    <section class="!p-0 h-full relative overflow-hidden flex gap-2">
      <div 
        class="resize-x overflow-hidden border-r" 
        style="width: calc(50vw - 4px); border-color: #dcdcdb;"
      >
        <Editor
          content={$content}
          bind:this={editor}
          on:change={(ev) => content.set(ev.detail)}
          on:scroll={syncScroll}
        />
      </div>
      
      <div
        class="prose overflow-y-scroll pb-10"
        style="width: calc(50vw - 4px);"
        bind:this={previewNode}
      >
        {@html htmlRenderer.render(parser.parse($content))}
      </div>
    </section>
    <!-- <div>{JSON.stringify({ fileinfo }, null, 2)}</div> -->
  {:else}
    <NotFound />
  {/if}
{:catch err}
  <Error {err} />
{/await}
