import {verifyServerSignatureToast} from "$lib/stores/server.signature.ts";

export async function followStreamer(
    truYouAccountName: string,
    viewerId: number 
) {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/truYouAccount/${truYouAccountName}/follow`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: viewerId}),         
        }
    );

    const response = await res.json()
    await verifyServerSignatureToast(response)
};

export async function unfollowStreamer(
    truYouAccountName: string,
    viewerId: number 
) {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/truYouAccount/${truYouAccountName}/unfollow`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: viewerId}),         
        }
    );

    const response = await res.json();
    await verifyServerSignatureToast(response)
};
