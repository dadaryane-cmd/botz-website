import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { admins, adminsField, hasRole, isStaff } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Administration',
    description: 'People who can sign in to the admin. There is no public sign-up.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // Only admins may create or delete accounts; there is no public registration.
    create: admins,
    delete: admins,
    read: ({ req }) => {
      if (hasRole(req.user as never, 'admin')) return true
      if (!req.user) return false
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (hasRole(req.user as never, 'admin')) return true
      if (!req.user) return false
      return { id: { equals: req.user.id } }
    },
    admin: ({ req }) => isStaff(req),
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        // Block the open "create first user" endpoint. The first admin is
        // created from the command line: `npm run admin:create`.
        if (operation === 'create' && !req.user && !req.context?.allowAdminSetup) {
          throw new APIError(
            'Accounts cannot be created here. The first administrator is created with "npm run admin:create" on the server.',
            403,
          )
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      access: { create: adminsField, update: adminsField },
      options: [
        { label: 'Administrator (everything, users, exports, deletion)', value: 'admin' },
        { label: 'Editor (website content, packages, prices, settings)', value: 'editor' },
        { label: 'Sales (leads)', value: 'sales' },
      ],
    },
    {
      name: 'leadPerson',
      type: 'select',
      label: 'Lead assignment identity',
      admin: { description: 'Which contact person this account represents when leads are assigned.' },
      options: [
        { label: 'Mariam', value: 'mariam' },
        { label: 'Edgar', value: 'edgar' },
      ],
    },
  ],
}
