<script lang="ts">
  import type { TruYouAccount } from "$lib/interfaces";
  import {
    AppRail,
    Avatar,
    AppRailAnchor,
    LightSwitch,
  } from "@skeletonlabs/skeleton";

  export let user: TruYouAccount;
</script>

<div class="flex flex-col h-screen max-h-screen">
  <AppRail class="flex-1">
    <svelte:fragment slot="lead">
      <div class="flex justify-center items-center pt-4">
        <AppRailAnchor href="/">
          <img src="/favicon.png" class="h-14 w-14" alt="Home" />
          <h1>The Circle</h1>
        </AppRailAnchor>
      </div>
    </svelte:fragment>
    <div class="overflow-x-auto whitespace-nowrap max-h-[70vh]">
      {#if user && user.following != null}
        {#each user.following as following}
          {#if following.isLive}
            <AppRailAnchor
              href="/watch/{following.name}"
              title="Streamer {following.name}"
            >
              <svelte:fragment slot="lead">
                <Avatar
                  border="border-4 !border-success-600"
                  src="/avatar_1.jpg"
                  initials={following.name[0] + following.name[1]}
                  width="w-11"
                />
              </svelte:fragment>
            </AppRailAnchor>
          {:else}
            <AppRailAnchor
              href="/offline/{following.name}"
              title="Streamer {following.name}"
            >
              <svelte:fragment slot="lead">
                <Avatar
                  border="border-4 !border-error-600"
                  src="/avatar_1.jpg"
                  initials={following.name[0] + following.name[1]}
                  width="w-11"
                />
              </svelte:fragment>
            </AppRailAnchor>
          {/if}
        {/each}
      {:else}
        <div class="mt-4 ms-1">Loading...</div>
      {/if}
    </div>
    <AppRailAnchor href="/stream/{user.name}">
      <button class="btn variant-filled-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="lime"
          class="w-6 h-6"
        >
          <path
            d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z"
          />
        </svg>
      </button>
    </AppRailAnchor>
    <AppRailAnchor>
      <svelte:fragment slot="lead"><LightSwitch /></svelte:fragment>
    </AppRailAnchor>
  </AppRail>
</div>
