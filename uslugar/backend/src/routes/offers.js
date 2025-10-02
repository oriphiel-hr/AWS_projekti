import { Router } from "express";
import prisma from "../services/prisma.js";
import { auth } from "../services/auth.js";

const r = Router();

// create offer (provider)
r.post("/:jobId", auth, async (req, res) => {
  const { amount, message } = req.body;
  const jobId = req.params.jobId;

  // optional: provjeri kredite
  // await requireCredits(req.user.id, 1);

  const offer = await prisma.offer.create({
    data: { jobId, userId: req.user.id, amount, message }
  });

  res.json(offer);
});

// accept offer (job owner)
r.post("/:offerId/accept", auth, async (req, res) => {
  const offerId = req.params.offerId;
  const offer = await prisma.offer.findUnique({
    where: { id: offerId }, include: { job: true }
  });
  if (!offer) return res.status(404).send("Not found");
  if (offer.job.userId !== req.user.id) return res.status(403).send("Forbidden");
  if (offer.job.status !== "OPEN") return res.status(409).send("Already assigned");

  await prisma.$transaction([
    prisma.offer.update({ where: { id: offerId }, data: { status: "ACCEPTED" } }),
    prisma.job.update({ where: { id: offer.jobId }, data: { acceptedOfferId: offerId, status: "ASSIGNED" } }),
    prisma.offer.updateMany({ where: { jobId: offer.jobId, id: { not: offerId } }, data: { status: "REJECTED" } })
  ]);

  // TODO: send notifications/email to provider
  res.json({ ok: true });
});

// reject offer (job owner)
r.post("/:offerId/reject", auth, async (req, res) => {
  const offer = await prisma.offer.findUnique({
    where: { id: req.params.offerId }, include: { job: true }
  });
  if (!offer) return res.status(404).send("Not found");
  if (offer.job.userId !== req.user.id) return res.status(403).send("Forbidden");

  await prisma.offer.update({ where: { id: offer.id }, data: { status: "REJECTED" } });
  res.json({ ok: true });
});

export default r;
