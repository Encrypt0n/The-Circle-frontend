<script lang="ts">
    import Chat from "$lib/components/Chat.svelte";
    import Streaming from "$lib/components/Streaming.svelte";
    import Viewcount from "$lib/components/Viewcount.svelte";
    import {user} from "$lib/stores/auth";
    import {AppShell} from "@skeletonlabs/skeleton";

    let streamer = $user;
</script>

<AppShell>

    <div class="flex flex-col p-4">
        <div class="flex justify-between items-center pb-4">
            <a href="/">
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                >
                    <path
                            fill-rule="evenodd"
                            d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                            clip-rule="evenodd"
                    />
                </svg>
            </a>

            <p class="text-2xl font-bold">{streamer?.name}</p>
        </div>

        <div class="flex justify-between p-4">
            <p> followers: {streamer?.followers.length}</p>
            <Viewcount viewers={streamer?.viewerCount}/>

            <p class="inline-flex">
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                >
                    <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.624 7.084a.75.75 0 00-1.248.832l2.223 3.334H9a.75.75 0 000 1.5h2.25v1.5H9a.75.75 0 000 1.5h2.25v1.5a.75.75 0 001.5 0v-1.5H15a.75.75 0 000-1.5h-2.25v-1.5H15a.75.75 0 000-1.5h-1.599l2.223-3.334a.75.75 0 10-1.248-.832L12 10.648 9.624 7.084z"
                            clip-rule="evenodd"
                    />
                </svg>
                {streamer?.satoshi}
            </p>
        </div>
    </div>

    <Streaming/>

    <Chat streamerName="{$user.name}"/>
</AppShell>
