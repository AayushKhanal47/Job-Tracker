import { Hono } from "hono";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware";
import { requireRole } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CreateJobSchema } from "@aayushkhanal47/jobtracker";

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
    const body = await c.req.json();
    const { title, description, location, salary, type } = body;
    const newSalary = Number(salary);

    const parsed = CreateJobSchema.safeParse({
      title,
      description,
      location,
      type,
      salary: newSalary,
    });

    if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);
    if (!title || !description || !location)
      return c.json(
        { error: "Missing required fields: title, description, location" },
        400
      );

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const user = c.get("user");

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary: newSalary,
        type: type || "OTHER",
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
  const url = new URL(c.req.url);

  const location = url.searchParams.get("location");
  const type = url.searchParams.get("type");
  const minSalary = url.searchParams.get("minSalary");
  const maxSalary = url.searchParams.get("maxSalary");
  const search = url.searchParams.get("search");

  const where: any = { status: "OPEN" };
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (type) where.type = type;
  if (minSalary || maxSalary) {
    where.salary = {};
    if (minSalary) where.salary.gte = Number(minSalary);
    if (maxSalary) where.salary.lte = Number(maxSalary);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { postedBy: { select: { email: true, role: true } } },
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
    include: { postedBy: { select: { email: true, role: true } } },
  });

  if (!job) return c.json({ error: "Job not found" }, 404);
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
    const body = await c.req.json();
    const user = c.get("user");

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return c.json({ error: "Job not found" }, 404);
    if (job.postedById !== user.id)
      return c.json(
        { error: "Forbidden: You can only update your own jobs" },
        403
      );

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

jobRouter.patch("/admin/applications/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { id } = c.req.param();
  const { status } = await c.req.json();

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    });
    return c.json(updatedApplication);
  } catch (err) {
    return c.json({ error: "Application not found" }, 404);
  }
});

jobRouter.get(
  "/admin/applications/:jobId",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { jobId } = c.req.param();

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: { select: { email: true } },
        job: { select: { title: true } },
      },
    });

    return c.json({ applications });
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
    if (!job) return c.json({ error: "Job not found" }, 404);
    if (job.postedById !== user.id)
      return c.json(
        { error: "Forbidden: You can only delete your own jobs" },
        403
      );

    await prisma.job.delete({ where: { id } });
    return c.json({ message: "Job deleted successfully" });
  }
);

export { jobRouter };
