import { Context, Next } from "hono";

export function requireRole(role: "ADMIN" | "USER") {
  return async (c: Context, next: Next) => {
    try {
      const user = c.get("user");
      if (!user) {
        c.status(401);
        return c.json({ error: "No user found" });
      }
      if (user.role !== role) {
        c.status(403);
        return c.json({ error: "Insufficient permission" });
      }
      await next();
    } catch (error) {
      c.status(500);
      return c.json({ error: "Internal server error in auth middleware" });
    }
  };
}
