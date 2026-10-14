/* eslint-disable @next/next/no-img-element */
/** Payload sets data-theme on <html>; custom.scss shows the matching logo. */
export const AdminLogo = () => (
  <span className="botz-admin-logo">
    <img className="botz-logo-light" src="/brand/botz-logo-light.webp" alt="BOTZ Marketing Agency" width={260} height={102} />
    <img className="botz-logo-dark" src="/brand/botz-logo-dark.webp" alt="BOTZ Marketing Agency" width={260} height={102} />
  </span>
)

export const AdminIcon = () => (
  <span className="botz-admin-logo">
    <img className="botz-logo-light" src="/brand/botz-mark.webp" alt="BOTZ" width={18} height={28} />
    <img className="botz-logo-dark" src="/brand/botz-mark-dark.webp" alt="BOTZ" width={18} height={28} />
  </span>
)
