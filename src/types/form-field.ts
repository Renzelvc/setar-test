import type { ZodType } from 'zod';

export interface FormField<Key extends string = string> {
  key: Key;
  label: string;
  placeholder?: string;
  required?: boolean;
  schema?: ZodType;
  type?: 'input';
  attrs?: Record<string, unknown>;
}
