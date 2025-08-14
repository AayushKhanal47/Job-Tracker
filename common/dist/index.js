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
    location: zod_1.z.string().min(1),
    type: zod_1.z.enum([
        "ENGINEERING",
        "MARKETING",
        "SALES",
        "DESIGN",
        "HR",
        "FINANCE",
        "OTHER",
    ]),
    description: zod_1.z.string().min(10),
    salary: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.enum(["OPEN", "CLOSED"]).optional(),
});
exports.UpdateJobSchema = exports.CreateJobSchema.partial();
exports.ApplyJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1),
});
