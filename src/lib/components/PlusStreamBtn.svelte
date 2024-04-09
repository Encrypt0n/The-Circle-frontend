<script lang="ts">
  import {
    Drawer,
    drawerStore,
    type DrawerSettings,
  } from "@skeletonlabs/skeleton";
  import { streams } from "$lib/stores/streams.ts";
  import type { Stream } from "$lib/interfaces";
  import { addLog } from "$lib/stores/logs";
  import { LogAction } from "$lib/interfaces/LogInterface";

  export let user: any;

  function openDrawer(position: "bottom"): void {
    const s: DrawerSettings = { id: "StreamDrawer", position };
    drawerStore.open(s);
  }

  function addStream(name: string) {
    let stream: Stream = {
      title: name,
      truYouAccountName: name,
    };
    streams.set([...$streams, stream]);
    addLog(LogAction.STREAM_WATCH);
    drawerStore.close();
  }
</script>

<div class="relative flex py-1 items-center">
  <hr class="flex-grow !border-t-2 !border-gray-500" />
  <button
    class="btn-icon variant-filled-primary mx-3"
    on:click={() => {
      openDrawer("bottom");
    }}
  >
    <i>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </i>
  </button>
  <hr class="flex-grow !border-t-2 !border-gray-500" />
</div>

<Drawer>
  <div class="pb-10">
    <button
      class="btn-icon absolute right-0 m-3"
      on:click={() => {
        drawerStore.close();
      }}
    >
      <i>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </i>
    </button>

    <div class="flex justify-center">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-7">
        {#if user}
          {#each user.following as following}
            {#if following.isLive}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="max-w-[20vw] rounded overflow-hidden shadow-lg"
                on:click={() => addStream(following.name)}
              >
                <img
                  class="w-full"
                  src="https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024"
                  alt="Sunset in the mountains"
                />
                <div class="px-6 py-4">
                  <div class="font-bold text-xl mb-2">
                    Live met {following.name.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        {:else}
          <div>Loading...</div>
        {/if}
      </div>
    </div>
  </div>
</Drawer>
