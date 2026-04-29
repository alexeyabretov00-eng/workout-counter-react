import type express from 'express'

import { AUTH_COOKIE_NAME, getCookieOptions } from '../../auth.js'

export const registerLogoutRoute = (router: express.Router): void => {
  router.post('/logout', (req, res) => {
    const opts = getCookieOptions()
    res.clearCookie(AUTH_COOKIE_NAME, {
      path: '/',
      sameSite: opts.sameSite,
      httpOnly: true,
      secure: opts.secure,
    })
    res.status(200).json({ ok: true })
  })
}
