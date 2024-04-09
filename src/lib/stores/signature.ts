import type { Writable } from "svelte/store";
import { get, writable } from "svelte/store";
import jsrsasign from "jsrsasign"
import { verifyServerSignatureToast } from "$lib/stores/server.signature.ts";

export const privateKey: Writable<string> = writable("");
export const username: Writable<string> = writable("");

export const checkPrivateKey = async (file: any): Promise<string> => {
    try {
        return await selectPrivateKey(file);
    } catch (error) {
        console.log(error)
    }

    return "";
};

export const selectPrivateKey = async (file: Blob) => {
    let plain = await file.text()
    if (plain.startsWith("-----BEGIN PRIVATE KEY-----")) {
        return plain;
    } else {
        return "";
    }
}
interface digitalSignature<DATA> {
    payload: DATA,
    timestamp: Date,
    signature: string,
    username: string,
}

export const signData = async <DATA>(data: DATA): Promise<digitalSignature<DATA>> => {
    if (get(privateKey).length < 1) {
        return Promise.reject("Failed to sign message: invalid PrivateKey")
    }

    if (get(username).length < 1) {
        return Promise.reject("No identity found for the signature")
    }

    let date = new Date()

    let res = await fetch(`${import.meta.env.VITE_API_URL}/crypto/nonce`, {
        method: "POST",
        body: JSON.stringify({
            username: get(username),
            timestamp: date,
        }),
        headers: {
            "content-type": "application/json"
        },
        mode: "cors"
    })

    const response = await res.json();
    await verifyServerSignatureToast(response)

    const { nonce } = response;
    let dataToSign = nonce + ";"+ JSON.stringify(data)

    return {
        payload: data,
        signature: createSignature(dataToSign),
        timestamp: date,
        username: get(username)
    }
}

const createSignature = (data: string): string => {
    let sig = new jsrsasign.KJUR.crypto.Signature({ alg: "SHA256withRSA" })
    sig.init(get(privateKey))
    sig.updateString(data)
    return sig.sign()
}