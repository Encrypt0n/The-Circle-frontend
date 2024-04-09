<script lang="ts">
  import { LogAction } from "$lib/interfaces/LogInterface";
  import type { TruYouAccount } from "$lib/interfaces";
  import { user } from "$lib/stores/auth";
  import { followStreamer, unfollowStreamer } from "$lib/stores/follows";
  import { addLog } from "$lib/stores/logs";

  export let streamer: TruYouAccount;

  let following: boolean = $user?.following
    .map((user) => user.name)
    .includes(streamer.name)!;

  function follow() {
    following = true;
    addLog(LogAction.FOLLOW);
    followStreamer(streamer.name, $user!.id);
    $user!.following.push(streamer);
  }

  function unfollow() {
    following = false;
    addLog(LogAction.UNFOLLOW);
    unfollowStreamer(streamer.name, $user!.id);
    $user!.following = $user!.following.filter(
      (user) => user.name !== streamer.name
    );
  }
</script>

{#if !following}
  <button on:click={follow} class="btn variant-filled-success">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6 mr-2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
      />
    </svg>

    Follow
  </button>
{:else}
  <button on:click={unfollow} class="btn variant-filled-error">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6 mr-2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
      />
    </svg>

    Unfollow
  </button>
{/if}
