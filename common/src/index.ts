import { z } from "zod";

export const RoleEnum = z.enum(["USER", "ADMIN"]);

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: RoleEnum.default("USER"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateJobSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(1),
  type: z.enum([
    "ENGINEERING",
    "MARKETING",
    "SALES",
    "DESIGN",
    "HR",
    "FINANCE",
    "OTHER",
  ]),
  description: z.string().min(10),
  salary: z.number().int().positive().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export const ApplyJobSchema = z.object({
  jobId: z.string().min(1),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type ApplyJobInput = z.infer<typeof ApplyJobSchema>;
