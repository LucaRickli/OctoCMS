<script lang="ts">
  import { HtmlRenderer, Parser } from "commonmark";

  export let content: string

  const parser = new Parser()
  const htmlRenderer = new HtmlRenderer()
</script>

{@html htmlRenderer.render(parser.parse(content))}
