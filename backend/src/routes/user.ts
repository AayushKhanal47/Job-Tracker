import { Hono } from "hono";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware";
import { requireRole } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { ApplyJobSchema } from "@aayushkhanal47/jobtracker";

export const applicationRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

applicationRouter.post(
  "/:jobId",
  jwtVerifyMiddleware,
  requireRole("USER"),
  async (c) => {
    const body = await c.req.json();
    const parsed = ApplyJobSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = c.get("user");
    const jobId = c.req.param("jobId");

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      c.status(404);
      return c.json({ error: "Job not found" });
    }

    const existing = await prisma.application.findFirst({
      where: { userId: user.id, jobId },
    });
    if (existing) {
      c.status(400);
      return c.json({ error: "Already applied" });
    }

    const application = await prisma.application.create({
      data: { userId: user.id, jobId },
    });

    return c.json({ message: "Applied successfully", application });
  }
);

applicationRouter.get(
  "/me",
  jwtVerifyMiddleware,
  requireRole("USER"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = c.get("user");
    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: { job: true },
    });

    return c.json({ applications });
  }
);
