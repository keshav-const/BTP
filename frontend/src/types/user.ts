export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
