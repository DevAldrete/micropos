import vine from '@vinejs/vine'

export const inviteMemberValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().minLength(8).maxLength(255),
    password_confirmation: vine.string(),
    fullName: vine.string().trim().minLength(2).maxLength(255),
    role: vine.enum(['admin', 'employee']),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    role: vine.enum(['owner', 'admin', 'employee']),
  })
)
