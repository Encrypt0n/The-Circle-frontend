import {writable, type Writable} from "svelte/store";
import {verifyServerSignatureToast} from "$lib/stores/server.signature.ts";

export const userObject: Writable<any> = writable();

export async function getLiveUsers() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/truYouAccount/live`);
    const response = await res.json();
    await verifyServerSignatureToast(response)

    const liveUsers: any[] = response.data;
    return liveUsers;
}

export async function getUserById(userId: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/truYouAccount/${userId}`);
    const response = await res.json();
    await verifyServerSignatureToast(response)

    const user: any = response.data;
    return user;
}

export async function getLiveUserById(id: number) {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/truYouAccount/${id}/isLive`
    );
    const response = await res.json();
    await verifyServerSignatureToast(response)

    const liveUser: any = response.data;
    return liveUser;
}

export async function getUserByName(name: string) {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/truYouAccount/name/${name}`
    );
    const response = await res.json();
    await verifyServerSignatureToast(response)

    const user: any = response.data;
    return user;
}

export async function updateViewerCount(name: string, viewerCount: number) {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/truYouAccount/name/${name}/updateViewerCount`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({viewerCount: viewerCount}),      
        }
    );
    const response = await res.json();
    await verifyServerSignatureToast(response)
    return response.data;
}
