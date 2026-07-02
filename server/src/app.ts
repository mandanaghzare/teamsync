import express from "express";
import authRoutes from "./routes/auth.routes";
import teamRoutes from "./routes/team.routes";
import projectRoutes from "./routes/project.routes"

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);

export default app;