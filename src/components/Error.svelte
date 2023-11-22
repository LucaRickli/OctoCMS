<script lang="ts">
  import { ZodError } from "zod";

  export let err: unknown
</script>

{#if err instanceof ZodError}
<section class="overflow-x-scroll pb-3">
  <slot name="zod_title">
    <h1 class="font-semibold text-2xl mb-2">Configuration error!</h1>
  </slot>
  
  <table class="table-auto w-full overflow-x-scroll">
    <thead>
      <tr>
        <th>Path</th>
        <th>Message</th>
        <th>Type</th>
      </tr>
    </thead>

    <tbody>
      {#each err.issues as issue}
        <tr class="table-separator">
          <td class="whitespace-nowrap">{issue.path?.join('.')}</td>
          <td class="whitespace-nowrap">{issue.message}</td>
          {#if issue.code === "invalid_type" || issue.code === "invalid_literal"}
          <td class="whitespace-nowrap">{issue.expected}</td>
          {/if}
          {#if issue.code === "too_small"}
          <td class="whitespace-nowrap">{issue.type} &#62; {issue.minimum}</td>
          {/if}
        </tr>

        {#if issue.code === "invalid_union"}
        {#each issue.unionErrors as unionErr, index}
        <tr>
          <td class="!pl-5 whitespace-nowrap">
            Union {index + 1}
          </td>
        </tr>
        {#each unionErr.issues as unionIssue}
        <tr>
          <td class="!pl-10 whitespace-nowrap">{unionIssue.path?.join('.')}</td>
          <td class="whitespace-nowrap">{unionIssue.message}</td>
          {#if unionIssue.code === "invalid_type" || unionIssue.code === "invalid_literal"}
          <td class="whitespace-nowrap">{unionIssue.code === "invalid_literal" ? JSON.stringify(unionIssue.expected) : unionIssue.expected}</td>
          {/if}
          {#if unionIssue.code === "too_small"}
          <td class="whitespace-nowrap">{unionIssue.type} &#62; {unionIssue.minimum}</td>
          {/if}
        </tr>
        {/each}
        {/each}
        {/if}

        {#if issue.code === "invalid_return_type"}
        {#each issue.returnTypeError.issues as returnIssue}
        <!-- <tr>
          <td>
            {JSON.stringify(returnIssue)}
          </td>
        </tr> -->

        <tr>
          <td class="pl-5 whitespace-nowrap">{returnIssue.path?.join('.')}</td>
          <td class="whitespace-nowrap">{returnIssue.message}</td>
          {#if returnIssue.code === "invalid_type" || returnIssue.code === "invalid_literal"}
          <td class="whitespace-nowrap">{returnIssue.code === "invalid_literal" ? JSON.stringify(returnIssue.expected) : returnIssue.expected}</td>
          {/if}
          {#if returnIssue.code === "too_small"}
          <td class="whitespace-nowrap">{returnIssue.type} &#62; {returnIssue.minimum}</td>
          {/if}
        </tr>
        {/each}
        {/if}
      {/each}
    </tbody>
  </table>
</section>

{:else if err instanceof Error}

<slot name="error_title">
  <h1 class="font-semibold text-2xl mb-2">Critical error!</h1>
</slot>
<div class="flex gap-2 items-baseline font-semibold">
  <h1>{err.name}:</h1>
  <p>{err.message}</p>
</div>
{#if err.cause}
<p>{err.cause}</p>
{/if}
{#if err.stack}
<p class="m-2">{err.stack}</p>
{/if}

{:else}

<slot name="title">
  <h1 class="font-semibold text-2xl mb-2">Critical error!</h1>
</slot>

<p>{JSON.stringify(err, null, 2)}</p>
{/if}

