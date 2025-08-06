import { Hono } from "hono";
import { Bindings } from "hono/types";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware";
import { requireRole } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { UpdateJobSchema } from "@aayushkhanal47/jobtracker";

export const adminRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

adminRouter.get(
  "/applications/:jobId",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const jobId = c.req.param("jobId");

    try {
      const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return c.json({ applications });
    } catch (error) {
      console.error("Error fetching applications for job:", error);
      c.status(500);
      return c.json({ error: "Something went wrong" });
    }
  }
);

adminRouter.get(
  "/seed",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const adminUser = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
          email: "admin@example.com",
          password: "admin123",
          role: "ADMIN",
        },
      });

      const dummyJobs = [
        {
          title: "Registered Nurse",
          description: "Provide patient care and assist doctors in procedures.",
          location: "Bharatpur, Nepal",
          salary: 40000,
          type: "OTHER",
          status: "OPEN",
        },
        {
          title: "Mechanical Engineer",
          description: "Design and develop mechanical systems and components.",
          location: "Pune, India",
          salary: 60000,
          type: "ENGINEERING",
          status: "OPEN",
        },
        {
          title: "Software Developer",
          description: "Develop web applications using Node.js and React.",
          location: "San Francisco, USA",
          salary: 90000,
          type: "ENGINEERING",
          status: "OPEN",
        },
        {
          title: "IT Support Specialist",
          description: "Provide technical assistance to clients and employees.",
          location: "Bangalore, India",
          salary: 50000,
          type: "OTHER",
          status: "OPEN",
        },
        {
          title: "Graphic Designer",
          description: "Design creatives for digital and print media.",
          location: "London, UK",
          salary: 35000,
          type: "DESIGN",
          status: "OPEN",
        },
        {
          title: "Digital Marketing Manager",
          description: "Lead SEO, SEM, and social media campaigns.",
          location: "Mumbai, India",
          salary: 65000,
          type: "MARKETING",
          status: "OPEN",
        },
        {
          title: "Civil Engineer",
          description: "Manage and oversee construction projects.",
          location: "New Delhi, India",
          salary: 70000,
          type: "ENGINEERING",
          status: "OPEN",
        },
        {
          title: "AI Research Intern",
          description: "Assist in machine learning and LLM projects.",
          location: "Kathmandu, Nepal",
          salary: 30000,
          type: "OTHER",
          status: "OPEN",
        },
        {
          title: "Content Writer",
          description: "Create engaging blog and website content.",
          location: "New York, USA",
          salary: 45000,
          type: "OTHER",
          status: "OPEN",
        },
        {
          title: "Frontend Developer",
          description: "Build pixel-perfect UIs using modern frameworks.",
          location: "Chennai, India",
          salary: 55000,
          type: "ENGINEERING",
          status: "OPEN",
        },
      ];

      for (const job of dummyJobs) {
        await prisma.job.create({
          data: {
            ...job,
            postedById: adminUser.id,
          },
        });
      }

      return c.json({
        message: "Dummy jobs created with admin as postedBy.",
      });
    } catch (error) {
      console.error("Error seeding jobs:", error);
      c.status(500);
      return c.json({ error: "Failed to seed dummy jobs" });
    }
  }
);
adminRouter.patch(
  "/jobs/:id/status",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const body = await c.req.json();

    const parsed = UpdateJobSchema.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ error: parsed.error.format() });
    }

    const { status } = parsed.data;

    const allowedStatuses = ["OPEN", "CLOSED"];
    if (!allowedStatuses.includes(status)) {
      c.status(400);
      return c.json({ error: "Invalid job status" });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const jobId = c.req.param("id");

    try {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        c.status(404);
        return c.json({ error: "Job not found" });
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status },
      });

      return c.json({ message: "Job status updated", job: updatedJob });
    } catch (error) {
      console.error("Error updating job status:", error);
      c.status(500);
      return c.json({ error: "Failed to update job status" });
    }
  }
);
adminRouter.get(
  "/dashboard",
  jwtVerifyMiddleware,
  requireRole("ADMIN"),
  async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const totalJobs = await prisma.job.count();

      const totalUsers = await prisma.user.count();

      const totalApplications = await prisma.application.count();

      const applicationStats = await prisma.application.groupBy({
        by: ["status"],
        _count: true,
      });

      const topJobsRaw = await prisma.application.groupBy({
        by: ["jobId"],
        _count: { jobId: true },
        orderBy: { _count: { jobId: "desc" } },
        take: 5,
      });

      const jobIds = topJobsRaw.map((j) => j.jobId);

      const jobTitles = await prisma.job.findMany({
        where: { id: { in: jobIds } },
        select: { id: true, title: true },
      });

      const topJobs = topJobsRaw.map((j) => {
        const job = jobTitles.find((job) => job.id === j.jobId);
        return {
          jobTitle: job?.title || "Unknown",
          count: j._count.jobId,
        };
      });

      return c.json({
        totalJobs,
        totalUsers,
        totalApplications,
        applicationStats,
        topJobs,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      c.status(500);
      return c.json({ error: "Failed to fetch dashboard data" });
    }
  }
);
