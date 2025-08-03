import { Hono } from "hono";
import { jwtVerifyMiddleware } from "./middlewares/jwtVerifyMiddleware";
import { requireRole } from "./middlewares/roleMiddleware";
import { authRouter } from "./routes/auth";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    user: {
      id: string;
      email: string;
      role: "USER" | "ADMIN";
    };
  };
}>();

app.get("/", (c) => c.text("Welcome to the Job Tracker API!"));

app.get("/public", (c) => c.json({ message: "Anyone can access this" }));

app.get("/user", jwtVerifyMiddleware, (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello User ${user.id}`, user });
});

app.get("/admin-only", jwtVerifyMiddleware, requireRole(["ADMIN"]), (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello Admin ${user.id}`, user });
});

app.route("/api/v1/auth", authRouter);

export default app;
