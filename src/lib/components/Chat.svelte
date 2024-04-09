<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import { signData } from "$lib/stores/signature.ts";
  import type { Message, TruYouAccount } from "$lib/interfaces";
  import type { Log } from "$lib/interfaces";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { verifyServerSignatureToast } from "$lib/stores/server.signature.ts";
  import { user } from "$lib/stores/auth.ts";
  import { getUserByName } from "$lib/stores/users";
  import { LogAction } from "$lib/interfaces/LogInterface";

  export let streamerName: string;

  let socket = io(import.meta.env.VITE_WEBSOCKET_URL, { upgrade: false });
  let messages: Message[] = [];
  let currentMessage: string = "";
  let elemChat: HTMLElement;
  let receiver: TruYouAccount;

  socket.on("message-broadcast", async (message: Message) => {
    if (await verifyServerSignatureToast(message)) {
      if (message.receiver.name === streamerName) messages = [...messages, message];
      setTimeout(() => {
        scrollChatBottom();
      }, 500);
    }
  });

  socket.on("valid-message", (validMessage: boolean) => {
    if (!validMessage)
      toastStore.trigger({
        message: "The message you sent has a invalid signature!",
        background: "variant-filled-warning",
      });
  });

  onMount(async () => {
    receiver = await getUserByName(streamerName);

    elemChat.onscroll = () => {
      if (elemChat.scrollTop === 0) {
        addLatestMessages();
      }
    };

    initMessages();
  });

  async function initMessages() {
    await addLatestMessages();
    scrollChatBottom();
  }

  async function sendMessage() {
    if (!currentMessage || !$user) return;

    let sender: TruYouAccount = $user;

    let log: Log = {
      action: LogAction.COMMENT,
      truYouAccount: sender.id,
    };

    let message: Message = {
      sender,
      receiver,
      messageText: currentMessage,
      timestamp: new Date().toLocaleString(),
      logData: log,
    };

    try {
      const signedMessage = await signData(message);
      socket.emit("message", signedMessage);
    } catch (e) {
      console.log(e);
    }

    currentMessage = "";
  }

  function scrollChatBottom(): void {
    if (elemChat) {
      elemChat.scrollTo({ top: elemChat.scrollHeight, behavior: "smooth" });
    }
  }

  async function addLatestMessages(): Promise<void> {
    let request = await fetch(
      `${import.meta.env.VITE_API_URL}/message/latest/?receiverId=${receiver.id}&limit=10&offset=${messages.length}`,
      {
        method: "GET",
      }
    );

    let response = await request.json();
    if (await verifyServerSignatureToast(response)) {
      messages = [...response.data, ...messages];
    }
  }
</script>

<div class="flex flex-col max-h-[90vh] h-screen justify-between">
  <div
    bind:this={elemChat}
    class="flex flex-col gap-2 overflow-y-scroll max-h-[200px] sm:max-h-[90vh] sm:w-80 {$$props.class
      ? $$props.class
      : ''}"
  >
    {#each messages as message}
      <div class="card p-4 variant-soft rounded-tl-none space-y-2">
        <header class="flex justify-between items-center">
          <p class="font-bold">{message.sender.name}</p>
          <small class="opacity-50">{message.timestamp}</small>
        </header>
        <p class="break-words">
          {message.messageText}
        </p>
      </div>
    {/each}
  </div>

  <div class="py-2 flex justify-center">
    <div
      class="input-group input-group-divider inline-flex bottom-2 right-0 sm:w-[90%]"
    >
      <input
        bind:value={currentMessage}
        on:keypress={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        class="ml-3 w-full"
        placeholder="Write a message..."
      />
      <button on:click={sendMessage} class="variant-filled-primary">Send</button
      >
    </div>
  </div>
</div>
