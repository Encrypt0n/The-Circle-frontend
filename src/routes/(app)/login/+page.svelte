<script lang="ts">
    import {FileDropzone} from "@skeletonlabs/skeleton";
    import {checkPrivateKey, privateKey, username} from "$lib/stores/signature";
    import {login} from "$lib/stores/auth.ts";

    let files: any
    $: if (files) setPrivateKey(files)
    async function setPrivateKey(files: any) {
        $privateKey = await checkPrivateKey(files[0])
    }

    let inComplete = true
    $: inComplete = !($privateKey !== "" && $username !== "")

</script>

<div class="flex justify-center items-center h-screen">
    <div class="w-96">
        <label class="label pb-5 text-center">
            <span>Login</span>
            <input
                    class="input"
                    type="text"
                    placeholder="User Name"
                    name="username"
                    bind:value={$username}
            />
        </label>
        <FileDropzone name="key" accept=".pem" bind:files={files}>
            <svelte:fragment slot="lead">
                <div class="flex justify-center items-center">
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
                                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                        />
                    </svg>
                </div>
            </svelte:fragment>
            <svelte:fragment slot="message"
            >Click or drop your user key here
            </svelte:fragment
            >
        </FileDropzone>

        <div class="flex justify-center pt-5">
            <button class="btn variant-filled" disabled='{inComplete}' on:click={login}>Submit</button>
        </div>
    </div>
</div>
