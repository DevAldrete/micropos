import { PUBLIC_API_URL } from "$env/static/public";
import { Transmit, type Subscription } from "@adonisjs/transmit-client";

// ---------------------------------------------------------------------------
// Browser-only Transmit (SSE) client singleton
// ---------------------------------------------------------------------------

let instance: Transmit | null = null;

/**
 * Simple fallback UID generator that works on insecure origins (HTTP).
 * `crypto.randomUUID()` is only available in secure contexts (HTTPS + localhost
 * on some browsers), so we provide our own generator for dev on plain HTTP.
 */
function uid(): string {
  // crypto.getRandomValues works in all modern browsers regardless of origin
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Format as a simple hex string
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Returns (or lazily creates) a singleton Transmit client.
 * Must only be called in the browser.
 */
export function getTransmit(): Transmit {
  if (instance) return instance;

  instance = new Transmit({
    baseUrl: PUBLIC_API_URL,
    uidGenerator: uid,
    maxReconnectAttempts: 10,
  });

  return instance;
}

// ---------------------------------------------------------------------------
// Channel helpers
// ---------------------------------------------------------------------------

const CHANNELS = ["inventory", "orders", "customers", "team"] as const;
export type ChannelKind = (typeof CHANNELS)[number];

/**
 * Subscribe to all four tenant-scoped channels and invoke `onMessage` whenever
 * any channel receives a payload.
 *
 * Returns an unsubscribe function that tears down every subscription.
 */
export async function subscribeToTenant(
  tenantId: number,
  onMessage: (channel: ChannelKind, payload: unknown) => void,
): Promise<() => void> {
  const transmit = getTransmit();
  const subs: Subscription[] = [];

  for (const kind of CHANNELS) {
    const sub = transmit.subscription(`tenants/${tenantId}/${kind}`);
    await sub.create();
    sub.onMessage((msg) => onMessage(kind, msg));
    subs.push(sub);
  }

  return async function unsubscribe() {
    for (const sub of subs) {
      try {
        await sub.delete();
      } catch {
        // Ignore errors during teardown (e.g. connection already closed)
      }
    }
  };
}
