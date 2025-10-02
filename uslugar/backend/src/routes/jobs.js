import { Router } from "express";
import prisma from "../services/prisma.js";
import { auth } from "../services/auth.js";

const r = Router();

// create job
r.post("/", auth, async (req, res) => {
  const { title, description, budgetMin, budgetMax, city, lat, lng, categoryId, attachments } = req.body;
  const job = await prisma.job.create({
    data: {
      title, description, budgetMin, budgetMax, city, lat, lng,
      categoryId,
      userId: req.user.id,
      attachments: attachments?.length ? {
        create: attachments.map(a => ({ url: a.url, kind: a.kind ?? null }))
      } : undefined
    },
    include: { attachments: true }
  });
  res.json(job);
});

// get job
r.get("/:id", async (req, res) => {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id },
    include: { category: true, user: true, offers: true, attachments: true }
  });
  if (!job) return res.status(404).send("Not found");
  res.json(job);
});

// list & filter
r.get("/", async (req, res) => {
  const { categoryId, city, status = "OPEN" } = req.query;
  const jobs = await prisma.job.findMany({
    where: {
      status,
      ...(categoryId ? { categoryId } : {}),
      ...(city ? { city } : {})
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(jobs);
});

export default r;
