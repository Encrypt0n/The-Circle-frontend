<script lang="ts">
  import Chat from "$lib/components/Chat.svelte";
  import Stream from "$lib/components/Stream.svelte";
  import Viewcount from "$lib/components/Viewcount.svelte";
  import Follow from "$lib/components/Follow.svelte";
  import { AppShell, Avatar } from "@skeletonlabs/skeleton";
  import type { TruYouAccount } from "$lib/interfaces";
  import { onDestroy } from "svelte";
  import {getUserByName, updateViewerCount} from "$lib/stores/users";

  export let streamer: TruYouAccount;

  onDestroy(() => {
    updateViewerCount(streamer.name, -1);
  });
</script>

<div class="max-h-fit pb-10">
  <AppShell>
    <svelte:fragment slot="sidebarRight">
      <Chat streamerName={streamer.name} class="p-2" />
    </svelte:fragment>
    <div class="flex flex-col">
      <div class="h-fit">
        <Stream streamerName={streamer.name} />
      </div>

      <div class="flex items-center m-4 gap-2">
        <Avatar
          src="https://source.unsplash.com/YOErFW8AfkI/128x128"
          width="w-24"
          rounded="rounded-full"
        />
        <div class="flex flex-col flex-grow">
          <h1 class="text-2xl">{streamer.name}</h1>
          <div class="flex">
            <Viewcount streamer={streamer.name} viewers="{streamer.viewerCount}" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pb-4">
          <Follow {streamer} />
        </div>
      </div>
    </div>
  </AppShell>
</div>
