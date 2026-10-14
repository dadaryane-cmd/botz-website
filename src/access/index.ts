import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'sales'

type MaybeUser = { roles?: Role[] | null; collection?: string } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user && user.collection === 'users' && user.roles?.some((r) => roles.includes(r)))

export const isStaff = (req: PayloadRequest) => hasRole(req.user as MaybeUser, 'admin', 'editor', 'sales')

/** Any signed-in staff member. */
export const staff: Access = ({ req }) => isStaff(req)
/** Admins only: users, deletion of leads, exports, destructive operations. */
export const admins: Access = ({ req }) => hasRole(req.user as MaybeUser, 'admin')
/** People who edit website content, packages, prices and settings. */
export const editors: Access = ({ req }) => hasRole(req.user as MaybeUser, 'admin', 'editor')
/** People who manage leads. */
export const leadManagers: Access = ({ req }) => hasRole(req.user as MaybeUser, 'admin', 'sales')

export const adminsField: FieldAccess = ({ req }) => hasRole(req.user as MaybeUser, 'admin')
export const staffField: FieldAccess = ({ req }) => isStaff(req)

/**
 * Public read of published documents only. Staff can read drafts too.
 * Frontend rendering uses the Local API on the server, so this mainly
 * protects the public REST/GraphQL API from leaking drafts.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req)) return true
  return { _status: { equals: 'published' } }
}
