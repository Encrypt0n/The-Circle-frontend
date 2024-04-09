import type {LayoutLoad} from "../../.svelte-kit/types/src/routes/$types";
import {user} from "$lib/stores/auth.ts"
import {get} from "svelte/store";
import {redirect} from "@sveltejs/kit";

export const load: LayoutLoad = async ({ route}) => {
    if (!get(user) && !route.id?.includes("/login")) {
        throw redirect(302, "/login")
    }
}