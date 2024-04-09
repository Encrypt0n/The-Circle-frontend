import {writable, type Writable} from 'svelte/store';
import type {Stream} from '../interfaces';
import {verifyServerSignatureToast} from "$lib/stores/server.signature.ts";

export const streams: Writable<Stream[]> = writable([]);

export async function getStreamFromUser() {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/streamSession`
    );
    const response = await res.json();
    await verifyServerSignatureToast(response)
    return response.data;
}

