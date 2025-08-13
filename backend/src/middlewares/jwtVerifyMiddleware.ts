import { Context } from "hono";
import { verify } from "hono/jwt";

export const jwtVerifyMiddleware = async (
  c: Context,
  next: () => Promise<void>
) => {
  let token: string | undefined;
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) {
    token = c.req.cookie("token");
  }

  if (!token) {
    c.status(401);
    return c.json({ error: "Authorization token missing" });
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }
};
