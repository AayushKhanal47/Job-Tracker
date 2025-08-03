import { Context } from "hono";
import { verify } from "hono/jwt";

export const jwtVerifyMiddleware = async (
  c: Context,
  next: () => Promise<void>
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ error: "Authorization token missing" });
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);

    c.set("user", payload);

    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }
};
