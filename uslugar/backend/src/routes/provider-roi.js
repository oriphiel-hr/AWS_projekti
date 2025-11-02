// Provider ROI Dashboard - USLUGAR EXCLUSIVE
import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import {
  generateMonthlyReport,
  generateYearlyReport,
  generatePDFReport,
  generateCSVReport
} from '../services/report-generator.js';

const r = Router();

// Dohvati ROI statistiku za providera
r.get('/dashboard', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const providerId = req.user.id;
    
    // Dohvati ROI podatke
    const roi = await prisma.providerROI.findUnique({
      where: { providerId }
    });
    
    // Dohvati subscription podatke
    const subscription = await prisma.subscription.findUnique({
      where: { userId: providerId },
      select: {
        plan: true,
        creditsBalance: true,
        lifetimeCreditsUsed: true,
        lifetimeLeadsConverted: true
      }
    });
    
    // Dohvati nedavne leadove
    const recentLeads = await prisma.leadPurchase.findMany({
      where: { providerId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            title: true,
            budgetMax: true,
            category: { select: { name: true } }
          }
        }
      }
    });
    
    // Statistika po statusu
    const statusCounts = await prisma.leadPurchase.groupBy({
      by: ['status'],
      where: { providerId },
      _count: { status: true }
    });
    
    const dashboard = {
      roi: roi || {
        totalLeadsPurchased: 0,
        totalLeadsContacted: 0,
        totalLeadsConverted: 0,
        totalCreditsSpent: 0,
        totalRevenue: 0,
        conversionRate: 0,
        roi: 0,
        avgLeadValue: 0
      },
      subscription: subscription || {
        plan: 'NONE',
        creditsBalance: 0,
        lifetimeCreditsUsed: 0,
        lifetimeLeadsConverted: 0
      },
      recentLeads,
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      insights: generateInsights(roi, subscription)
    };
    
    res.json(dashboard);
  } catch (e) {
    next(e);
  }
});

// Mjesečna statistika
r.get('/monthly-stats', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const { year, month } = req.query;
    
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const purchases = await prisma.leadPurchase.findMany({
      where: {
        providerId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        job: {
          select: { budgetMax: true }
        }
      }
    });
    
    const stats = {
      month: startDate.toLocaleDateString('hr-HR', { year: 'numeric', month: 'long' }),
      totalPurchased: purchases.length,
      totalContacted: purchases.filter(p => p.status === 'CONTACTED' || p.status === 'CONVERTED').length,
      totalConverted: purchases.filter(p => p.status === 'CONVERTED').length,
      totalCreditsSpent: purchases.reduce((sum, p) => sum + p.creditsSpent, 0),
      estimatedRevenue: purchases
        .filter(p => p.status === 'CONVERTED')
        .reduce((sum, p) => sum + (p.job.budgetMax || 0), 0),
      conversionRate: purchases.length > 0 
        ? (purchases.filter(p => p.status === 'CONVERTED').length / purchases.length) * 100 
        : 0
    };
    
    res.json(stats);
  } catch (e) {
    next(e);
  }
});

// Najbolji leadovi (najviše profita)
r.get('/top-leads', auth(true, ['PROVIDER']), async (req, res, next) => {
  try {
    const providerId = req.user.id;
    const { limit } = req.query;
    
    const topLeads = await prisma.leadPurchase.findMany({
      where: {
        providerId,
        status: 'CONVERTED'
      },
      take: limit ? parseInt(limit) : 10,
      orderBy: { convertedAt: 'desc' },
      include: {
        job: {
          select: {
            title: true,
            budgetMax: true,
            category: { select: { name: true } },
            city: true
          }
        }
      }
    });
    
    res.json({
      total: topLeads.length,
      leads: topLeads
    });
  } catch (e) {
    next(e);
  }
});

// Generiraj personalizirane insights
function generateInsights(roi, subscription) {
  const insights = [];
  
  if (!roi) {
    insights.push({
      type: 'info',
      message: 'Dobrodošli! Kupite svoj prvi lead i počnite zarađivati.'
    });
    return insights;
  }
  
  // Conversion rate
  if (roi.conversionRate < 20) {
    insights.push({
      type: 'warning',
      message: `Stopa konverzije je ${roi.conversionRate.toFixed(1)}%. Pokušajte brže kontaktirati klijente.`
    });
  } else if (roi.conversionRate > 50) {
    insights.push({
      type: 'success',
      message: `Odlično! Vaša stopa konverzije je ${roi.conversionRate.toFixed(1)}% - iznad prosjeka!`
    });
  }
  
  // ROI
  if (roi.roi > 200) {
    insights.push({
      type: 'success',
      message: `Fantastičan ROI od ${roi.roi.toFixed(0)}%! Nastavite tako!`
    });
  } else if (roi.roi < 50 && roi.totalLeadsPurchased > 5) {
    insights.push({
      type: 'warning',
      message: `ROI od ${roi.roi.toFixed(0)}% je ispod očekivanog. Fokusirajte se na kvalitetnije leadove.`
    });
  }
  
  // Neaktivni leadovi
  const activeRate = roi.totalLeadsPurchased > 0 
    ? (roi.totalLeadsContacted / roi.totalLeadsPurchased) * 100 
    : 0;
    
  if (activeRate < 80 && roi.totalLeadsPurchased > 3) {
    insights.push({
      type: 'warning',
      message: `Kontaktirali ste samo ${activeRate.toFixed(0)}% kupljenih leadova. Brže reagirajte!`
    });
  }
  
  // Credits low
  if (subscription && subscription.creditsBalance < 5) {
    insights.push({
      type: 'alert',
      message: `Imate samo ${subscription.creditsBalance} kredita. Nadopunite ih da ne propustite leadove!`
    });
  }
  
  return insights;
}

export default r;

