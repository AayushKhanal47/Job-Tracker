import { Hono } from "hono";
import { Bindings } from "hono/types";
import { jwtVerifyMiddleware } from "../middlewares/jwtVerifyMiddleware";
import { requireRole } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";

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
