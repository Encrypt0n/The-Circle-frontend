<script lang="ts">

    import {signData} from "$lib/stores/signature";
    import {onDestroy} from "svelte";
    import {AppShell} from "@skeletonlabs/skeleton";

    let mediaRecorder: any;
    let websocket: any;
    let videoElement: any;
    let live = false;

let urlParts = window.location.href.split("/");   
let username = urlParts[urlParts.length - 1];


    // Function to start streaming
    async function startStreaming() {
        live = true
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

            videoElement.srcObject = stream;


            //const options = { mimeType: 'video/h264' };
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
            mediaRecorder.addEventListener('error', handleError);
            mediaRecorder.addEventListener('start', handleStart);
            mediaRecorder.addEventListener('stop', handleStop);

            websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL+'?streamname='+username); // Replace with your WebSocket server URL

            websocket.addEventListener('open', handleWebSocketOpen);
            websocket.addEventListener('error', handleWebSocketError);
            websocket.addEventListener('close', handleWebSocketClose);
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Function to handle data available from MediaRecorder
    async function handleDataAvailable(event) {
        console.log('Data available from MediaRecorder');
        if (event.data && event.data.size > 0) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64result = arrayBufferToBase64(reader.result);
                if (websocket.readyState === WebSocket.OPEN) {
                    console.log('Sending data to server');

                    let data = await signData(base64result);
                    console.log(data);
                    //const signedData = data;
                    //console.log(signedData);
                    let test = JSON.stringify(data)
                    console.log(test);

                    websocket.send(test);
                }
            };
            reader.readAsArrayBuffer(event.data);
        }
    }

    // Function to handle MediaRecorder error
    function handleError(error) {
        console.error('MediaRecorder error:', error);
    }

    // Function to handle MediaRecorder start event
    function handleStart() {
        console.log('MediaRecorder started');
    }

    // Function to handle MediaRecorder stop event
    function handleStop() {
        console.log('MediaRecorder stopped');
    }

    // Function to handle WebSocket connection open event
    function handleWebSocketOpen() {
        console.log('WebSocket connection established');
        mediaRecorder.start(100); // Start the media recorder, specify the time slice (in milliseconds) to receive data in chunks
    }

    // Function to handle WebSocket error event
    function handleWebSocketError(error) {
        console.error('WebSocket error:', error);
    }

    // Function to handle WebSocket connection close event
    function handleWebSocketClose() {
        console.log('WebSocket connection closed');
        mediaRecorder.stop(); // Stop the media recorder when the WebSocket connection is closed
    }

    // Function to stop streaming
    function stopStreaming() {
        live = false;
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.close();
        }
    }

    onDestroy(() => {
        stopStreaming()
    })

</script>

<video bind:this={videoElement} class="md:w-[75vw] max-h-[70vh] self-center py-5" autoplay muted playsinline ></video>

<div class="flex justify-center gap-2 pb-4">
    {#if !live}
        <button on:click={startStreaming} class="btn variant-filled-primary">
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
            >
                <path
                        fill-rule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clip-rule="evenodd"
                />
            </svg>

            <p class="text-gray-900 bold">Go Live</p>
        </button>
    {/if}

    {#if live}
        <button on:click={stopStreaming} class="btn variant-filled-error">
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
            >
                <path
                        fill-rule="evenodd"
                        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                        clip-rule="evenodd"
                />
            </svg>

            Pause
        </button>
    {/if}
</div>

