import express from "express";
import jobs from "./routes/jobs.js";
import offers from "./routes/offers.js";
import reviews from "./routes/reviews.js";
import providers from "./routes/providers.js";

const app = express();
app.use(express.json());

// health FIRST (bez auth-a)
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use("/api/jobs", jobs);
app.use("/api/offers", offers);
app.use("/api/reviews", reviews);
app.use("/api/providers", providers);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("API listening on", port));
export default app;
