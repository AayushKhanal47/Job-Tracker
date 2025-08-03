import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";

export const authRouter = new Hono<{ Bindings: { DATABASE_URL: string; JWT_SECRET: string } }>();

function getPrismaClient(env: { DATABASE_URL: string }) {
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(withAccelerate());
}

authRouter.post("/signup", async (c) => {
  const prisma = getPrismaClient(c.env);
  try {
    const { username, password, role } = await c.req.json();

    if (!username || !password) {
      c.status(400);
      return c.json({ message: "Username and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: username } });
    if (existingUser) {
      c.status(409);
      return c.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER", 
      },
    });

    const token = await sign({ id: user.id, role: user.role }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (err: any) {
    c.status(500);
    return c.json({ error: "Signup failed", details: err.message });
  }
});

authRouter.post("/signin", async (c) => {
  const prisma = getPrismaClient(c.env);
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      c.status(400);
      return c.json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: username } });
    if (!user) {
      c.status(403);
      return c.json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      c.status(403);
      return c.json({ error: "Invalid password" });
    }

    const token = await sign({ id: user.id, role: user.role }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (err: any) {
    c.status(500);
    return c.json({ error: "Signin failed", details: err.message });
  }
});
