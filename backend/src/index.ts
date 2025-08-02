import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "mero nam aayush ho",
  });
});
app.post("/api/login", async (c) => {
  const body = await c.req.json();
  return c.json({
    recived: body,
  });
});
export default app;
