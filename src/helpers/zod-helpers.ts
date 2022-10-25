import { type } from 'os'
import { z, ZodAny, ZodType } from 'zod'

export const zOptionalString = z
  .string()
  .optional()
  .nullable()

export const zOptionalNumber = z
  .number()
  .optional()
  .nullable()

export const zOptionalBoolean = z
  .boolean()
  .optional()
  .nullable()
