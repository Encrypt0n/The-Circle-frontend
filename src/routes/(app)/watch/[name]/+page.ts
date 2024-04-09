import type { PageLoad } from "./$types";
import { addLog } from "$lib/stores/logs";
import { LogAction } from "$lib/interfaces/LogInterface";

export const ssr = false;
export const csr = true;

export const load: PageLoad = async () => {
  addLog(LogAction.STREAM_WATCH);
};
