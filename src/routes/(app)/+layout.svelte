<script lang="ts">
  // Your selected Skeleton theme:
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  // This contains the bulk of Skeletons required styles:
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import "../../app.postcss";

  import SimpleSidebar from "$lib/components/SimpleSidebar.svelte";
  import { AppShell } from "@skeletonlabs/skeleton";
  import { Toast } from '@skeletonlabs/skeleton';
  import { user } from "$lib/stores/auth.ts";


</script>

<Toast />
<AppShell>
  <svelte:fragment slot="sidebarLeft">
    {#if $user}
      <SimpleSidebar user={$user}/>
    {/if}
  </svelte:fragment>
  <slot />
</AppShell>
