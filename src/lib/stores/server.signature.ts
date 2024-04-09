import jsrsasign from "jsrsasign"
import {toastStore} from "@skeletonlabs/skeleton";

const publicKeyServer = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjYlx/alpAdBrRibYULZu\n" +
    "0eMpi5p7olrOD9BYeubdZUToO8+8qTzg5RhscSm3uFGyyXCXarjaIHVBahzkpkeR\n" +
    "9B7cFpZ3pmoJ4JZCWRCXW7zWVqnShg+4pahdzbOoR3/8Rf0JAKIIy4sX9d2RCO5i\n" +
    "aU+1xlFtHL5AN5ihhSnUKJo5/UqsigLyhlMD0rJy34s600O47zN7SqgWTSRO3nRW\n" +
    "l9QkI35/lpXjW8+9GWgMRxgh3AhfXiT7ggeHl5ICy+Al9n0Z25JPR9dHhBrXn9zx\n" +
    "UQG297FQW3TWANwxgCL+XJp9i5fLJ4tjatmXPLIhUDztX0m+8UErjX/NOp5EPiZ4\n" +
    "ZQIDAQAB\n" +
    "-----END PUBLIC KEY-----"

export const verifyServerSignature = async (message: any): Promise<boolean> => {
    console.log("message", message)
    if (!message.serverSignature) {
        return false
    }

    console.log("message", message.serverSignature)

    let serverSignatureEncrypted = message.serverSignature

    delete message.serverSignature
    let json = JSON.stringify(message)

    let sig = new jsrsasign.KJUR.crypto.Signature({alg: "SHA256withRSA"})
    sig.init(publicKeyServer)
    sig.updateString(json)
    return sig.verify(serverSignatureEncrypted)
}

export const verifyServerSignatureToast = async (message: any) => {
    if (!await verifyServerSignature(message)) {
        toastStore.trigger({message: "The servers response has been altered!", background: "variant-filled-error"})
        return false
    }
    return true
}