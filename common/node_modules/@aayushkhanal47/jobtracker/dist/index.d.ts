import { z } from "zod";
export declare const RoleEnum: z.ZodEnum<{
    USER: "USER";
    ADMIN: "ADMIN";
}>;
export declare const SignupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
}, z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const CreateJobSchema: z.ZodObject<{
    title: z.ZodString;
    company: z.ZodString;
    location: z.ZodString;
    type: z.ZodEnum<{
        "Full-Time": "Full-Time";
        "Part-Time": "Part-Time";
        Contract: "Contract";
        Internship: "Internship";
    }>;
    description: z.ZodString;
    salary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateJobSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        "Full-Time": "Full-Time";
        "Part-Time": "Part-Time";
        Contract: "Contract";
        Internship: "Internship";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    salary: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const ApplyJobSchema: z.ZodObject<{
    jobId: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type ApplyJobInput = z.infer<typeof ApplyJobSchema>;
