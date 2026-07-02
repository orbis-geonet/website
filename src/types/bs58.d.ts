declare module "bs58" {
  export function decode(value: string): Uint8Array;
  export function encode(value: Uint8Array | Buffer): string;
}
