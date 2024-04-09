<script lang="ts">
  import PlusStreamBtn from "$lib/components/PlusStreamBtn.svelte";
  import StreamSession from "$lib/components/StreamSession.svelte";
  import { streams } from "$lib/stores/streams.ts";
  import { onDestroy } from "svelte";
  import type { Stream } from "$lib/interfaces";
  import { addLog } from "$lib/stores/logs";
  import { page } from "$app/stores";
  import { getUserByName } from "$lib/stores/users";
  import { user } from "$lib/stores/auth";
  import { LogAction } from "$lib/interfaces/LogInterface";

  let name = $page.params.name;

  let stream: Stream = {
    title: name,
    truYouAccountName: name,
  };
  $streams.push(stream);

  onDestroy(() => {
    $streams = [];
    addLog(LogAction.STREAM_LEAVE);
  });
</script>

{#each $streams as stream, index}
  {#await getUserByName(stream.title)}
    <p>...waiting</p>
  {:then streamerData}
    <StreamSession streamer={streamerData} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  {#if index === $streams.length - 1 && index < 3}
    <PlusStreamBtn user={$user} />
  {:else if index >= 3}
    <div class="relative flex py-1 items-center">
      <hr class="flex-grow !border-t-2 !border-gray-500" />
      <button type="button" class="btn variant-filled mx-2 bg-error-600"
        >Maximum amount of streams is 4.</button
      >
      <hr class="flex-grow !border-t-2 !border-gray-500" />
    </div>
  {/if}
{/each}
