import { z } from 'zod'

export const carRegistrationSchema = z.object({
  model: z.string().trim().min(1, 'Enter a model.'),
  brand: z.string().trim().min(1, 'Enter a brand.'),
  type: z.string().trim().min(1, 'Enter a vehicle type.'),
  buildYear: z.string().trim().min(1, 'Enter a build year.')
    .regex(/^\d+$/, 'Enter a whole year.').pipe(
    z.coerce.number<string>()
      .int('Enter a whole year.')
      .min(1, 'Enter a valid build year.')
      .max(new Date().getFullYear(), 'Build year cannot be in the future.'),
  ),
  registrationNumber: z.string().trim().min(1, 'Enter a registration number.'),
  registeredBy: z.string().trim().min(1, 'Enter the registered owner.'),
})

export type CarRegistrationFormValues = z.input<typeof carRegistrationSchema>
