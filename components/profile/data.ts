export type UserProfile = {
     id: string
     firstName: string
     lastName: string
     email: string
     avatar: string
     phone?: string
     address?: string
     city?: string
     zip?: string
     country?: string
}

export const defaultProfile: UserProfile = {
     id: '1',
     firstName: 'Carlos',
     lastName: 'Sainz',
     email: 'carlos.s@example.com',
     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
     phone: '+234 901 234 5678',
     address: '123 Main Street',
     city: 'Monaco',
     zip: '98000',
     country: 'Monaco',
}
