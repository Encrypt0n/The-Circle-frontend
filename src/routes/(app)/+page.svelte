<script lang="ts">
  import ClickableStream from "$lib/components/ClickableStream.svelte";
  import { getLiveUsers } from "$lib/stores/users";
  import { user } from "$lib/stores/auth.ts";
  import { onMount } from "svelte";

  let streams: any[];

  onMount(async () => {
    if ($user) {
      streams = await getLiveUsers();
    }
  });
</script>

<div>
  <div class="flex flex-col justify-center items-center text-center mx-1">
    <h1
      class="text-4xl md:text-6xl text-gray-600 mt-10 md:mt-20 text-center dark:text-white"
    >
      Welcome {$user?.name}!
    </h1>
    <p class="text-gray-600 text-lg md:text-2xl mt-5 md:mt-10 dark:text-white">
      Watch livestreams, follow your favorite streamers and chat with another.
      <br />
      All is possible in the completely open livestreaming platform: The Circle.
    </p>
    <div>
      <p
        class="italic text-gray-600 text-lg md:text-2xl dark:text-white mt-5 md:mt-10"
      >
        "Secrets are lies, sharing is caring and privacy is theft" - Tim
        Harcourt
      </p>
    </div>

    <a
      href="#middle"
      type="button"
      class="mt-5 mb-5 md:mt-10 btn bg-gradient-to-br variant-gradient-secondary-tertiary"
    >
      <span>Start watching now!</span>
    </a>
    <hr
      class="w-72 md:w-96 h-0.5 md:h-1 mx-auto my-3 md:my-4 border-0 rounded md:my-10 dark:bg-gray-700"
    />

    <ul class="grid grid-cols-1 md:grid-cols-3 gap-4 effect-3" id="middle">
      {#if streams}
        {#each streams as stream, i}
          <!-- send each user to this display-->
          <li class="display"><ClickableStream streamer={stream} /></li>
        {/each}
      {/if}
    </ul>
  </div>
</div>

<style>
  .display {
    transform: scale(0);
    animation: scaleUp 0.5s ease-in-out forwards;
  }

  .grid li {
    height: 300px;
    list-style: none;
    margin-bottom: 6px;
  }

  @keyframes scaleUp {
    0% {
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
