import type {Log} from "$lib/interfaces";
import {signData} from "$lib/stores/signature.ts";
import {user} from "$lib/stores/auth.ts"
import {get} from "svelte/store";
import { verifyServerSignatureToast } from "./server.signature";
import type { LogAction } from "$lib/interfaces/LogInterface";

export const addLog = async (logAction: LogAction) => {
    const truYou = get(user)
    if (truYou) {
      let logWatch: Log = {
        action: logAction,
        truYouAccount: truYou.id,
      };
      console.log(logWatch)

        const signedLog = await signData(logWatch);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signedLog),
          mode: "cors"
        });
        const response = await res.json()
        await verifyServerSignatureToast(response);
    }
};
