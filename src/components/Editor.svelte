<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
  import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

  const dispatch = createEventDispatcher()
  const observer = new ResizeObserver(() => resizeEditor())

  export let content: string; 
  let editorEl: HTMLDivElement;
  let Monaco: typeof import("monaco-editor");
  let editor: ReturnType<typeof import("monaco-editor").editor.create>;


  self.MonacoEnvironment = {
    getWorker: function (_moduleId, label) {
      switch (label) {
        case "json": 
          return new jsonWorker();
        case "css" || "scss" || "less": 
          return new cssWorker();
        case "html" || "handlebars" || "razor": 
          return new htmlWorker();
        case "typescript" || "javascript": 
          return new tsWorker();
        default: 
          return new editorWorker();
      }
    },
  };

  async function loadEditor() {
    Monaco = Monaco 
      ? Monaco
      : await import("monaco-editor")

    editor = Monaco.editor.create(editorEl, {
      value: "/* Loading... */",
      language: "markdown",
      theme: "vs-light",
      minimap: {
        enabled: false
      },
      lineNumbers: "off",
      wordWrap: "on",
      readOnly: false,
      fontSize: 15
    });
    
    editor.onDidChangeModelContent(() => {
      dispatch("change", editor.getValue());
    });

    editor.setValue(content)
    editor.onDidScrollChange((ev) => dispatch("scroll", ev))

    window.requestAnimationFrame(resizeEditor);

    if (editorEl.parentElement) {
      console.log('observing parent element', editorEl.parentElement)
      observer.observe(editorEl.parentElement)
    }
  }

  export function resizeEditor() {
    const rect = editorEl.getBoundingClientRect()
    editor.layout({ width: rect.width, height: rect.height });
  }

  onMount(() => {
    // cleanup function
    return () => editor.dispose();
  });
</script>

<svelte:window
  on:resize={() => {
    editor.layout({ width: 0, height: 0 });
    window.requestAnimationFrame(resizeEditor);
  }}
/>

<div bind:this={editorEl} class="h-full w-full !p-0" />

{#await loadEditor()}
  <div class="h-full w-full absolute bg-white flex items-center justify-center">
    <div>
      Loading
    </div>
  </div>  
{/await}
