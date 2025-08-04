import { Hono, Context } from "hono";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware";
import { requireRole } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const jobRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
    };
  };
}>();

jobRouter.post(
  "/jobs",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = c.get("user");
    const body = await c.req.json();

    if (!body.title || !body.description || !body.location) {
      c.status(400);
      return c.json({
        error: "Missing required fields: title, description, location",
      });
    }

    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        salary: body.salary,
        type: body.type || "OTHER",
        postedById: user.id,
      },
    });

    return c.json({ message: "Job created successfully", job });
  }
);

jobRouter.get("/jobs", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const jobs = await prisma.job.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      postedBy: {
        select: { email: true, role: true },
      },
    },
  });

  return c.json({ jobs });
});

jobRouter.get("/jobs/:id", jwtVerifyMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      postedBy: {
        select: { email: true, role: true },
      },
    },
  });

  if (!job) {
    c.status(404);
    return c.json({ error: "Job not found" });
  }

  return c.json({ job });
});

jobRouter.put(
  "/jobs/:id",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param("id");
    const user = c.get("user");
    const body = await c.req.json();

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      c.status(404);
      return c.json({ error: "Job not found" });
    }

    if (job.postedById !== user.id) {
      c.status(403);
      return c.json({ error: "Forbidden: You can only update your own jobs" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: body.title ?? job.title,
        description: body.description ?? job.description,
        location: body.location ?? job.location,
        salary: body.salary ?? job.salary,
        type: body.type ?? job.type,
        status: body.status ?? job.status,
      },
    });

    return c.json({ message: "Job updated", job: updatedJob });
  }
);

jobRouter.delete(
  "/jobs/:id",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param("id");
    const user = c.get("user");

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      c.status(404);
      return c.json({ error: "Job not found" });
    }

    if (job.postedById !== user.id) {
      c.status(403);
      return c.json({ error: "Forbidden: You can only delete your own jobs" });
    }

    await prisma.job.delete({ where: { id } });

    return c.json({ message: "Job deleted successfully" });
  }
);

export { jobRouter };
