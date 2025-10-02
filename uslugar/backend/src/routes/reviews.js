import { Router } from "express";
import prisma from "../services/prisma.js";
import { auth } from "../services/auth.js";

const r = Router();

// only job owner & accepted provider may leave review (each one review)
r.post("/", auth, async (req, res) => {
  const { toUserId, jobId, rating, comment } = req.body;

  const job = await prisma.job.findUnique({
    where: { id: jobId }, include: { offers: true }
  });
  if (!job || job.status !== "ASSIGNED" && job.status !== "CLOSED") {
    return res.status(400).send("Job not in reviewable state");
  }
  const accepted = job.acceptedOfferId
    ? await prisma.offer.findUnique({ where: { id: job.acceptedOfferId } })
    : null;
  if (!accepted) return res.status(400).send("No accepted offer");

  // rule: reviewer must be job owner OR accepted provider
  const allowed = (req.user.id === job.userId && toUserId === accepted.userId)
               || (req.user.id === accepted.userId && toUserId === job.userId);
  if (!allowed) return res.status(403).send("Forbidden");

  const review = await prisma.review.create({
    data: { fromUserId: req.user.id, toUserId, jobId, rating, comment }
  });

  // recalc provider aggregates
  const { _avg, _count } = await prisma.review.aggregate({
    where: { toUserId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  const prof = await prisma.providerProfile.findUnique({ where: { userId: toUserId } });
  if (prof) {
    await prisma.providerProfile.update({
      where: { id: prof.id },
      data: { ratingAvg: _avg.rating ?? 0, ratingCount: _count.rating }
    });
  }

  res.json(review);
});

export default r;
