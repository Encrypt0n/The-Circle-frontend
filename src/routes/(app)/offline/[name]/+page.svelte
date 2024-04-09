<script lang="ts">
  import Chat from "$lib/components/Chat.svelte";
  import Follow from "$lib/components/Follow.svelte";
  import { AppShell, Avatar } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import { getUserByName } from "$lib/stores/users";

  let streamerName: string = $page.params.name;
</script>

<div class="max-h-fit pb-10 flex justify-center">
  <div class="w-full max-w-screen-lg">
    <AppShell>
      <div class="flex justify-center items-center h-screen">
        <div class="flex flex-col items-center">
          <div class="flex items-center m-4 gap-2 justify-center">
            <Avatar
              src="https://source.unsplash.com/YOErFW8AfkI/128x128"
              width="w-24"
              rounded="rounded-full"
            />
            <div class="flex flex-col">
              <h1 class="text-2xl text-center">
                Welcome to {streamerName}'s chat!
              </h1>
              <div class="flex justify-center">
                <p class="pr-8">Last seen: 12:03 | 13-06-2023</p>
              </div>
              <div class="gap-2 pt-2 flex justify-center">
                {#await getUserByName(streamerName)}
                  <p>Loading...</p>
                {:then streamer}
                  <Follow {streamer} />
                {:catch error}
                  <p style="color: red">{error.message}</p>
                {/await}
              </div>
            </div>
          </div>
        </div>

        <Chat {streamerName} class="p-2 ml-auto" />
      </div>
    </AppShell>
  </div>
</div>
