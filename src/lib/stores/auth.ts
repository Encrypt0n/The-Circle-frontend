import {signData, username} from "$lib/stores/signature.ts";
import {verifyServerSignatureToast} from "$lib/stores/server.signature.ts";
import {toastStore} from "@skeletonlabs/skeleton";
import {goto} from "$app/navigation";
import {get, writable} from "svelte/store";
import type {TruYouAccount} from "$lib/interfaces";

export const user = writable<TruYouAccount | undefined>()
export async function login() {
    const dataToSign = {username: get(username)}
    const data = await signData(dataToSign)

    let res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        },
        mode: "cors"
    })
    let response = await res.json()
    await verifyServerSignatureToast(response)

    if (!res.ok) {
        toastStore.trigger({
            message: "Username and Private key combination is incorrect",
            background: "variant-filled-error"
        })
        return
    }

    user.set(response.data)
    console.log(get(user))
    toastStore.trigger({message: `Login Successful!`, background: "variant-filled-primary",})
    await goto("/")
}

export function logout() {
    user.set(undefined)
}