import type { TruYouAccount } from "./TruYouAccountInterface";
import type { Log } from "./LogInterface";

export interface Message {
  messageText: string;
  sender: TruYouAccount;
  receiver: TruYouAccount;
  timestamp: string;
  logData?: Log;
}
