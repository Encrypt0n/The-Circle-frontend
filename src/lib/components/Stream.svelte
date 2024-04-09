<script lang="ts">
    import { verifyServerSignatureToast } from "$lib/stores/server.signature";
import { onMount } from "svelte";

export let streamerName: string;

let videoElement: HTMLVideoElement;
let mediaSource = new MediaSource();
let sourceBuffer: SourceBuffer | null = null;
let queue: Blob[] = [];
let isUpdating = false;

let urlParts = window.location.href.split("/");   
let username = urlParts[urlParts.length - 1];

onMount(async () => {
  if (videoElement) {
    videoElement.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", function () {
      sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8, opus"');
      sourceBuffer.addEventListener("updateend", function () {
        isUpdating = false;
        if (queue.length > 0) {
          appendNextBuffer();
        }
      });

      const ws = new WebSocket("ws://localhost:3002"+'?streamname='+username);

      ws.onopen = function open() {
        console.log("connected");
      };

      ws.onclose = function close() {
        console.log("disconnected");
      };

      ws.onmessage = async function incoming(event) {
        const blob = event.data;
       // console.log(blob);
        const {frame, serverSignature} = JSON.parse(blob);
       // console.log(serverSignature);
        
        //var buf = new Buffer(frame, 'base64'); //
        let buf = base64ToUint8Array(frame);
        let blob2 = uint8ArrayToBlob(buf, 'video/webm; codecs="vp8, opus"');
        
        //console.log(buf);
        //const decodedFrame = b64toBlob(frame, 'video/webm; codecs="vp8, opus"');
        //var buf = new Blob(frame, 'base64'); //
        if (blob2 instanceof Blob) {
         // if (await verifyServerSignatureToast(blob)) {
            queue.push(blob2);
            appendNextBuffer();
         // }
          
        }
      };
    });
  }
});

function uint8ArrayToBlob(uint8Array: any, contentType: any) {
  const blob = new Blob([uint8Array], { type: contentType });
  return blob;
}


function base64ToUint8Array(base64: any) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}


function base64ToBuffer(base64: any) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const buffer = new ArrayBuffer(length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  return Buffer.from(buffer);
}


const b64toBlob = (b64Data: any, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function base64ToArrayBuffer(base64: any) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function appendNextBuffer() {
  if (sourceBuffer && !isUpdating && queue.length > 0) {
    const blob = queue.shift();
    if (blob) {
      isUpdating = true;

      const reader = new FileReader();
      reader.onloadend = function () {
        const arrayBuffer = reader.result as ArrayBuffer;
        if (sourceBuffer && mediaSource.readyState === "open") {
          sourceBuffer.appendBuffer(arrayBuffer);
        } else {
          queue.unshift(blob);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
  }
}




</script>

<video
  class="w-[75vw] max-h-[80vh] align-middle"
  bind:this={videoElement}
  autoplay
  muted
  controls
/>