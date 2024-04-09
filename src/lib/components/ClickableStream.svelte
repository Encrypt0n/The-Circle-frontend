<script lang="ts">
  import type { TruYouAccount } from "$lib/interfaces";
  export let streamer: TruYouAccount;
</script>

<div class="col-span-12 sm:col-span-6 md:col-span-3">
  <card class="w-full flex flex-col">
    <div class="relative">
      <a href="/watch/{streamer.name}">
        <img
          src="https://picsum.photos/seed/59/300/200"
          class="w-96 h-auto"
          alt="stream cover"
        />
      </a>
    </div>

    <div class="flex flex-row mt-2 gap-2">
      <a href="/watch/1">
        <img
          src="https://picsum.photos/seed/1/40/40"
          class="rounded-full max-h-10 max-w-10"
          alt="stream cover"
        />
      </a>

      <div class="flex flex-col">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#">
          <p class="text-black-500 text-sm font-semibold dark:text-white" />
        </a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
          class="dark:text-gray-100 text-gray-600 text-xs mt-2 dark:hover:text-gray-100"
          href="#"
        >
          {streamer.name}
        </a>
        <p class="dark:text-gray-400 text-gray-600 text-xs mt-1">
          {#if streamer.viewerCount !== undefined && streamer.viewerCount > 0}
            {streamer.viewerCount} viewers
          {:else}
            0 viewers
          {/if}
        </p>
      </div>
    </div>
  </card>
</div>
