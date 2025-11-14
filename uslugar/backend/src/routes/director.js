import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import {
  addLeadToCompanyQueue,
  assignLeadToTeamMember,
  autoAssignLead,
  getCompanyLeadQueue,
  declineCompanyLead
} from '../services/company-lead-distribution.js';

const r = Router();

/**
 * Helper funkcija za provjeru da li je korisnik direktor
 */
async function isDirector(userId) {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { isDirector: true }
  });
  return providerProfile?.isDirector || false;
}

/**
 * Helper funkcija za dohvat direktora i njegovih tim članova
 */
async function getDirectorWithTeam(userId) {
  const director = await prisma.providerProfile.findFirst({
    where: {
      userId,
      isDirector: true
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true
        }
      },
      teamMembers: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
  return director;
}

/**
 * GET /api/director/team
 * Dohvati sve članove tima (samo za direktora)
 */
r.get('/team', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može pristupiti ovom endpointu.'
      });
    }

    res.json({
      director: {
        id: director.id,
        userId: director.userId,
        fullName: director.user.fullName,
        email: director.user.email,
        companyName: director.companyName
      },
      teamMembers: director.teamMembers.map(member => ({
        id: member.id,
        userId: member.userId,
        fullName: member.user.fullName,
        email: member.user.email,
        phone: member.user.phone,
        isAvailable: member.isAvailable,
        categories: member.categories.map(c => c.name)
      }))
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/team/add
 * Dodaj novog člana tima (samo za direktora)
 */
r.post('/team/add', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može dodavati članove tima.'
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId je obavezan'
      });
    }

    // Provjeri da li korisnik postoji i ima PROVIDER profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true
      }
    });

    if (!user || user.role !== 'PROVIDER') {
      return res.status(400).json({
        error: 'Korisnik mora biti PROVIDER'
      });
    }

    if (!user.providerProfile) {
      return res.status(400).json({
        error: 'Korisnik mora imati ProviderProfile'
      });
    }

    // Provjeri da li već postoji u timu
    if (user.providerProfile.companyId === director.id) {
      return res.status(400).json({
        error: 'Korisnik je već član tima'
      });
    }

    // Dodaj u tim
    await prisma.providerProfile.update({
      where: { id: user.providerProfile.id },
      data: {
        companyId: director.id
      }
    });

    res.json({
      success: true,
      message: 'Član tima uspješno dodan'
    });
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/director/team/:memberId
 * Ukloni člana iz tima (samo za direktora)
 */
