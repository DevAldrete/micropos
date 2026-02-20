// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/** Shape of the user object returned by the AdonisJS API. */
export interface AuthUser {
  id: number;
  fullName: string | null;
  email: string;
}

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      /** The authenticated user, populated by hooks.server.ts on every request. Null if not logged in. */
      user: import("./app").AuthUser | null;
    }
    interface PageData {
      /** The authenticated user, forwarded from Locals by the root +layout.server.ts. */
      user: import("./app").AuthUser | null;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
