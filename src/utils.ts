// Small cross-platform utilities

/**
 * Convert Uint8Array to Node Buffer if Buffer is available (Node).
 * Returns input unchanged in browsers.
 */
export function toNodeBuffer(data: Uint8Array): Buffer | Uint8Array {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (globalThis as any).Buffer !== 'undefined') {
    // @ts-ignore - Buffer exists in Node
    return Buffer.from(data.buffer);
  }
  return data;
}
