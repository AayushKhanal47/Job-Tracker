import { Context } from "hono";

export const requireRole = (allowedRoles: "USER" | "ADMIN") => {
  return async (c: Context, next: () => Promise<void>) => {
    const user = c.get("user") as
      | { id: string; email: string; role: string }
      | undefined;

    if (!user) {
      c.status(401);
      return c.json({ error: "Unauthorized: No user info found" });
    }

    if (!allowedRoles.includes(user.role as "USER" | "ADMIN")) {
      c.status(403);
      return c.json({ error: "Forbidden: Insufficient permissions" });
    }

    await next();
  };
};