r.delete('/team/:memberId', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može uklanjati članove tima.'
      });
    }

    const { memberId } = req.params;

    const member = await prisma.providerProfile.findUnique({
      where: { id: memberId }
    });

    if (!member || member.companyId !== director.id) {
      return res.status(404).json({
        error: 'Član tima nije pronađen'
      });
    }

    // Ukloni iz tima
    await prisma.providerProfile.update({
      where: { id: memberId },
      data: {
        companyId: null
      }
    });

    res.json({
      success: true,
      message: 'Član tima uspješno uklonjen'
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/director/finances
 * Dohvati financijske podatke tvrtke (samo za direktora)
 */
r.get('/finances', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može pristupiti financijskim podacima.'
      });
    }

    // Dohvati subscription direktora
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    // Dohvati fakture direktora i tim članova
    const directorInvoices = await prisma.invoice.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const teamMemberIds = director.teamMembers.map(m => m.userId);
    const teamInvoices = teamMemberIds.length > 0
      ? await prisma.invoice.findMany({
          where: { userId: { in: teamMemberIds } },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      : [];

    // Dohvati lead purchases direktora i tim članova
    const directorLeads = await prisma.leadPurchase.findMany({
      where: { providerId: req.user.id },
      include: {
        job: {
          select: {
            title: true,
            budgetMax: true,
            category: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const teamLeads = teamMemberIds.length > 0
      ? await prisma.leadPurchase.findMany({
          where: { providerId: { in: teamMemberIds } },
          include: {
            job: {
              select: {
                title: true,
                budgetMax: true,
                category: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      : [];

    // Izračunaj ukupne troškove
    const totalInvoices = [...directorInvoices, ...teamInvoices]
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Izračunaj ukupne leadove
    const totalLeads = directorLeads.length + teamLeads.length;

    res.json({
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        creditsBalance: subscription.creditsBalance,
        lifetimeCreditsUsed: subscription.lifetimeCreditsUsed,
        expiresAt: subscription.expiresAt
      } : null,
      invoices: {
        director: directorInvoices,
        team: teamInvoices,
        total: totalInvoices / 100 // Pretvori iz centi u EUR
      },
      leads: {
        director: directorLeads,
        team: teamLeads,
        total: totalLeads
      },
      summary: {
        totalSpent: totalInvoices / 100,
        totalLeads: totalLeads,
        teamSize: director.teamMembers.length
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/director/decisions
 * Dohvati ključne odluke koje čekaju na odobrenje (samo za direktora)
 */
r.get('/decisions', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može pristupiti odlukama.'
      });
    }

    const teamMemberIds = director.teamMembers.map(m => m.userId);

    // Dohvati ponude koje čekaju na odobrenje (od tim članova)
    const pendingOffers = teamMemberIds.length > 0
      ? await prisma.offer.findMany({
          where: {
            userId: { in: teamMemberIds },
            status: 'PENDING'
          },
          include: {
            job: {
              select: {
                title: true,
                budgetMax: true,
                category: { select: { name: true } }
              }
            },
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
      : [];

    // Dohvati leadove koje tim članovi trebaju odobriti
    const pendingLeads = teamMemberIds.length > 0
      ? await prisma.leadPurchase.findMany({
          where: {
            providerId: { in: teamMemberIds },
            status: 'ACTIVE'
          },
          include: {
            job: {
              select: {
                title: true,
                budgetMax: true,
                category: { select: { name: true } }
              }
            },
            provider: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
      : [];

    res.json({
      pendingOffers,
      pendingLeads,
      summary: {
        pendingOffersCount: pendingOffers.length,
        pendingLeadsCount: pendingLeads.length
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/become-director
 * Postani direktor (samo za PROVIDER-e s companyName)
 */
r.post('/become-director', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!providerProfile) {
      return res.status(404).json({
        error: 'ProviderProfile nije pronađen'
      });
    }

    if (!providerProfile.companyName) {
      return res.status(400).json({
        error: 'Morate imati companyName da biste postali direktor'
      });
    }

    // Postavi kao direktora
    await prisma.providerProfile.update({
      where: { id: providerProfile.id },
      data: {
        isDirector: true
      }
    });

    res.json({
      success: true,
      message: 'Sada ste direktor tvrtke'
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/director/lead-queue
 * Dohvati sve leadove u internom queueu tvrtke (samo za direktora)
 */
r.get('/lead-queue', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može pristupiti internom queueu.'
      });
    }

    const queue = await getCompanyLeadQueue(director.id);

    res.json({
      queue,
      stats: {
        pending: queue.filter(q => q.status === 'PENDING').length,
        assigned: queue.filter(q => q.status === 'ASSIGNED').length,
        inProgress: queue.filter(q => q.status === 'IN_PROGRESS').length,
        completed: queue.filter(q => q.status === 'COMPLETED').length
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/lead-queue/:queueId/assign
 * Ručna dodjela leada tim članu (samo za direktora)
 */
r.post('/lead-queue/:queueId/assign', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može dodijeliti lead.'
      });
    }

    const { queueId } = req.params;
    const { teamMemberId } = req.body;

    if (!teamMemberId) {
      return res.status(400).json({
        error: 'teamMemberId je obavezan'
      });
    }

    const result = await assignLeadToTeamMember(queueId, teamMemberId, director.id);

    res.json({
      success: true,
      message: 'Lead uspješno dodijeljen tim članu',
      queueEntry: result
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/lead-queue/:queueId/auto-assign
 * Automatska dodjela leada najboljem tim članu (samo za direktora)
 */
r.post('/lead-queue/:queueId/auto-assign', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može koristiti auto-assign.'
      });
    }

    const { queueId } = req.params;

    const result = await autoAssignLead(queueId, director.id);

    res.json({
      success: true,
      message: 'Lead automatski dodijeljen najboljem tim članu',
      queueEntry: result
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/lead-queue/:queueId/decline
 * Odbij lead (samo za direktora)
 */
r.post('/lead-queue/:queueId/decline', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može odbiti lead.'
      });
    }

    const { queueId } = req.params;
    const { reason } = req.body;

    const result = await declineCompanyLead(queueId, director.id, reason);

    res.json({
      success: true,
      message: 'Lead odbijen',
      queueEntry: result
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/director/lead-queue/add
 * Dodaj lead u interni queue tvrtke (samo za direktora)
 */
r.post('/lead-queue/add', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const director = await getDirectorWithTeam(req.user.id);
    
    if (!director) {
      return res.status(403).json({
        error: 'Nemate pristup',
        message: 'Samo direktor može dodati lead u interni queue.'
      });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        error: 'jobId je obavezan'
      });
    }

    const result = await addLeadToCompanyQueue(jobId, director.id);

    res.json({
      success: true,
      message: 'Lead dodan u interni queue',
      queueEntry: result
    });
  } catch (e) {
    next(e);
  }
});

export default r;

