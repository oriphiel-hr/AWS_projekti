/**
 * USLUGAR EXCLUSIVE - Team Category Matching Service
 * 
 * Uspoređuje kategorije korisnika s vještinama timova kako bi lead preuzeo najrelevantniji specijalist
 */

import { prisma } from '../lib/prisma.js';

/**
 * Izračunaj match score između kategorije posla i kategorija tim člana
 * @param {String} jobCategoryId - ID kategorije posla
 * @param {Array} teamMemberCategories - Lista ID-ova kategorija tim člana
 * @returns {Number} - Match score (0-1, gdje 1 = savršen match)
 */
export function calculateCategoryMatchScore(jobCategoryId, teamMemberCategories) {
  // Ako tim član nema kategorije, score je 0
  if (!teamMemberCategories || teamMemberCategories.length === 0) {
    return 0;
  }

  // Provjeri je li kategorija posla u kategorijama tim člana
  const hasExactMatch = teamMemberCategories.includes(jobCategoryId);
  
  if (hasExactMatch) {
    return 1.0; // Savršen match
  }

  // Može se proširiti s fuzzy matching ili hijerarhijom kategorija
  // Za sada vraćamo 0 ako nema exact match
  return 0;
}

/**
 * Pronađi najbolje matchane tim članove za posao
 * @param {String} jobId - ID posla
 * @param {String} companyId - ID tvrtke (direktorov providerProfile.id)
 * @returns {Array} - Lista tim članova sortiranih po match score-u
 */
export async function findBestTeamMatches(jobId, companyId) {
  try {
    // Dohvati posao s kategorijom
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        category: true
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Dohvati sve tim članove tvrtke
    const teamMembers = await prisma.providerProfile.findMany({
      where: {
        companyId,
        isDirector: false, // Samo tim članovi, ne direktor
        isAvailable: true
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            city: true
          }
        }
      }
    });

    if (teamMembers.length === 0) {
      return [];
    }

    // Izračunaj match score za svakog tim člana
    const matches = teamMembers.map(member => {
      const categoryIds = member.categories.map(cat => cat.id);
      const matchScore = calculateCategoryMatchScore(job.categoryId, categoryIds);
      
      return {
        teamMember: member,
        matchScore,
        categoryIds
      };
    });

    // Sortiraj po match score-u (viši = bolji)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Filtriraj samo one s match score > 0
    const validMatches = matches.filter(m => m.matchScore > 0);

    console.log(`[TEAM-MATCH] Found ${validMatches.length} matching team members for job ${jobId} in company ${companyId}`);

    return validMatches;
  } catch (error) {
    console.error('[TEAM-MATCH ERROR] Failed to find team matches:', error);
    return [];
  }
}

/**
 * Dodijeli lead najbolje matchanom tim članu
 * @param {String} jobId - ID posla
 * @param {String} companyId - ID tvrtke
 * @returns {Object|null} - Dodijeljeni tim član ili null
 */
export async function assignLeadToBestTeamMember(jobId, companyId) {
  try {
    const matches = await findBestTeamMatches(jobId, companyId);

    if (matches.length === 0) {
      console.log(`[TEAM-MATCH] No matching team members found for job ${jobId}`);
      return null;
    }

    // Uzmi najbolje matchanog tim člana
    const bestMatch = matches[0];
    const teamMemberId = bestMatch.teamMember.id;

    // Provjeri postoji li već CompanyLeadQueue entry
    const existingQueue = await prisma.companyLeadQueue.findFirst({
      where: {
        jobId,
        directorId: companyId
      }
    });

    if (existingQueue) {
      // Ažuriraj postojeći entry
      const queueEntry = await prisma.companyLeadQueue.update({
        where: { id: existingQueue.id },
        data: {
          assignedToId: teamMemberId,
          status: 'ASSIGNED',
          assignmentType: 'AUTO',
          assignedAt: new Date()
        },
        include: {
          assignedTo: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      console.log(`[TEAM-MATCH] Lead assigned to team member ${teamMemberId} with match score ${bestMatch.matchScore}`);
      return queueEntry.assignedTo;
    }

    // Kreiraj novi CompanyLeadQueue entry
    const queueEntry = await prisma.companyLeadQueue.create({
      data: {
        jobId,
        directorId: companyId,
        assignedToId: teamMemberId,
        status: 'ASSIGNED',
        assignmentType: 'AUTO',
        assignedAt: new Date()
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log(`[TEAM-MATCH] Lead assigned to team member ${teamMemberId} with match score ${bestMatch.matchScore}`);

    // Pošalji notifikaciju tim članu
    try {
      await prisma.notification.create({
        data: {
          title: 'Novi lead dodijeljen',
          message: `Direktor vam je dodijelio novi lead: ${job.title || 'Naziv posla'}`,
          type: 'TEAM_LEAD_ASSIGNED',
          userId: bestMatch.teamMember.userId,
          jobId
        }
      });
    } catch (notifError) {
      console.error('[TEAM-MATCH] Failed to send notification:', notifError);
    }

    return queueEntry.assignedTo;
  } catch (error) {
    console.error('[TEAM-MATCH ERROR] Failed to assign lead to team member:', error);
    return null;
  }
}

/**
 * Kombinirani match score (tvrtka + tim)
 * @param {String} jobId - ID posla
 * @param {String} companyProviderId - ID provider profila tvrtke (direktor)
 * @returns {Object} - { companyMatchScore, teamMatchScore, bestTeamMember, combinedScore }
 */
export async function calculateCombinedMatchScore(jobId, companyProviderId) {
  try {
    // Dohvati posao
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        category: true
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Dohvati provider profil tvrtke (direktor)
    const companyProfile = await prisma.providerProfile.findUnique({
      where: { id: companyProviderId },
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!companyProfile) {
      throw new Error('Company profile not found');
    }

    // Izračunaj match score tvrtke
    const companyCategoryIds = companyProfile.categories.map(cat => cat.id);
    const companyMatchScore = calculateCategoryMatchScore(job.categoryId, companyCategoryIds);

    // Pronađi najbolje matchane tim članove
    const teamMatches = await findBestTeamMatches(jobId, companyProviderId);
    const bestTeamMember = teamMatches.length > 0 ? teamMatches[0] : null;
    const teamMatchScore = bestTeamMember ? bestTeamMember.matchScore : 0;

    // Kombinirani score (60% tvrtka, 40% tim)
    const combinedScore = (companyMatchScore * 0.6) + (teamMatchScore * 0.4);

    return {
      companyMatchScore,
      teamMatchScore,
      bestTeamMember: bestTeamMember ? bestTeamMember.teamMember : null,
      combinedScore,
      hasTeamMatch: teamMatches.length > 0
    };
  } catch (error) {
    console.error('[TEAM-MATCH ERROR] Failed to calculate combined match score:', error);
    return {
      companyMatchScore: 0,
      teamMatchScore: 0,
      bestTeamMember: null,
      combinedScore: 0,
      hasTeamMatch: false
    };
  }
}

