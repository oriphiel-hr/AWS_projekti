import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const r = Router();

// GET /api/reviews - Lista svih review-a (za admin panel)
r.get('/', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, toUserId, fromUserId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (toUserId) where.toUserId = toUserId;
    if (fromUserId) where.fromUserId = fromUserId;
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          job: { select: { id: true, title: true } },
          from: { select: { id: true, fullName: true, email: true } },
          to: { select: { id: true, fullName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({ where })
    ]);
    
    res.json({ reviews, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) { next(e); }
});

// GET /api/reviews/user/:userId - Review-i za određenog korisnika
// Vraća samo objavljene review-e (osim ako je admin ili vlasnik)
r.get('/user/:userId', auth(false), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, includePending = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Provjeri da li je korisnik admin ili vlasnik review-a
    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = req.user?.id === userId;
    
    // Ako nije admin ili vlasnik, prikaži samo objavljene review-e
    const where = { 
      toUserId: userId,
      ...(includePending === 'true' || isAdmin || isOwner ? {} : { isPublished: true })
    };
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          job: { select: { id: true, title: true } },
          from: { select: { id: true, fullName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({ where })
    ]);
    
    res.json({ reviews, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) { next(e); }
});

// POST /api/reviews - Kreiranje novog review-a
r.post('/', auth(true), async (req, res, next) => {
  try {
    const { toUserId, rating, comment, jobId } = req.body;
    if (!toUserId || !rating || !jobId) {
      return res.status(400).json({ 
        error: 'Missing required fields: toUserId, rating, jobId' 
      });
    }
    
    // Provjeri da li job postoji i da su useri uključeni u transakciju
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: true,
        assignedProvider: true,
        acceptedOffer: true
      }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Validacija: Provjeri da su korisnici povezani preko job-a
    let isValidReview = false;
    
    if (req.user.role === 'USER') {
      // Korisnik mora biti vlasnik job-a
      if (job.userId === req.user.id && job.assignedProviderId === toUserId) {
        isValidReview = true;
      }
    } else if (req.user.role === 'PROVIDER') {
      // Pružatelj mora biti assignedProvider
      if (job.assignedProviderId === req.user.id && job.userId === toUserId) {
        isValidReview = true;
      }
    }
    
    if (!isValidReview) {
      return res.status(403).json({ 
        error: 'Niste autorizirani da ostavite recenziju za ovog korisnika. Morate biti povezani preko job-a.' 
      });
    }
    
    // Provjeri da li korisnik već ima review za ovaj job
    const existingReview = await prisma.review.findFirst({
      where: { 
        fromUserId: req.user.id, 
        jobId 
      }
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Već ste ocijenili ovaj posao' });
    }
    
    // Izračunaj review deadline (7-10 dana od završetka posla ili od trenutka)
    // Ako job ima deadline, koristimo ga; inače koristimo 10 dana od sada
    const reviewDeadlineDays = 10; // 7-10 dana (srednja vrijednost)
    const reviewDeadline = new Date();
    if (job.deadline && new Date(job.deadline) < new Date()) {
      // Ako je posao već završen (deadline prošao), postavi deadline na 10 dana od završetka
      reviewDeadline.setTime(new Date(job.deadline).getTime() + reviewDeadlineDays * 24 * 60 * 60 * 1000);
    } else {
      // Ako posao još nije završen, postavi deadline na 10 dana od sada
      reviewDeadline.setTime(reviewDeadline.getTime() + reviewDeadlineDays * 24 * 60 * 60 * 1000);
    }
    
    // Provjeri da li postoji recipročni review (druga strana)
    const reciprocalReview = await prisma.review.findFirst({
      where: {
        jobId: jobId,
        fromUserId: toUserId, // Druga strana
        toUserId: req.user.id // Trenutni korisnik
      }
    });
    
    // Ako postoji recipročni review, objavi oba odmah
    const shouldPublish = !!reciprocalReview;
    const now = new Date();
    
    const review = await prisma.review.create({
      data: { 
        jobId,
        toUserId, 
        rating: Number(rating), 
        comment: comment || '', 
        fromUserId: req.user.id,
        isPublished: shouldPublish,
        publishedAt: shouldPublish ? now : null,
        reviewDeadline: reviewDeadline
      },
      include: {
        job: {
          select: { id: true, title: true }
        },
        from: { select: { id: true, fullName: true, email: true } },
        to: { select: { id: true, fullName: true, email: true } }
      }
    });

    // Ako postoji recipročni review, objavi i njega
    if (reciprocalReview && !reciprocalReview.isPublished) {
      await prisma.review.update({
        where: { id: reciprocalReview.id },
        data: {
          isPublished: true,
          publishedAt: now
        }
      });
    }

    // Update aggregates - samo za objavljene review-e i samo za provider profile
    if (shouldPublish) {
      const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
      if (toUser?.role === 'PROVIDER') {
        const aggr = await prisma.review.aggregate({
          where: { 
            toUserId,
            isPublished: true // Samo objavljene review-e
          },
          _avg: { rating: true },
          _count: { rating: true }
        });
        await prisma.providerProfile.updateMany({
          where: { userId: toUserId },
          data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
        });
      }
    }

    res.status(201).json(review);
  } catch (e) { 
    console.error('[REVIEWS] Error creating review:', e);
    next(e); 
  }
});

// PUT /api/reviews/:id - Ažuriranje review-a
r.put('/:id', auth(true, ['USER']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const review = await prisma.review.findFirst({
      where: { id, fromUserId: req.user.id }
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating: Number(rating), comment: comment || '' },
      include: {
        from: { select: { id: true, fullName: true, email: true } },
        to: { select: { id: true, fullName: true, email: true } }
      }
    });

    // update aggregates - samo za objavljene review-e
    const toUser = await prisma.user.findUnique({ 
      where: { id: review.toUserId },
      select: { role: true }
    });

    if (toUser?.role === 'PROVIDER') {
      const aggr = await prisma.review.aggregate({
        where: { 
          toUserId: review.toUserId,
          isPublished: true // Samo objavljene review-e
        },
        _avg: { rating: true },
        _count: { rating: true }
      });
      await prisma.providerProfile.updateMany({
        where: { userId: review.toUserId },
        data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
      });
    }

    res.json(updatedReview);
  } catch (e) { next(e); }
});

// DELETE /api/reviews/:id - Brisanje review-a
r.delete('/:id', auth(true, ['USER', 'ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await prisma.review.findFirst({
      where: { 
        id, 
        ...(req.user.role !== 'ADMIN' ? { fromUserId: req.user.id } : {})
      }
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    await prisma.review.delete({ where: { id } });

    // update aggregates - samo za objavljene review-e
    const toUser = await prisma.user.findUnique({ 
      where: { id: review.toUserId },
      select: { role: true }
    });

    if (toUser?.role === 'PROVIDER') {
      const aggr = await prisma.review.aggregate({
        where: { 
          toUserId: review.toUserId,
          isPublished: true // Samo objavljene review-e
        },
        _avg: { rating: true },
        _count: { rating: true }
      });
      await prisma.providerProfile.updateMany({
        where: { userId: review.toUserId },
        data: { ratingAvg: aggr._avg.rating || 0, ratingCount: aggr._count.rating }
      });
    }

    res.status(204).send();
  } catch (e) { next(e); }
});

export default r;