import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.coerce.number().min(1, "Age must be greater than 0").max(120, "Age is invalid"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  status: z.enum(["Stable", "Critical", "Scheduled", "Testing"])
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(4, "Password must be at least 4 characters").optional(),
  pin: z.string().min(4, "Token PIN must be at least 4 characters").optional(),
  role: z.enum(["doctor", "patient"])
});
export type PatientSchemaInput = z.infer<typeof patientSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;
