export interface CarRegistration {
  id: number
  model: string
  brand: string
  type: string
  buildYear: number
  registrationNumber: string
  registeredBy: string
}

export type NewCarRegistration = Omit<CarRegistration, 'id'>
export type CarRegistrationUpdate = Partial<NewCarRegistration>
