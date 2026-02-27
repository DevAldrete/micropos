import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

const sessionConfig = defineConfig({
  enabled: true,
  cookieName: 'adonis-session',

  /**
   * When set to true, the session id cookie will be deleted
   * once the user closes the browser.
   */
  clearWithBrowser: false,

  /**
   * Define how long to keep the session data alive without
   * any activity.
   */
  age: '2h',

  /**
   * Configuration for session cookie and the cookie store.
   *
   * DEV NOTE (cross-origin):
   *   The web app (localhost:5173) and this API (localhost:3333) run on different
   *   ports, which browsers treat as cross-site. To allow the session cookie to be
   *   sent on cross-origin requests we must use:
   *     sameSite: 'none'  — cookie is sent on all cross-site requests
   *     secure: false     — allows 'none' over plain HTTP in local dev
   *
   *   Without this, 'lax' (the browser default) blocks the cookie on cross-origin
   *   POST requests, so login/logout would appear to work but the session would
   *   never be attached to follow-up requests.
   *
   * PROD NOTE:
   *   In production the web app and API should be served from the same origin
   *   (e.g. via a reverse proxy), which lets you use:
   *     sameSite: 'lax'   — stricter, only sends cookie on same-site navigations
   *     secure: true      — cookie only sent over HTTPS (already enforced by app.inProduction)
   *   If cross-origin is unavoidable in production you MUST use HTTPS and set:
   *     sameSite: 'none'
   *     secure: true
   */
  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },

  /**
   * The store to use. Make sure to validate the environment
   * variable in order to infer the store name without any
   * errors.
   */
  store: env.get('SESSION_DRIVER'),

  /**
   * List of configured stores. Refer documentation to see
   * list of available stores and their config.
   */
  stores: {
    cookie: stores.cookie(),
  },
})

export default sessionConfig
