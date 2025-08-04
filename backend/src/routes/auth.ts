import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";

export const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

authRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { username, password, role } = await c.req.json();

    if (!username || !password || !role) {
      c.status(400);
      return c.json({ message: "Username, password, and role are required" });
    }

    if (role !== "USER" && role !== "ADMIN") {
      c.status(400);
      return c.json({ message: "Invalid role. Must be USER or ADMIN" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: username },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword,
        role,
      },
    });

    const token = await sign(
      { id: user.id, role: user.role },
      c.env.JWT_SECRET
    );

    return c.json({ jwt: token });
  } catch (err: any) {
    console.error("Signup error:", err);
    c.status(500);
    return c.json({ error: "Something went wrong", details: err?.message });
  }
});

authRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      c.status(400);
      return c.json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      c.status(403);
      return c.json({ error: "Invalid password" });
    }

    const token = await sign(
      { id: user.id, role: user.role },
      c.env.JWT_SECRET
    );

    return c.json({ jwt: token });
  } catch (err: any) {
    console.error("Signin error:", err);
    c.status(500);
    return c.json({ error: "Something went wrong", details: err?.message });
  }
});
