import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwtVerifyMiddleware } from "./middlewares/jwtVerifyMiddleware";
import { requireRole } from "./middlewares/roleMiddleware";
import { authRouter } from "./routes/auth";
import { jobRouter } from "./routes/jobs";
import { applicationRouter } from "./routes/user";
import { adminRouter } from "./routes/admin";

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

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://frontend domin",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (c) => c.text("Welcome to the Job Tracker API!"));

app.get("/public", (c) => c.json({ message: "Anyone can access this" }));

app.get("/user", jwtVerifyMiddleware, (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello User ${user.id}`, user });
});

app.get("/admin-only", jwtVerifyMiddleware, requireRole("ADMIN"), (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello Admin ${user.id}`, user });
});

app.route("/api/v1/auth", authRouter);
app.route("/api/v1", jobRouter);
app.route("/api/v1/applications", applicationRouter);
app.route("/api/v1/admin", adminRouter);

export default app;
