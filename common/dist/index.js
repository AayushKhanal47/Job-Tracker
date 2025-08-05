"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyJobSchema = exports.UpdateJobSchema = exports.CreateJobSchema = exports.LoginSchema = exports.SignupSchema = exports.RoleEnum = void 0;
const zod_1 = require("zod");
exports.RoleEnum = zod_1.z.enum(["USER", "ADMIN"]);
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: exports.RoleEnum.default("USER"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.CreateJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    company: zod_1.z.string().min(2),
    location: zod_1.z.string(),
    type: zod_1.z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
    description: zod_1.z.string().min(10),
    salary: zod_1.z.string().optional(),
});
exports.UpdateJobSchema = exports.CreateJobSchema.partial();
exports.ApplyJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1),
});
