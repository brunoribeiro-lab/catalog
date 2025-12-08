"use client";

export const hasWebCrypto =
  typeof window !== "undefined" && !!window.crypto?.subtle;

const textEncoder =
  typeof TextEncoder !== "undefined" ? new TextEncoder() : undefined;

const textDecoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder() : undefined;

async function deriveAesKey(secret: string): Promise<CryptoKey> {
  if (!hasWebCrypto || !textEncoder) throw new Error("WebCrypto indisponível");
  const material = textEncoder.encode(secret);
  const hash = await window.crypto.subtle.digest("SHA-256", material);
  return window.crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function base64EncodeUnicode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export function base64DecodeUnicode(b64: string): string {
  const bytes = base64ToBytes(b64);
  if (!textDecoder) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++)
      binary += String.fromCharCode(bytes[i]);
    return decodeURIComponent(escape(binary));
  }
  return textDecoder.decode(bytes);
}

export async function securePack(
  obj: unknown,
  secret: string
): Promise<string> {
  if (secret && hasWebCrypto && textEncoder) {
    const key = await deriveAesKey(secret);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const plaintext = textEncoder.encode(JSON.stringify(obj));
    const ciphertext = new Uint8Array(
      await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        plaintext
      )
    );
    const packed = new Uint8Array(iv.length + ciphertext.length);
    packed.set(iv, 0);
    packed.set(ciphertext, iv.length);
    return `enc:${bytesToBase64(packed)}`;
  }
  return `b64:${base64EncodeUnicode(JSON.stringify(obj))}`;
}


export async function secureUnpack(
  payload: string,
  secret: string
): Promise<unknown> {
  if (payload.startsWith("enc:")) {
    if (!secret)
      throw new Error("Secret necessário para decodificar payload encriptado");
    if (!hasWebCrypto || !textDecoder)
      throw new Error("WebCrypto/Decoder indisponível");
    const packed = base64ToBytes(payload.slice(4));
    const iv = packed.slice(0, 12);
    const ciphertext = packed.slice(12);
    const key = await deriveAesKey(secret);
    const plainBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    const text = textDecoder.decode(new Uint8Array(plainBuffer));
    return JSON.parse(text);
  }

  if (payload.startsWith("b64:")) {
    const json = base64DecodeUnicode(payload.slice(4));
    return JSON.parse(json);
  }

  try {
    return JSON.parse(payload);
  } catch {
    throw new Error("unknown payload format");
  }
}
